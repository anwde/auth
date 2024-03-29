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
import type { Categorys as TypesCategorys } from '../../books';
import type { ProColumns } from "@ant-design/pro-table";
import { stat } from "fs";
const BREADCRUMB = {
    title: "分类管理",
    lists: [
        { title: "分类管理", url: "/books/categorys" },

    ],
    buttons: [{ title: "添加分类", url: "/books/categorys/add" }, { title: "树结构", url: "/books/categorys/children" }],
};
type State = Server.State & {
    data?: TypesCategorys;
    categorys?: [TypesCategorys];
    children?: [],
    drawer_visible?: boolean;
};
class Categorys extends Basic_Component {
    formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    categorys = [];
    children = [];
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

    /**
       * 获取树
       * @return obj
       */
    async get_categorys_tree(reset = false) {
        if (reset || this.categorys.length === 0) {
            const res = await webapi.request.get("books/categorys/tree");
            this.categorys = res.code === 10000 ? res.lists : [];
        }
        return this.categorys;
    }
    /**
      * 获取树
      * @return obj
      */
    async get_children(reset = false) {
        if (reset || this.children.length === 0) {
            const data = await webapi.request.get("books/categorys/children", {
                data: {
                    select: "CONCAT(name) as title,id as key,parent_id,group_id",
                    fieldnames: { name: "title", id: "key", parent_id: "parent_id" },
                    fieldnames_group: { name: "title", id: "key" },
                },
            });
            this.children = data.code === 10000 ? data.lists : [];
        }
        return this.children;
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
        const res = await webapi.request.get("books/categorys/lists", { data: d });
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
    async __init_add_edit(action: string) {
        let b = { title: "" };
        let data = { name: "" };
        if (action === "edit" && this.state.id) {
            const res = await webapi.request.get("books/categorys/get", {
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
        const categorys = await this.get_categorys_tree();
        this.setState({ data: data, categorys });
        this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
        this.__breadcrumb(b);
    }
    async __init_children() {
        const children = await this.get_children(true);
        const b = {
            buttons: [
                {
                    title: "添加分类",
                    url: "#!",
                    onClick: () => {
                        this.handle_add();
                    },
                },
            ],
        };
        this.setState({
            children,
        });
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
    handle_submit = async (data: TypesCategorys) => {
        data.id = this.state.id;
        data.parent_id = this.state.data.parent_id;
        const res = await webapi.request.post("books/categorys/dopost", { data });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace("/books/categorys");
            this.get_categorys_tree(true);
        } else {
            webapi.message.error(res.message);
        }
    };
    handle_parent_id = (value: (string | number)[]): void => {
        let parent_id: string | number = 0;
        if (value.length > 0) {
            parent_id = value[value.length - 1];
        }
        if (parent_id !== this.state.id * 1) {
            this.setState({
                data: { ...this.state.data, parent_id: parent_id },
            });
        }
    };
    /**
       * 集中 删除
       **/
    handle_do_delete(url: string, id: number) {
        this.__handle_delete({
            url: `books/categorys/${url}`,
            data: { id },
        });
    }
    /**
    * 删除
    **/
    handle_delete(id: number) {
        this.handle_do_delete("delete", id);
    }
    handle_drag_end = (info: any) => {
        console.log(info);
    };

    handle_drop = async (info: any) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const res = await webapi.request.post("books/categorys/dopost", {
            data: { id: dragKey, parent_id: dropKey },
        });
        if (res.code === 10000) {
            this.__init_children();
        }
    };
    handle_drawer_close = () => {
        this.formRef.current && this.formRef.current.resetFields();
        this.setState({
            drawer_visible: false,
        });
    };

    handle_drawer_submit = () => {
        this.formRef.current &&
            this.formRef.current
                .validateFields()
                .then((data) => {
                    this.handle_finish_dopost(data);
                })
                .catch((info) => {
                    //console.log('Validate Failed:', info);
                });
    };
    handle_finish_dopost = async (data: TypesCategorys) => {
        const res = await webapi.request.post("books/categorys/dopost", {
            data,
        });
        if (res.code === 10000) {
            this.setState({ parent_id: 0 });
            this.get_children(true);
            this.__init_children();
            this.handle_drawer_close();
            webapi.message.success(res.message);
        } else {
            webapi.message.error(res.message);
        }
    };
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    __render_index() {
        const state = this.state;
        const columns: ProColumns<TypesCategorys>[] = [
            {
                title: "名称",
                sorter: true,
                fixed: "left",
                dataIndex: "name",
                align: "center",
            },
            {
                title: "序号",
                sorter: true,
                fixed: "left",
                dataIndex: "idx",
                align: "center",
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

                            <Link to={`/books/categorys/edit/${row.id}`}>
                                <Button type="primary" shape="circle" icon={<EditOutlined />} />
                            </Link>
                        </Space>
                    );
                },
            },
        ];
        return <>
            <ProTable

                headerTitle='分类列表'
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
                        <Link className="button" to={"/books/categorys"}>
                            返回
                        </Link>
                    </Space>
                </Form.Item>
            </Form>
        );
    }
    __render_children() {
        const state = this.state as unknown as State;
        const children = state.children || [];
        return (<>
            <Tree
                className="draggable-tree"
                showLine={{ showLeafIcon: false }}
                draggable
                blockNode
                onDragEnd={this.handle_drag_end}
                onDrop={this.handle_drop}
                treeData={children}
            />
            <Drawer
                title={(state.u_action === "add" ? "添加" : "编辑") + "权限"}
                width={500}
                forceRender={true}
                onClose={this.handle_drawer_close}
                open={state.drawer_visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >
                        <Button
                            shape="round"
                            style={{ marginRight: 8 }}
                            onClick={this.handle_drawer_close}
                        >
                            取消
                        </Button>
                        <Button
                            shape="round"
                            loading={this.props.server.loading}
                            type="primary"
                            onClick={this.handle_drawer_submit}
                        >
                            提交
                        </Button>
                    </div>
                }
            >
                <Form ref={this.formRef} onFinish={this.handle_submit}>
                    {this.__render_add_edit_children(state.u_action)}
                </Form>
            </Drawer>
        </>);
    }
    /**
   * 添加、编辑
   * @return obj
   */
    __render_add_edit_children(u_action: string) {
        const state = this.state as unknown as State;
        const categorys = state.categorys || [];
        const data = state.data;
        return (
            <>
                <Form.Item name="name" label="名称">
                    <Input />
                </Form.Item>
                <Form.Item name="idx" label="序号">
                    <Input />
                </Form.Item>

                <Form.Item label="所属">
                    <Cascader
                        value={[data.parent_id]}
                        options={categorys}
                        fieldNames={{ label: "name", value: "id" }}
                        changeOnSelect
                        onChange={this.handle_parent_id}
                    />
                </Form.Item>
            </>
        );
    }
    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Categorys);
