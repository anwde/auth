import React from "react";
import Basic_Component from "../../components/base/component";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../utils/webapi";
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { FormInstance } from "antd/lib/form";

import {
    Modal,
    Tag,
    Popover,
    Space,
    Button,
    Dropdown,
    Menu,
    Drawer,
    Form,
    Input,
    DatePicker,
    Select,
    Divider,
    Radio,
    Cascader,
    Tree
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SettingFilled, ArrowRightOutlined, ArrowLeftOutlined, UnorderedListOutlined } from "@ant-design/icons";

import moment from "moment";
import type { Tags as TypesTags } from '../../books';
import type { ProColumns } from "@ant-design/pro-table";
const BREADCRUMB = {
    title: "标签管理",
    lists: [
        { title: "标签管理", url: "/books/tags" },

    ],
    buttons: [{ title: "添加", url: "/books/tags/add" }],
};
type State = Server.State & {
    data?: TypesTags;

    children?: [],
    drawer_visible?: boolean;
};
class Tags extends Basic_Component {
    formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    categorys = [];
    children = [];
    tag = {};
    constructor(props: any) {
        super(props);
    }
    /*----------------------0 parent start----------------------*/
    /**
   * 面包屑导航
   */
    __breadcrumb(data = {}): void {
        super.__breadcrumb({ ...BREADCRUMB, ...data });
    }
    /*----------------------0 parent end----------------------*/
    async get_tag(reset = false) {
        if (reset || Object.keys(this.tag || {}).length === 0) {
            const res = await webapi.request.get(`books/tags/dict`, { cache: true, loading: false });
            this.tag = res.code === 10000 ? res.data : {};
        }
        return this.tag;
    }

    /*----------------------1 other start----------------------*/

    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/
    /**
   * index  列表数据
   */
    async __init_index(d = {}) {
        this.__breadcrumb({});
    }
    init_lists = async (
        params,
        sort,
        filter
    ) => {
        const state = this.state;
        let d = params;
        d.filters = state.filters;
        d.q = state.q;
        d.order_field = state.order_field;
        d.order_value = state.order_value;
        d.row_count = state.pagination.pageSize;
        d.offset = state.pagination.current;
        d.state_delete = 1;
        const res = await webapi.request.get("books/tags/lists", { data: d });
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
                success: true,
                total: res.num_rows,
            };
        }

    }
    async __init_add_edit(u_action: string) {
        let b = { title: "" };
        let data = { name: "" };
        if (u_action === "edit" && this.state.id) {
            const res = await webapi.request.get("books/tags/get", {
                data: {
                    id: this.state.id,
                },
            });
            if (res.code === 10000) {
                data = res.data;
            }
            b.title = `${BREADCRUMB.title}-${data.name}-编辑`;
        } else {
            b.title = `${BREADCRUMB.title}-添加`;
        }
        this.setState({ data: data });
        this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
        this.__breadcrumb(b);
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/
    handle_add = () => {
        this.__init_add_edit("add");
        this.setState({
            drawer_visible: true,
        });
    };
    /**
    * 提交
    **/
    handle_submit = async (data: TypesTags) => {
        data.id = this.state.id;
        const res = await webapi.request.post("books/tags/dopost", { data });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace("/books/tags");
            this.get_tag(true);
        } else {
            webapi.message.error(res.message);
        }
    };
    /**
       * 集中 删除
       **/
    handle_do_delete(url: string, id: number) {
        this.__handle_delete({
            url: `books/tags/${url}`,
            data: { id },
            success: (data) => {
                if (data.code === 10000) {
                    webapi.message.success(data.message);
                    this.__method("init");
                    this.get_tag(true);
                } else {
                    webapi.message.error(data.message);
                }
            },
        });
    }
    /**
    * 删除
    **/
    handle_delete(id: number) {
        this.handle_do_delete("delete", id);
    }

    handle_drawer_close = () => {
        this.formRef.current && this.formRef.current.resetFields();
        this.setState({
            drawer_visible: false,
        });
    };


    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    __render_index() {
        const props = this.props;
        const server = (props.server || {}) as Server.Server;
        const customer = server.customer || {};
        const applications = server.applications || {};
        const state = this.state as unknown as State;
        // console.log(applications);
        const columns: ProColumns<TypesTags>[] = [
            {
                title: "名称",
                sorter: true,
                fixed: "left",
                dataIndex: "name",
                align: "center",
            },
            {
                title: "引用",
                sorter: true,
                fixed: "left",
                dataIndex: "quote",
                align: "center",
            },
            {
                title: "商户",
                sorter: true,
                fixed: "left",
                dataIndex: "customer_id",
                align: "center",
                render: (_, row) => {
                    return customer[row.customer_id] && customer[row.customer_id].name;
                }
            },
            {
                title: "应用",
                sorter: true,
                fixed: "left",
                dataIndex: "client_id",
                align: "center",
                render: (_, row) => {
                    return applications[row.client_id] && applications[row.client_id].name;
                }
            },
            {
                title: "操作",
                align: "center",
                fixed: "right",
                search: false,
                render: (_, row) => {
                    return (
                        <Space>
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<DeleteOutlined />}
                                title="删除"
                                onClick={() => {
                                    this.handle_delete(row.id);
                                }}
                            />

                            <Link to={`/books/tags/edit/${row.id}`}>
                                <Button type="primary" shape="circle" icon={<EditOutlined />} />
                            </Link>
                        </Space>
                    );
                },
            },
        ];
        return <>
            <ProTable
                params={{ ...state.params, q: state.q }}
                headerTitle='标签列表'
                columns={columns}
                rowKey="id"
                search={false}
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
                        />
                    ];
                }}
                pagination={this.state.pagination}
                request={this.init_lists}
                onChange={this.__handle_table_change}
            >
            </ProTable>

        </>
    }

    /**
   * 添加-编辑 子类重写
   * @return obj
   */
    __render_add_edit(u_action: string) {
        const state = this.state as unknown as State;
        return (
            <Form
                ref={this.formRef}
                onFinish={this.handle_submit}
                {...this.__form_item_layout()}
            >
                {this.__render_add_edit_children(state.u_action)}
                <Form.Item {...this.__tail_layout()}>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={this.props.server.loading}
                            shape="round"
                        >
                            {this.props.server.loading ? "正在提交" : "立即提交"}
                        </Button>
                        <Link className="button" to={"/books/tags"}>
                            返回
                        </Link>
                    </Space>
                </Form.Item>
            </Form>
        );
    }

    /**
   * 添加、编辑
   * @return obj
   */
    __render_add_edit_children(u_action: string) {
        const state = this.state as unknown as State;
        const data = state.data;
        return (
            <>
                <Form.Item name="name" label="名称">
                    <Input />
                </Form.Item>
                <Form.Item name="intro" label="介绍">
                    <Input />
                </Form.Item>


            </>
        );
    }
    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Tags);
