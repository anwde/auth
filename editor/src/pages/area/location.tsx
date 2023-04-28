// @ts-nocheck
import React from "react";
import Basic_Component from "../../components/base/component";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../utils/webapi";
import moment from "moment";
import { Menu, Dropdown, Button, Pagination, Avatar, Tag, Form, Space, Divider, Input } from "antd";
import { FileWordOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UnorderedListOutlined, SettingFilled } from "@ant-design/icons";
import { ProTable, TableDropdown } from '@ant-design/pro-components';
const BREADCRUMB = {
    title: "推荐位管理-位置",
    lists: [
        {
            title: "推荐位管理",
            url: "/area/home",
        },
        {
            title: "位置",
            url: "/area/location",
        },
    ],
    buttons: [

    ],
};
class Area extends Basic_Component {
    formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
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
    __init_index() {
        const buttons = [
            { title: "添架位置", url: `/area/location/add` },
        ];
        this.__breadcrumb({ buttons });
    }
    init_index = async (params,
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
        const res = await webapi.request.get("area/location/lists", { data: d });
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
    async __init_add_edit(action: string) {
        let b = { title: "" };
        let data = { name: "" };
        if (action === "edit" && this.state.id) {
            var res = await webapi.request.get("area/location/get", {
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
        };
        this.setState({ data: data });
        this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
        this.__breadcrumb(b);
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/
    //提交
    handle_submit = async (data) => {
        data.id = this.state.id;
        const res = await webapi.request.post("area/location/dopost", { data });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace("/area/location");
        } else {
            webapi.message.error(res.message);
        }
    };

    //删除 
    handle_delete(id: number) {
        this.__handle_delete({
            url: `area/location/delete`,
            data: { id },
        });
    }
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    __render_index() {
        const state = this.state;
        const columns = [{
            title: "ID",
            sorter: true,
            fixed: "left",
            dataIndex: "id",
            align: "center",
            width: 100,
        },
        {
            title: "名称",
            sorter: true,
            dataIndex: "name",
            align: "center",

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

                </>;
            },
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

                        <Link to={`/area/location/edit/${row.id}`}>
                            <Button type="primary" shape="circle" icon={<EditOutlined />} />
                        </Link>
                    </Space>
                );
            },
        },
        ];
        return <>
            <ProTable
                headerTitle="位置列表"
                rowKey="id"
                columns={columns}
                pagination={this.state.pagination}
                request={this.init_index}
                onChange={this.__handle_table_change}
                // scroll={{ x: 1500, y: "calc(100vh - 290px)" }}
                search={false}
                toolBarRender={() => [
                    <Input.Search
                        placeholder="搜索"
                        allowClear
                        enterButton="Search"
                        size="large"
                        enterButton
                    />
                ]
                }
            >
            </ProTable></>;
    }
    /**
  * 添加-编辑 子类重写
  * @return obj
  */
    __render_add_edit(u_action: string) {
        return (
            <Form
                ref={this.formRef}
                onFinish={this.handle_submit}
                {...this.__form_item_layout()}
            >
                <Form.Item name="name" label="名称">
                    <Input />
                </Form.Item>


                <Form.Item {...this.__tail_layout()}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: "8px" }}
                        loading={this.props.server.loading}
                    >
                        {this.props.server.loading ? "正在提交" : "立即提交"}
                    </Button>
                    <Link className="button" to={"/area/location"}>
                        返回
                    </Link>
                </Form.Item>
            </Form>
        );
    }
    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Area);
