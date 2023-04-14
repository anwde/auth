// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import webapi from '../../../utils/webapi';
import moment from "moment";
import { Button, Pagination, Avatar, Tag, Form, Input, Space, Image, Divider, Dropdown, Modal } from "antd";
import { ProList } from '@ant-design/pro-components';
import { EditOutlined, FileWordOutlined, CloseOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";

class Books_Components extends React.Component {
  server_state = {};
  constructor(props: any) {
    super(props);
    this.state = {
      server: {
        ucdata: {},
        columns: [],
        menus: [],
        customer: {},
        applications: {},
        apps: [],
        loading: false,
        code: 0,
        version: "",
      }, ...props
    };
  }
  componentWillReceiveProps(props = {}) {
    this.setState({ ...this.state, ...props })
  }
  async componentWillMount() {
    let server_state = await this.get_server_state();
    webapi.store.subscribe(() => {
      const d = webapi.store.getState();
      this.setState({
        server: d.server,
      });
    });
    this.setState({ server_state })
  }

  /*----------------------0 parent start----------------------*/

  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/
  async get_server_state(reset = false) {
    if (reset || Object.keys(this.server_state || {}).length === 0) {
      const res = await webapi.request.get("books/home/state", { cache: true });
      this.server_state = res.code === 10000 ? res.data : {};
    }
    return this.server_state;
  }
  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/

  /*----------------------3 handle end  ----------------------*/
  /*----------------------4 render start  ----------------------*/
  render_lists() {
    return <>fdsafdsafsa
    </>
  }
  //列表操作
  __render_lists_actions(item = {}, page = 'books') {
    const state = this.state || {};
    const url = page === 'books' ? '/books/' : '/books/customer/';
    const items: MenuProps['items'] = [
      {
        key: '1',
        label: <Link to={`${url}chapters?book_id=${item.id}`}>
          <Button type="primary" shape="round">
            章节列表
          </Button>
        </Link>,
      },


      {
        key: '2',
        label: <Link to={`${url}volumes?book_id=${item.id}`}>
          <Button type="primary" shape="round">
            分卷列表
          </Button>
        </Link>,
      },

    ];
    if (page === 'books') {
      items.push({
        key: 'related',
        label: <Link to={`/books/related?book_id=${item.id}`}>
          <Button type="primary" shape="round">
            关联列表
          </Button>
        </Link>,
      });
      items.push({
        key: 'state_published_1-2',
        label:
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              this.handle_published(item.id, item.state_published == 1 ? 2 : 1);
            }}
          >
            设置为
            {item.state_published == 1 ? "先发后审" : "先审后发"}
          </Button>
        ,
      });
      if (item.state_sale == "7") {
        items.push({
          key: 'handle_sale_11',
          label:
            <Button type="primary" shape="round" onClick={() => {
              this.handle_sale(item.id, 11);
            }}>
              作品下线
            </Button>
        });
      }
      if (!webapi.utils.in_array(item.state_sale, [
        "1",
        "2",
        "3",
        "6",
      ])) {
        items.push({
          key: 'revert',
          label: <Button type="primary" shape="round" onClick={() => this.handle_revert(item.id)}>
            退稿
          </Button>,
        });
      }
      if (item.last_chapter.idx !== item.chapters) {
        items.push({
          key: 'reset_chapters_idx',
          label: <Button type="primary" shape="round" onClick={() => this.handle_reset_chapters_idx(item.id)}>
            初始化章节序号
          </Button>,
        });
      }
      if (webapi.utils.in_array(item.state_sale, [
        "1",
        "2",
        "4",
        "5",
        "6",
        "8",
        "9",
        "10",
        "11",
      ])) (
        items.push({
          key: '4',
          label:
            <Button type="primary" shape="round" onClick={() => {
              this.handle_sale(item.id, 7);
            }}>
              作品上线
            </Button>
          ,
        })
      );
    }
    if (item.end_of_serial == 1) {
      items.push({
        key: 'chapter-add',
        label: <Link to={`/books/chapter/add?book_id=${item.id}`}>
          <Button type="primary" shape="round">
            添加章节
          </Button>
        </Link>,
      });
      items.push({
        key: 'volume-add',
        label: <Link to={`/books/volume/add?book_id=${item.id}`}>
          <Button type="primary" shape="round">
            添加分卷
          </Button>
        </Link>,
      });
    }
    if (state.handleGenerateCoverImage && !webapi.utils.in_array(item.state_sale, [
      "4",
      "5",
      "8",
      "9",
      "10",
    ])) {
      items.push({
        key: 'generate_cover_image',
        label: <Button type="primary" shape="round" onClick={() => state.handleGenerateCoverImage(item.id)}>
          生成封面图片
        </Button>,
      });
    }
    return items;
  }
  render() {
    const state = this.state;
    const category_dict = state.category_dict || {};
    const server_state = state.server_state || {};
    const state_sale = server_state.book ? server_state.book.sale : {};
    const server = state.server || {};
    const customer = state.customer || {};
    const applications = server.applications || {};
    // console.log(state);
    return <>

      <ProList<any>
        itemLayout="vertical"
        rowKey="id"
        headerTitle={state.headerTitle ?? <>
          作品管理(<span style={{ fontSize: '11px', fontWeight: 'none' }}>共{state.pagination.total}部</span>)</>}
        toolBarRender={state.toolBarRender ?? (() => {
          return [
            <Input.Search
              placeholder="搜索..."
              allowClear
              size="middle"
              enterButton
              onSearch={state.onSearch}
              onChange={state.onChange}
            />,
            <Button type="primary" shape="round"
              onClick={(e) => {
                e.preventDefault();
                this.handle_filter_drawer_show();
              }}
            >
              筛选
            </Button>
          ];
        })}
        rowSelection={{
          onChange: (_, selectedRows) => { },
        }}
        request={state.request_url ? async (params = {}, sorts, filter) => {
          return await this.__handle_tablepro_request(params, sorts, filter, state.request_url);
        } : state.request_handle}
        dataSource={state.dataSource}
        pagination={state.pagination}
        metas={state.metas_render ?? {
          title: {
            render: (_, item) => {
              return <>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    state.metas.title.click && state.metas.title.click(item);
                  }}
                >{item.name}</a>
              </>
            }
          },
          description: {
            render: (_, item) => {
              return (
                <Space>
                  <Link
                    to={`?end_of_serial=${item.end_of_serial}`}
                    className={
                      'tag fill-' +
                      (item.end_of_serial == 1 ? 'stress' : 'primary')
                    }
                    onClick={() => this.__handle_init_index()}
                  >
                    <Tag>{item.end_of_serial == 1 ? '连载' : '完结'}</Tag>
                  </Link>
                  <Link
                    to={`?state_sale=${item.state_sale}`}
                    onClick={() => this.__handle_init_index()}
                  >
                    <Tag
                      color={state_sale[item.state_sale] && state_sale[item.state_sale].color}
                    >{state_sale[item.state_sale] && state_sale[item.state_sale].name}</Tag>
                  </Link>

                  {item.category_id > 0 ? (
                    <Link
                      to={'?category_id=' + item.category_id}
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
                  <span>
                    作品ID:{item.id}
                  </span>
                  {item.customer_book_id ? (<>
                    <span>
                      商户作品ID:{item.customer_book_id}
                    </span>
                  </>) : ''}
                  {item.client_id || item.customer_id ? (<>
                    <span>
                      来源:{customer[item.customer_id] && customer[item.customer_id].name}{applications[item.client_id] && applications[item.client_id].name}
                    </span>
                  </>) : ''}
                  <span>
                    创建时间:
                    {item.create_time > 0 ? moment((item.create_time) * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ) : ''}</span>

                </Space>
              );
            },
          },
          content: {
            render: (_, item) => {
              return <>
                <div>
                  {item.intro}
                </div>
              </>;
            },

          },
          extra: {
            render: (_, item) => {
              return <>
                <Image
                  width={170.8152}
                  height={200}
                  src={item.image || ''}
                  preview={false}
                  style={{ borderRadius: '0.6rem' }}
                  fallback="data:image/png;base64,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"
                />

              </>;
            },
          },
          actions: {
            render: (_, item) => {
              return [
                <>
                  <span>
                    字数:{' '}{item.words > 1000
                      ? (item.words / 1000).toFixed(1) + "K"
                      : item.words}
                  </span>
                  <span>
                    章节: {item.chapters}
                  </span>
                  <Divider type="vertical" />
                  <span>
                    点击:{' '}
                    {item.all_hits > 10000
                      ? (item.all_hits / 10000).toFixed(2) + "万"
                      : item.all_hits || 0}
                  </span>
                  <Divider type="vertical" />
                  <span> 收藏:{' '}{item.all_store || 0}</span>
                  <Divider type="vertical" />
                  <span> 评论:{' '}{item.all_comment || 0}</span>
                  <Divider type="vertical" />
                  <span> 点赞:{' '}{item.all_support || 0}</span>
                  <Divider type="vertical" />
                  <span> 操作:{' '}</span>

                </>,


                <Dropdown menu={{ items: this.__render_lists_actions(item, state.page) }}>
                  <Button
                    type="primary"
                    shape="circle"
                    size={'small'}
                    icon={<UnorderedListOutlined />}
                  />


                </Dropdown>
              ];
            },
          },
        }}

      />
    </>
  }
  /*----------------------4 render end  ----------------------*/
}
export default (Books_Components);
