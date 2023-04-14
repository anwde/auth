// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from '../../utils/webapi';
import Basic_Books from './base/books';
import { Menu, Dropdown, Button, Pagination, Avatar, Tag, Form, Input, Space, Image, Divider, Modal, Cascader, Select, Checkbox, Row, Upload, DatePicker, Card, List } from "antd";
import { LikeOutlined, MessageOutlined, StarOutlined, UploadOutlined, CloseOutlined, UnorderedListOutlined, FontSizeOutlined, OrderedListOutlined, AreaChartOutlined, PlusOutlined } from "@ant-design/icons";
import { ProList } from '@ant-design/pro-components';
import moment from "moment";

const BREADCRUMB = {
    title: "授权作品管理",
    lists: [

    ],
    buttons: [

    ],
};

class Authorize extends Basic_Books {
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
    __init_index = async (d = {}, top = true) => {

        let server_state = await this.get_server_state();
        let category_dict = await this.get_category_dict();
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
        this.__breadcrumb({
            buttons: [{
                title: "添加授权作品",
                onClick: (e) => {
                    e.preventDefault();
                    this.handle_add();
                }
            }]
        });
        this.setState(
            {

                server_state,
                category_dict,
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
    __render_index_add_edit(u_action) {
        return (
            <Modal
                width="61.8vw"
                height="61.8vh"
                style={{ top: "20px" }}
                keyboard={false}
                maskClosable={false}
                open={this.state.add_edit_visible}
                onOk={this.handle_add_edit_dopost}
                onCancel={this.handle_add_edit_modal_close}
                centered={true}
                title={
                    <>
                        <h4>{this.state.add_edit_title}</h4>
                    </>
                }


                bodyStyle={{
                    height: "calc(100vh - 480px)",
                    overflowX: "hidden",
                    overflowY: "scroll",
                }}
            >
                <div className="form-book-edit">{this.__render_add_edit(u_action)}</div>
            </Modal>
        );
    }
    //  添加-作品
    __render_add_edit(u_action) {
        const state = this.state;
        const style = {
            width: '102px',
            height: '102px',
            marginInlineEnd: '8px',
            marginBottom: '8px',
            textAlign: 'center',
            verticalAlign: 'top',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'border-color 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            border: state.select_books_hover ? '1px dashed #1677ff' : '1px dashed #d9d9d9',
        };

        return (
            <>

                <Form

                    labelCol={
                        { span: 4 }
                    }
                    wrapperCol={
                        { span: 18 }
                    }
                    ref={this.formRef}
                    onFinish={this.handle_submit}
                >
                    <Form.Item label="授权时间" >
                        <DatePicker.RangePicker showTime />
                    </Form.Item>
                    <Form.Item label="选择作品">
                        {this.state.data.image ? (
                            <p>
                                <img src={this.state.data.image} style={{ width: "100px" }} />
                            </p>
                        ) : (
                            ""
                        )}
                        <div style={style}
                            onMouseEnter={this.handle_select_books_mouse_enter}
                            onMouseLeave={this.handle_select_books_mouse_leave}
                            onClick={() => this.handle_modal_books_lists()}
                        >
                            <PlusOutlined />
                            <div
                                style={{
                                    marginTop: 8,
                                }}
                            >
                                点这里添加
                            </div>
                        </div>

                    </Form.Item>




                    {this.state.add_edit_visible ? (
                        ""
                    ) : (
                        <Form.Item {...this.__tail_layout()}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={this.state.loading}
                            >
                                提交保存
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </>
        );
    }
    __render_index() {
        const state = this.state;
        const customer = this.props.server.customer || {};
        const applications = this.props.server.applications || {};
        const category_dict = state.category_dict || {};
        const server_state = state.server_state || {};
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
        //  console.log(state_sale);
        let c = "";
        if (state.u_action == "sign") {
            c = this.__render_index_sign();
        }
        if (this.state.u_action == "duty") {
            c = this.__render_index_duty();
        }
        if (state.u_action == "edit" || state.u_action == "add") {
            c = this.__render_index_add_edit(state.u_action);
        }
        const filters = this.state.filters || {};
        const dutys = this.dutys || [];
        // console.log('filters=>',this.state.filters);
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

                <ProList<any>
                    itemLayout="vertical"
                    rowKey="id"
                    headerTitle={
                        <>
                            作品管理(<span style={{ fontSize: '11px', fontWeight: 'none' }}>共{this.state.pagination.total}部</span>)</>
                    }
                    toolBarRender={() => {
                        return [
                            <Input.Search
                                placeholder="搜索..."
                                allowClear
                                size="middle"
                                enterButton
                                onSearch={this.__handle_search}
                                onChange={(o) => {
                                    this.__handle_search_change(o);
                                }}
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
                    }}
                    request={async (params = {}, sorts, filter) => {
                        return await this.__handle_tablepro_request(params, sorts, filter);
                    }}
                    dataSource={state.lists}
                    pagination={state.pagination}
                    metas={{
                        title: {
                            render: (_, item) => {
                                return <>
                                    <a
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.handle_edit(item.id, item);
                                        }}
                                    >{item.name}</a>
                                </>
                            }
                        },

                        description: {
                            render: (d, item) => {
                                return (
                                    <Space>
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
                                        <Link
                                            to={`/books/home/?state_sale=${item.state_sale}`}
                                            onClick={() => this.__handle_init_index()}
                                        >
                                            <Tag
                                                color={state_sale[item.state_sale].color}
                                            >{state_sale[item.state_sale].name}</Tag>
                                        </Link>

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


                                    </Space>
                                );
                            },
                        },
                        actions: {
                            render: (_, item) => {
                                const items = this.__render_actions(item)
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


                                    <Dropdown menu={{ items }}>
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
                        extra: {
                            render: (_, item) => {
                                return <>
                                    <Image
                                        width={185.4}
                                        height={200}
                                        src={item.image || ''}
                                        preview={false}
                                        style={{ borderRadius: '0.6rem' }}
                                        fallback="data:image/png;base64,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"
                                    />

                                </>;
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
                    }
                    }
                />

                {c}
                {this.__render_drawer(children)}
            </>
        );
    }

    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Authorize);
