// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from '../../../utils/webapi';
import Basic_Books from '../base/books';
import { Menu, Dropdown, Button, Pagination, Avatar, Tag, Form, Space, Divider, Input } from "antd";
import { FileWordOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UnorderedListOutlined, SettingFilled } from "@ant-design/icons";
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import moment from "moment";

const BREADCRUMB = {
    title: "差异管理",
    lists: [
        {
            title: "差异管理",
            url: "/books/customer/difference/index",
        },
    ],
    buttons: [

    ],
};
class Difference extends Basic_Books {
    formRef = React.createRef();

    /**
     * 构造
     */
    constructor(props) {
        super(props);
    }
    __init_state_after() {
        const query = webapi.utils.query() as { book_id: 0 };
        return {
            book_id: query.book_id,
        };
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
       * 差异管理  列表数据
       */
    async __init_index() {
        let l = [{ title: "差异管理", url: "/books/customer/difference/index" }];
        this.__breadcrumb({ lists: l });
        let channel = await this.get_channel();
        let server_state = await this.get_server_state();
        let category_dict = await this.get_category_dict();
        let category = await this.get_category();


        this.setState(
            {
                channel,
                server_state,
                category_dict,
                category,
            }
        );
    }
    init_index = async (params: T & {
        pageSize: number;
        current: number;
    },
        sort,
        filter,) => {
        const state = this.state as unknown as State;
        let d = params;
        d.filters = state.filters;
        d.q = state.q;
        d.order_field = state.order_field;
        d.order_value = state.order_value;
        d.row_count = state.pagination.pageSize;
        d.offset = state.pagination.current;
        d.book_id = state.book_id;
        d.state_delete = 1;
        // d.t=123;
        const res = await webapi.request.get("books/customer/difference/lists", { data: d });

        if (res.code === 10000) {
            this.setState(
                {

                    lists: res.lists,
                    pagination: {
                        ...state.pagination,
                        total: res.num_rows,
                    },
                });
            return {
                data: res.lists,
                // success 请返回 true，
                // 不然 table 会停止解析数据，即使有数据
                success: true,
                // 不传会使用 data 的长度，如果是分页一定要传
                total: res.num_rows,
            };
        }
    }

    async __init_chapters() {
        const state = this.state as unknown as State;
        // const book = await this.get_book(state.book_id);
        const lists = [
            { title: "差异管理", url: "/books/customer/difference/index" },
            {
                title: "章节管理",
                url: `/books/customer/difference/chapters?book_id=${state.book_id}`,
            },
        ];
        this.__breadcrumb({ lists });
        let channel = await this.get_channel();
        let server_state = await this.get_server_state();
        let category_dict = await this.get_category_dict();
        let category = await this.get_category();


        this.setState(
            {
                channel,
                server_state,
                category_dict,
                category,
            }
        );
    }
    init_chapters = async (params: T & {
        pageSize: number;
        current: number;
    },
        sort,
        filter,) => {
        const state = this.state as unknown as State;
        let d = params;
        d.filters = state.filters;
        d.q = state.q;
        d.order_field = state.order_field;
        d.order_value = state.order_value;
        d.row_count = state.pagination.pageSize;
        d.offset = state.pagination.current;
        d.id = state.book_id;
        d.state_delete = 1;
        // d.t=123;
        const res = await webapi.request.get("books/customer/difference/chapters", { data: d });

        if (res.code === 10000) {
            this.setState(
                {

                    lists: res.lists,
                    pagination: {
                        ...state.pagination,
                        total: res.num_rows,
                    },
                });
            return {
                data: res.lists,
                // success 请返回 true，
                // 不然 table 会停止解析数据，即使有数据
                success: true,
                // 不传会使用 data 的长度，如果是分页一定要传
                total: res.num_rows,
            };
        }
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start----------------------*/

    handle_update_storage_to_database = async (id) => {
        const res = await webapi.request.get("books/customer/books/storage_to_database", { data: { id } });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.__init_difference();
        } else {
            webapi.message.error(res.message);
        }
    };
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start----------------------*/


    __render_index() {
        const state = this.state as unknown as State;
        const server_state = state.server_state || {};
        const state_sale = server_state.book ? server_state.book.sale : {};
        const sign = server_state.book
            ? server_state.book.sign
                ? server_state.book.sign
                : {}
            : {};
        const sign_type = sign.type ? sign.type : {};
        const sign_sale = sign.sale ? sign.sale : {};
        const columns: ProColumns[] = [
            {
                title: "ID",
                sorter: true,
                fixed: "left",
                dataIndex: "id",
                align: "center",
                width: 100,
                render: (_, row) => {
                    return <a
                        onClick={(e) => {
                            e.preventDefault();
                            this.handle_content(row.id);
                        }}
                    >
                        {row.id}
                    </a>;
                },
            },
            {
                title: "序号",
                sorter: true,
                fixed: "left",
                dataIndex: "book_id",
                align: "center",
                width: 100,
                render: (_, row) => {
                    return <>
                        {row.cb_book_id}
                        <Divider />
                        {row.b_id}
                    </>;
                },
            },
            {
                title: "名称",
                sorter: true,
                dataIndex: "name",
                align: "center",
                render: (_, row) => {
                    return <>
                        {row.cb_name}
                        <Divider />
                        {row.b_name}
                    </>;
                },
            },


            {
                title: "商户书ID",
                sorter: true,
                dataIndex: "customer_book_id",
                align: "center",
                hideInSearch: true,
                render: (_, row) => {
                    return <>
                        {row.cb_customer_book_id}
                        <Divider />
                        {row.b_customer_book_id}
                    </>;
                },

            },
            {
                title: "状态",
                sorter: true,
                dataIndex: "model_id",
                align: "center",

                render: (_, row) => {
                    return <>
                        {state_sale[row.b_state_sale] && state_sale[row.b_state_sale].name}
                    </>;
                },

            },
            {
                title: "章节",
                sorter: true,
                dataIndex: "chapters",
                align: "center",
                hideInSearch: true,
                render: (_, row) => {
                    return <>
                        {row.cb_chapters}
                        <Divider />
                        {row.b_chapters}
                    </>;
                },
            },
            {
                title: "字数",
                sorter: true,
                dataIndex: "words",
                align: "center",
                hideInSearch: true,
                render: (_, row) => {
                    return <>
                        {row.cb_words}
                        <Divider />
                        {row.b_words}
                    </>;
                },
            },


            {
                title: "发布时间",
                sorter: true,
                hideInSearch: true,
                dataIndex: "published_time",
                align: "center",
                width: 200,
                render: (_, row) => {
                    return row.published_time > 0 ? moment((row.published_time as number) * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                    ) : '-';
                },
            },
            {
                title: "创建时间",
                sorter: true,
                hideInSearch: true,
                dataIndex: "create_time",
                align: "center",
                width: 200,
                render: (_, row) => {
                    return moment((row.create_time as number) * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                    );
                },
            },


            {
                title: "操作",
                align: "center",
                fixed: "right",
                valueType: "option",
                filters: [],
                // onFilterDropdownVisibleChange: this.handle_filterDropdownVisibleChange,
                filterIcon: (filtered: any) => (
                    <SettingFilled style={{ color: filtered ? "#1890ff" : "" }} />
                ),
                filterDropdownVisible: false,
                render: (_, row) => {
                    return (
                        <Space>
                            <Dropdown
                                overlay={this.__render_books_dropdown_menus_action(row)}
                                type="primary"
                                shape="round"
                            >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<UnorderedListOutlined />}
                                />
                            </Dropdown>
                        </Space>
                    );
                },
            },
        ];
        return <>
            <ProTable
                headerTitle="差异列表"
                rowKey={"id"}
                columns={columns}
                pagination={this.state.pagination}
                request={this.init_index}
                onChange={this.__handle_table_change}
                scroll={{ x: 1500, y: "calc(100vh - 290px)" }}
                search={false}
                rowSelection={{
                    onChange: (_, selectedRows) => { },
                }}
                form={false}
                toolBarRender={() => [
                    <Input.Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        enterButton
                    />
                ]
                }

            />
        </>
    }

