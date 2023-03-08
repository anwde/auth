import React from 'react';
import Basic_Books from './base_books';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import webapi from '../../utils/webapi';
import { ProList } from '@ant-design/pro-components';
import { Avatar,Button, Space, Tag,List,Radio } from 'antd'; 
import moment from 'moment';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import type { Ddata } from '../../types';
type State = Server.State & {
  drawer_visible: boolean;
  group: Ddata;
  category_dict: Ddata;
  server_state: Ddata;
  menus: [];
  columns: [];
  permission: [];
};
const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <span>
    {React.createElement(icon, { style: { marginInlineEnd: 8 } })}
    {text}
  </span>
);
const BREADCRUMB = {
  title: '作品管理',
  lists: [
    {
      title: '作品管理',
      url: '/novel/books',
    },
  ],
  buttons: [
    {
      title: '创建作品',
      url: '/novel/books/add',
    },
  ],
};
class Books extends Basic_Books<{}, State> {
  constructor(props: any) {
    super(props);
  }
  /*----------------------0 parent start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  /**
   * index  列表数据
   */
  __init_index = async (d = { row_count: 0, offset: 0 }, top = true) => {
    const category_dict = await this.get_category_dict();
    const group = await this.get_group(); 
    this.setState(
      {
        category_dict,
        group,
      },
      () => {
        this.init_lists('books/books/lists', d, {});
      },
    );
  };
  /**
   *  列表数据
   */
  async init_lists(url: string, d: Server.Query, b = {}) {
    d.q = this.state.q;
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    const query = webapi.utils.query(); 
    if (!d.filters) {
      d.filters = {};
    } 
    let data = await webapi.request.get(url, { data: d });
    let lists = [];
    if (data.code === 10000 && data.num_rows > 0) {
      lists = data.lists;
    }
    this.setState({
      lists: lists,
      pagination: { ...this.state.pagination, total: data.num_rows },
    });
    this.__breadcrumb(b);
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  __render_index() {
    const data = Array.from({ length: 23 }).map((_, i) => ({
      href: 'https://ant.design',
      title: `ant design part ${i}`,
      avatar: 'https://joeschmoe.io/api/v1/random',
      description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    }));

   return  (<List
    itemLayout="horizontal"
    size="large"
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 3,
    }}
    dataSource={data}
    footer={
      <div>
        <b>ant design</b> footer part
      </div>
    }
    renderItem={(item) => (
      <List.Item
        key={item.title}
        actions={[
          <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
          <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
          <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
        ]}
        extra={
          <img
            width={272}
            alt="logo"src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          }
        >
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={<a href={item.href}>{item.title}</a>}
            description={item.description}
          />
          {item.content}
        </List.Item>
      )}
    />);
    const state = this.state as unknown as State;
    const group = state.group || {};
    const category_dict = state.category_dict || {};
    return (
      <ProList<any>
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
                    to={'/novel/books?end_of_serial=' + item.end_of_serial}
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
            render: (d,item) => [
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
            ],
          },
          extra: {
            
            render: (d, item) => {
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
      />
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Books);
