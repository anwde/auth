// @ts-nocheck
import React from "react";
import Basic_Component from "../../components/base/component";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../utils/webapi";
import moment from "moment";
import { Menu, Dropdown, Button, Pagination, Avatar, Tag, Form, Space, Divider, Input, Select } from "antd";
import { FileWordOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UnorderedListOutlined, SettingFilled } from "@ant-design/icons";
import { ProTable, TableDropdown } from '@ant-design/pro-components';
const BREADCRUMB = {
    title: "推荐位管理",
    lists: [
        {
            title: "推荐位管理",
            url: "/area/home",
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

    /**
     * 获取location
     * @return obj
     */
    async get_location(reset = false): Promise<any> {
        if (reset || Object.keys(this.location || {}).length === 0) {
            const res = await webapi.request.get("area/location/dict");
            this.location = res.code === 10000 ? res.data : {};
        }
        return this.location;
    }
    /**
    * 获取type
    * @return obj
    */
    async get_type(reset = false): Promise<any> {
        if (reset || Object.keys(this.type || {}).length === 0) {
            const res = await webapi.request.get("area/home/type");
            this.type = res.code === 10000 ? res.data : {};
        }
        return this.type;
    }
    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/
    async __init_index() {
        const buttons = [
            { title: "添架推荐位", url: `/area/home/add` },
            { title: "位置管理", url: `/area/location/index` },
        ];
        this.__breadcrumb({ buttons });
        const type = await this.get_type();
        const location = await this.get_location();
        this.setState({ type, location });
    }
    async __init_add_edit(action: string) {
        let b = { title: "" };
        let data = { name: "" };
        if (action === "edit" && this.state.id) {
            const res = await webapi.request.get("area/home/get", {
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
        const type = await this.get_type();
        const location = await this.get_location();
        this.setState({ data: data, type, location });
        this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
        this.__breadcrumb(b);
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
        const res = await webapi.request.get("area/home/lists", { data: d });
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

    /*----------------------3 handle start  ----------------------*/
    //提交
    handle_submit = async (data) => {
        data.id = this.state.id;
        const res = await webapi.request.post("area/home/dopost", { data });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace("/area/home");
        } else {
            webapi.message.error(res.message);
        }
    };

    //删除 
    handle_delete(id: number) {
        this.__handle_delete({
            url: `area/home/delete`,
            data: { id },
        });
    }
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    __render_index() {
        const state = this.state;
        const type = state.type || {};
        const location = state.location || {};
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
            title: "类型",
            sorter: true,
            dataIndex: "type",
            align: "center",
            render: (_, item) => {
                return type[item.type] ? type[item.type].name : '-';
            }

        },
        {
            title: "位置",
            sorter: true,
            dataIndex: "location",
            align: "center",
            render: (_, item) => {
                return location[item.location] ? location[item.location].name : '-';
            }
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

                        <Link to={`/area/item/index/${row.id}`}>
                            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} />
                        </Link>
                        <Link to={`/area/home/edit/${row.id}`}>
                            <Button type="primary" shape="circle" icon={<EditOutlined />} />
                        </Link>
                    </Space>
                );
            },
        },
        ];
        return <>
            <ProTable
                headerTitle="推荐位列表"
                rowKey={"id"}
                columns={columns}
                pagination={this.state.pagination}
                request={this.init_index}
                onChange={this.__handle_table_change}
                scroll={{ x: 800, y: "calc(100vh - 290px)" }}
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
        const state = this.state;
        const type = state.type || {};
        const location = state.location || {};
        return (
            <Form
                ref={this.formRef}
                onFinish={this.handle_submit}
                {...this.__form_item_layout()}
            >
                <Form.Item name="name" label="名称">
                    <Input />
                </Form.Item>
                <Form.Item name="amount" label="数量">
                    <Input />
                </Form.Item>
                <Form.Item name="type" label="类型">
                    <Select>
                        {Object.entries(type).map(([key, val]) => {
                            return (
                                <Select.Option key={key} value={val.id}>
                                    {val.name}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>

                <Form.Item name="location" label="位置">
                    <Select>
                        {Object.entries(location).map(([key, val]) => {
                            return (
                                <Select.Option key={key} value={val.id}>
                                    {val.name}
                                </Select.Option>
                            );
                        })}
                    </Select>
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
                    <Link className="button" to={"/area/home"}>
                        返回
                    </Link>
                </Form.Item>
            </Form>
        );
    }
    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Area);