    __render_books_dropdown_menus_action = (data) => {
        return (
            <Menu>
                <Menu.Item key="1">
                    <Link to={`/books/customer/difference/chapters?book_id=${data.id}`}>
                        <Button
                            type="primary"
                            shape="round"

                        >
                            章节列表

                        </Button>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            this.handle_state_sale(data.id, data.state_sale == 1 ? 2 : 1);
                        }}
                    >
                        设置为
                        {data.state_sale == 1 ? "收费" : "免费"}
                    </Button>
                </Menu.Item>
                <Menu.Item key="3">
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            this.handle_update_storage_to_database(data.id);
                        }}
                    >更新入库
                    </Button>
                </Menu.Item>

                <Menu.Item key="4">
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            this.handle_published_drawer_open(data, 'single');
                        }}
                    >
                        暴力更新入库
                    </Button>
                </Menu.Item>

                <Menu.Item key="5">
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            this.handle_base_drawer_open(data);
                        }}
                    >
                        更新数据源
                    </Button>


                </Menu.Item>
            </Menu>
        );
    };
    __render_chapters() {
        const state = this.state as unknown as State;
        const server_state = state.server_state || {};
        const state_sale = server_state.book ? server_state.book.sale : {};
        const sign = server_state.book
            ? server_state.book.sign
                ? server_state.book.sign
                : {}
            : {};
        const sign_type = sign.type ? sign.type : {};
        const sign_sale = sign.sale ? sign.sale : {};
        const columns: ProColumns[] = [
            {
                title: "ID",
                sorter: true,
                fixed: "left",
                dataIndex: "id",
                align: "center",
                width: 100,
                render: (_, row) => {
                    return <a
                        onClick={(e) => {
                            e.preventDefault();
                            this.handle_content(row.id);
                        }}
                    >
                        {row.id}
                    </a>;
                },
            },
            {
                title: "章节ID",
                sorter: true,
                fixed: "left",
                dataIndex: "chapter_id",
                align: "center",
                width: 100,
                render: (_, row) => {
                    return <>
                        {row.cbc_chapter_id}
                        <Divider />
                        {row.bc_id}
                    </>;
                },
            },
            {
                title: "名称",
                sorter: true,
                dataIndex: "name",
                align: "center",
                render: (_, row) => {
                    return <>
                        {row.cbc_name}
                        <Divider />
                        {row.bc_name}
                    </>;
                },
            },


            {
                title: "商户书ID",
                sorter: true,
                dataIndex: "customer_book_id",
                align: "center",
                hideInSearch: true,
                render: (_, row) => {
                    return <>
                        {row.cbc_customer_book_id}
                        <Divider />
                        {row.bc_customer_book_id}
                    </>;
                },

            },
            {
                title: "商户章ID",
                sorter: true,
                dataIndex: "customer_chapter_id",
                align: "center",
                hideInSearch: true,
                render: (_, row) => {
                    return <>
                        {row.cbc_customer_chapter_id}
                        <Divider />
                        {row.bc_customer_chapter_id}
                    </>;
                },

            },
            {
                title: "商户卷ID",
                sorter: true,
                dataIndex: "customer_volume_id",
                align: "center",
                hideInSearch: true,
                render: (_, row) => {
                    return <>
                        {row.cbc_customer_volume_id}
                        <Divider />
                        {row.bc_customer_volume_id}
                    </>;
                },

            },
            {
                title: "状态",
                sorter: true,
                dataIndex: "model_id",
                align: "center",

                render: (_, row) => {
                    return <>
                        {state_sale[row.b_state_sale] && state_sale[row.b_state_sale].name}
                    </>;
                },

            },

            {
                title: "字数",
                sorter: true,
                dataIndex: "words",
                align: "center",
                hideInSearch: true,
                render: (_, row) => {
                    return <>
                        {row.cbc_words}
                        <Divider />
                        {row.bc_words}
                    </>;
                },
            },


            {
                title: "发布时间",
                sorter: true,
                dataIndex: "published_time",
                align: "center",
                width: 200,
                render: (_, row) => {
                    return row.bc_published_time > 0 ? moment((row.bc_published_time as number) * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                    ) : '-';
                },
            },
            {
                title: "创建时间",
                sorter: true,
                hideInSearch: true,
                dataIndex: "create_time",
                align: "center",
                width: 200,
                render: (_, row) => {
                    return <>
                        {moment((row.create_time as number) * 1000).format(
                            "YYYY-MM-DD HH:mm:ss")}
                        <Divider />
                        {moment((row.bc_create_time as number) * 1000).format(
                            "YYYY-MM-DD HH:mm:ss")}
                    </>;
                },
            },


            {
                title: "操作",
                align: "center",
                fixed: "right",
                valueType: "option",
                filters: [],
                // onFilterDropdownVisibleChange: this.handle_filterDropdownVisibleChange,
                filterIcon: (filtered: any) => (
                    <SettingFilled style={{ color: filtered ? "#1890ff" : "" }} />
                ),
                filterDropdownVisible: false,
                render: (_, row) => {
                    return (
                        <Space>
                            <Dropdown
                                overlay={this.__render_chapters_dropdown_menus_action(row)}
                                type="primary"
                                shape="round"
                            >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<UnorderedListOutlined />}
                                />
                            </Dropdown>
                        </Space>
                    );
                },
            },
        ];
        return <>
            <ProTable
                headerTitle="差异列表"
                rowKey={"id"}
                columns={columns}
                pagination={this.state.pagination}
                request={this.init_chapters}
                onChange={this.__handle_table_change}
                scroll={{ x: 1500, y: "calc(100vh - 290px)" }}
                search={false}
                rowSelection={{
                    onChange: (_, selectedRows) => { },
                }}
                form={false}
                toolBarRender={() => [
                    <Input.Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        enterButton
                    />
                ]
                }

            />
        </>
    }

    __render_chapters_dropdown_menus_action = (data) => {
        return (
            <Menu>

                <Menu.Item key="2">
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            this.handle_state_sale(data.id, data.state_sale == 1 ? 2 : 1);
                        }}
                    >
                        设置为
                        {data.state_sale == 1 ? "收费" : "免费"}
                    </Button>
                </Menu.Item>
                <Menu.Item key="3">
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            this.handle_update_storage_to_database(data.id);
                        }}
                    >更新入库
                    </Button>
                </Menu.Item>

                <Menu.Item key="4">
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            this.handle_published_drawer_open(data, 'single');
                        }}
                    >
                        暴力更新入库
                    </Button>
                </Menu.Item>

                <Menu.Item key="5">
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => {
                            this.handle_base_drawer_open(data);
                        }}
                    >
                        更新数据源
                    </Button>


                </Menu.Item>
            </Menu>
        );
    };
    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Difference);
