import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Book from "./basic_book";
import { Menu, Dropdown, Button, Pagination, Avatar, Tag, Form } from "antd";
import { EditOutlined, FileWordOutlined } from "@ant-design/icons";
import { ProList } from '@ant-design/pro-components';
import moment from "moment";

const BREADCRUMB = {
  title: "作品管理",
  lists: [
    {
      title: "作品管理",
      url: "/books/home",
    },
  ],
  buttons: [
    {
      title: "创建作品",
      url: "/books/home/add",
    },
  ],
};
class Books extends Basic_Book {
  formRef = React.createRef();

  /**
   * 构造
   */
  constructor(props) {
    super(props);
  }

  /*----------------------1 other start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/

  /**
   * index  列表数据
   */
  async __init_index(d = {}, top = true) {
    this.__breadcrumb(); 
    let server_state = await this.get_server_state();
    let category_dict = await this.get_category_dict();
    let category = await this.get_category();
    let group = await this.get_group();
    const query = webapi.utils.query();
    if (!d.filters) {
      d.filters = {};
    }
    if (query.filters) {
      try {
        d.filters = JSON.parse(query.filters);
      } catch (err) { }
    }
    if (query.state_sale) {
      d.filters.state_sale = query.state_sale;
    }
    if (query.author_id) {
      d.filters.author_id = query.author_id;
    }
    if (query.duty_user_id) {
      d.duty_user_id = query.duty_user_id;
    }

    if (query.gender) {
      d.filters.gender = query.gender;
    }
    if (query.category_id) {
      d.filters.category_id = query.category_id;
    }
    if (query.end_of_serial) {
      d.filters.end_of_serial = query.end_of_serial;
    }
    if (query.chapter_complete) {
      d.chapter_complete = query.chapter_complete;
    }

    d.q = this.state.q;
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    var data = await webapi.request.get("books/home/lists", { data: d });
    var lists = [];
    if (data.code === 10000 && data.num_rows > 0) {
      lists = data.lists;
    }
    this.setState(
      { 
        server_state,
        category_dict,
        category,
        group,
        lists: lists,
        pagination: { ...this.state.pagination, total: data.num_rows },
      },
      () => {
        top && this.__handle_scroll_top();
      }
    );
  }

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  __handle_page_changes = (page, page_size) => {
    const urlParams = new URL(window.location.href);
    const params = webapi.utils.query();
    params.page = page;
    const param = webapi.utils.http_build_query(params);
    var url = urlParams.pathname + "?" + param;
    this.props.history.replace(url);
    // super.__handle_page_change(page, page_size);
  };

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/
  __render_drawer_tag_children = (filters, field, id, name) => {
    return (
      <Tag.CheckableTag
        value={id}
        key={`${field}-${id}`}
        onChange={(checked) =>
          this.handle_filters_radio_change_values(field, id, checked)
        }
        checked={filters[field] && filters[field][id]}
      >
        {name}
      </Tag.CheckableTag>
    );
  };
  __render_index() {
    const customer = this.props.server.customer || {};
    const applications = this.props.server.applications || {};
    const group = this.state.group || {};
    const category_dict = this.state.category_dict || {};
    const server_state = this.state.server_state || {};
    const state_sale = server_state.book ? server_state.book.sale : {};
    const sign = server_state.book
      ? server_state.book.sign
        ? server_state.book.sign
        : {}
      : {};
    const sign_type = sign.type ? sign.type : {};
    const sign_sale = sign.sale ? sign.sale : {};
    const state_sale_filters = Object.keys(state_sale).map((key) => {
      return {
        text: state_sale[key].name,
        value: key,
      };
    });
    const category_filters = Object.keys(category_dict).map((key) => {
      return {
        text: category_dict[key].name,
        value: key,
      };
    });
    const state_sale_icon = {
      1: {
        name: "申请签约",
        classname: "question",
        text: "orange",
      },
      2: {
        name: "签约成功未上架",
        classname: "wow",
        text: "crimson",
      },
      3: {
        name: "签约成功已上架",
        classname: "success",
        text: "blue",
      },
      4: {
        name: "拒绝上架",
        classname: "failure",
        text: "crimson",
      },
      5: {
        name: "下架",
        classname: "failure",
        text: "crimson",
      },
      6: {
        name: "申请上架",
        classname: "question",
        text: "orange",
      },
      7: {
        name: "成功上架",
        classname: "success",
        text: "blue",
      },
      8: {
        name: "草稿",
        classname: "warning",
        text: "orange",
      },
      9: {
        name: "退搞",
        classname: "warning",
        text: "orange",
      },
      10: {
        name: "下架购买用户可看",
        classname: "wow",
        text: "crimson",
      },
      11: {
        name: "下架",
        classname: "failure",
        text: "crimson",
      },
    };
    let c = "";
    if (this.state.u_action == "sign") {
      c = this.__render_index_sign();
    }
    if (this.state.u_action == "duty") {
      c = this.__render_index_duty();
    }
    if (this.state.u_action == "edit" || this.state.u_action == "add") {
      c = this.__render_index_add_edit(this.state.u_action);
    }
    const filters = this.state.filters || {};
    const dutys = this.dutys || []; 
    let children = (
      <>
        <Form.Item label="责编" name="duty">
          <div
            style={{
              lineHeight: "32px",
              transition: "all 0.3s",
              userSelect: "none",
            }}
          >
            {dutys.map((val) => {
              return this.__render_drawer_tag_children(
                filters,
                "duty_user_id",
                val.user_id,
                val.nickname
              );
            })}
          </div>
        </Form.Item>
        <Form.Item label="排序" name="">
          <div
            style={{
              lineHeight: "32px",
              transition: "all 0.3s",
              userSelect: "none",
            }}
          >
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "words",
              "字数"
            )}
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "last_chapter_update_time",
              "更新时间"
            )}
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "chapter_10_read_num",
              "10章完读"
            )}
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "chapter_50_read_num",
              "50章完读"
            )}
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "chapter_100_read_num",
              "100章完读"
            )}
          </div>
        </Form.Item>
      </>
    );

    return (
      <>
           <ProList 
        itemLayout="vertical"
        rowKey="id"
        dataSource={state.lists}
        metas={{
          title: { dataIndex: 'name' },
          description: {
            render: (d, item) => {
              return (
                <>
                  <Link
                    to={`/books/home/?end_of_serial=${item.end_of_serial}`}
                    className={
                      'tag fill-' +
                      (item.end_of_serial == 1 ? 'stress' : 'primary')
                    }
                    onClick={() => this.__handle_init_index()}
                  >
                    <Tag>{item.end_of_serial == 1 ? '连载' : '完结'}</Tag>
                  </Link>

                  {item.gender > 0 ? (
                    <Link
                      to={'/novel/books?gender=' + item.gender}
                      className="tag"
                      onClick={() => this.__handle_init_index()}
                    >
                      <Tag>
                        {group[item.gender] ? group[item.gender].name : ''}
                      </Tag>
                    </Link>
                  ) : (
                    ''
                  )}
                  {item.category_id > 0 ? (
                    <Link
                      to={'/novel/books?category_id=' + item.category_id}
                      className="tag"
                      onClick={() => this.__handle_init_index()}
                    >
                      <Tag>
                        {category_dict[item.category_id]
                          ? category_dict[item.category_id].name
                          : ''}
                      </Tag>
                    </Link>
                  ) : (
                    ''
                  )}
                </>
              );
            },
          },
          actions: {
            render: (_, item) => {
              const items: MenuProps['items'] = [
                {
                  key: '1',
                  label: <Link to={`/books/chapter?book_id=${item.id}`}>
                    <Button type="primary" shape="round">
                      章节列表
                    </Button>
                  </Link>,
                },
                item.end_of_serial == 1 && (
                  {
                    key: '1-1',
                    label: <Link to={`/books/chapter/add?book_id=${item.id}`}>
                      <Button type="primary" shape="round">
                        添加章节
                      </Button>
                    </Link>,
                  }

                ),

                {
                  key: '2',
                  label: <Link to={`/books/volume?book_id=${item.id}`}>
                    <Button type="primary" shape="round">
                      分卷列表
                    </Button>
                  </Link>,
                },
                item.end_of_serial == 1 && (
                  {
                    key: '2-1',
                    label: <Link to={`/books/volume/add?book_id=${item.id}`}>
                      <Button type="primary" shape="round">
                        添加分卷
                      </Button>
                    </Link>,
                  }

                ),
                {
                  key: '3',
                  label: <Link to={`/books/related?book_id=${item.id}`}>
                    <Button type="primary" shape="round">
                      关联列表
                    </Button>
                  </Link>,
                },
                webapi.utils.in_array(item.state_sale, [
                  "1",
                  "2",
                  "4",
                  "5",
                  "6",
                  "8",
                  "9",
                  "10",
                  "11",
                ]) && (
                  {
                    key: '4',
                    label:
                      <Button type="primary" shape="round" onClick={() => {
                        this.handle_sale(item.id, 7);
                      }}>
                        作品上线
                      </Button>
                    ,
                  }
                ),
                item.state_sale == "7" && (
                  {
                    key: '5',
                    label:
                      <Button type="primary" shape="round" onClick={() => {
                        this.handle_sale(item.id, 11);
                      }}>
                        作品下线
                      </Button>
                    ,
                  }
                ),
                !webapi.utils.in_array(item.state_sale, [
                  "4",
                  "5",
                  "8",
                  "9",
                  "10",
                ]) && (
                  {
                    key: '4',
                    label: <Button type="primary" shape="round" onClick={() => this.generate_cover_image(item.id)}>
                      生成封面图片
                    </Button>,
                  }
                ),


              ];
              return [
                <IconText
                  icon={StarOutlined}
                  text={item.all_store}
                  key="list-vertical-star-o"
                />,
                <IconText
                  icon={LikeOutlined}
                  text={item.all_support}
                  key="list-vertical-like-o"
                />,
                <IconText
                  icon={MessageOutlined}
                  text={item.all_comment}
                  key="list-vertical-message"
                />,
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      操作
                    </Space>
                  </a>
                </Dropdown>
              ];
            },
          },
          extra: {

            render: (_, item) => {
              // console.log(d,item);
              return <>
                <img width={272} alt="logo" src={item.image} />

              </>;
            },
          },
          content: {
            dataIndex: 'intro',
          },
        }}
        pagination={state.pagination}
        request={async (params = {}, sorts, filter) => {
          return await this.__handle_tablepro_request(params, sorts, filter);
        }}
      /></any>
     
        {c}
        {this.__render_drawer(children)}
      </>
    );
  }

  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Books);
