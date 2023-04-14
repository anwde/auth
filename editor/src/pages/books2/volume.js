import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Novel from "@/pages/novel/basic_novel.js";
import {
  Form,
  Input,
  Cascader,
  Upload,
  Table,
  Image,
  List,
  Avatar,
  Menu,
  Dropdown,
  Button,
  Tag,
  Statistic,
  Descriptions,
  Space,
  Badge,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import ImgCrop from "antd-img-crop";
const BREADCRUMB = {
  title: "作品管理",
  lists: [{ title: "作品管理", url: "/novel/books" }],
  buttons: [],
};
class Volume extends Basic_Novel {
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
  async __init_index() {
    this.get_book().then((book) => {
      var lists = [
        { title: "作品管理", url: "/novel/books" },
        {
          title: book.name,
          url: "/novel/books/edit/" + this.state.book_id,
        },
        {
          title: "章节管理",
          url: "/novel/chapter/index/" + this.state.book_id,
        },
      ];
      var buttons = BREADCRUMB.buttons;
      buttons = [
        {
          title: "创建新卷",
          url: "/novel/volume/add/" + this.state.book_id,
        },
      ];
      this.__breadcrumb({ lists, buttons });
    });

    var d = {};
    d.filters = this.state.filters;
    d.q = this.state.q;
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    d.book_id = this.state.book_id;
    d.state_delete = [1,3];
    var res = await webapi.request.get("novel/volume/lists", d);
    if (res.code === 10000) {
      this.setState(
        {
          lists: res.lists,
          pagination: {
            ...this.state.pagination,
            total: res.num_rows,
          },
        },
        () => {
          this.__handle_scroll_top();
        }
      );
    }
  }

  async __init_add_edit() {
    this.get_book().then((book) => {
      var lists = [
        { title: "作品管理", url: "/novel/books" },
        {
          title: book.name,
          url: "/novel/books/edit/" + this.state.book_id,
        },
        {
          title: "章节管理",
          url: "/novel/chapter/index/" + this.state.book_id,
        },
        {
          title: "卷管理",
          url: "/novel/volume/index/" + this.state.book_id,
        },
      ];
      this.__breadcrumb({ lists });
    });
    let data = {};
    if (this.state.id) {
      var res = await webapi.request.get("novel/volume/get", {
        volume_id: this.state.id,
      });
      if (res.code === 10000) {
        data = res.data;
      }
      this.setState({ data });
      this.formRef.current && this.formRef.current.setFieldsValue(data);
    }
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  /**
   *   提交
   */

  handle_submit = async (value) => {
    value.book_id = this.state.book_id;
    value.volume_id = this.state.id;
    var res = await webapi.request.post("novel/volume/dopost", value);
    if (res.code === 10000) {
      webapi.message.success(res.message);
      const query = webapi.utils.query();
      if (query.redirect) {
        query.redirect = query.redirect + "?volume_id=" + res.data.id;
      }
      this.props.history.replace(
        query.redirect || "/novel/volume/index/" + value.book_id
      );
    } else {
      webapi.message.error(res.message);
    }
  };
  /**
   *   批量删除
   */
  handle_delete_batch = (chapter_ids = []) => {
    webapi.confirm({
      url: "novel/volume/delete",
      data: {
        u_action: "batch",
        book_id: this.state.book_id,
        ids: chapter_ids.length > 0 ? chapter_ids : this.state.selectedRowKeys,
      },
      success: (data) => {
        if (data.code === 10000) {
          webapi.message.success(data.message);
          this.init_index();
        } else {
          webapi.message.error(data.message);
        }
      },
    });
  };

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/
  __render_index() {
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "章节数",
        dataIndex: "chapters",
        key: "chapters",
        sorter: true,
      },

      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        align: "center",
        render: (field, item) => {
          return (
            <div>
              <a
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                onClick={() => {
                  this.handle_delete_batch([item.id]);
                }}
              >
                <i className="icon icon-del-thin"></i>
              </a>
              <Link
                to={"/novel/volume/edit/" + this.state.book_id + "/" + item.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="icon icon-edit"></i>
              </Link>
            </div>
          );
        },
      },
    ];

    return (
      <>
        <div className="main-header">
          <div className="row">
            <div className="title">
              <h2> 分卷管理</h2>
              <span>（共{this.state.pagination.total}卷）</span>
            </div>
            <div className="col-right">
               
              <div className="btn-group">
                <Link
                  to={"/novel/chapter/index/" + this.state.book_id}
                  className="btn w-8 round"
                >
                  <i className="icon icon-list mr-1"></i>章节列表
                </Link>
                <Link
                  to={"/novel/volume/add/" + this.state.book_id}
                  className="btn w-8 round"
                >
                  <i className="icon icon-collection mr-1"></i>添加
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content">
          <Table
            rowKey={(res) => res.id}
            dataSource={this.state.lists}
            pagination={this.state.pagination}
            loading={this.props.loading}
            columns={columns}
            onChange={this.handle_table_change}
          />
        </div>
      </>
    );
  }

  __render_add_edit(u_action) {
    const query = webapi.utils.query();
    return (
      <>
        <div className="main-header">
          <div className="row">
            <div className="title">
              <h2>分卷管理</h2>
            </div>
            <div className="col-right">
              <div className="btn-group">
			  {query.redirect ? (
                <Link className="button" to={query.redirect}
				className="btn w-8 round"
				>
					<i className="icon icon-rejection mr-1"></i>返回
                  
                </Link>
              ) : (
                ""
              )}

                <Link
                  to={"/novel/volume/index/" + this.state.book_id}
                  className="btn w-8 round"
                >
                  <i className="icon icon-pile mr-1"></i>分卷
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content">
          <Form
            {...this.__form_item_layout()}
            layout="horizontal"
            ref={this.formRef}
            onFinish={this.handle_submit}
          >
            <Form.Item label="名称" name="name">
              <Input placeholder="输入名称" />
            </Form.Item>
            <Form.Item label="图片">
              {this.state.data.image ? (
                <p>
                  <img src={this.state.data.image} style={{ width: "100px" }} />
                </p>
              ) : (
                ""
              )}
              <ImgCrop rotate modalTitle="请编辑图片" aspect={0.7047619047619}>
                <Upload {...this.__upload_single_props()}>
                  <Button icon={<UploadOutlined />}>更改图片</Button>
                </Upload>
              </ImgCrop>{" "}
            </Form.Item>

            <Form.Item label="介绍" name="intro">
              <Input.TextArea
                placeholder="请输入介绍"
                autoSize={{ minRows: 5, maxRows: 10 }}
              />
            </Form.Item>
            <Form.Item {...this.__tail_layout()}>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.props.server.loading}
                style={{ marginRight: "8px" }}
                shape="round"
              >
                提交保存
              </Button>
             
                <Link className="button" to={"/novel/volume/index/" + this.state.book_id}>
                  返回
                </Link>
               
            </Form.Item>
          </Form>
        </div>
      </>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Volume);
