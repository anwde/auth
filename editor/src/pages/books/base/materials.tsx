// @ts-nocheck
import { Link } from "react-router-dom";
import webapi from "../../../utils/webapi";
import React from "react";
import Basic from "./basic";
import { ProTable, TableDropdown } from '@ant-design/pro-components';
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
    Radio
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SettingFilled, ArrowRightOutlined, ArrowLeftOutlined, UnorderedListOutlined } from "@ant-design/icons";

export default class Materials extends Basic {
    formRef = React.createRef();
    constructor(props: any) {
        super(props);
    }
    /*----------------------0 parent start----------------------*/

    /*----------------------0 parent end----------------------*/

    /*----------------------1 other start----------------------*/

    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/
    __init_index = async () => {
        const server_state = await this.get_server_state();
        this.setState({ server_state })
    }
    //初始化-列表
    init_lists = async (
        params,
        sort,
        filter
    ) => {
        const state = this.state;
        let data = params;
        data.filters = state.filters;
        data.q = state.q;
        data.order_field = state.order_field;
        data.order_value = state.order_value;
        data.row_count = state.pagination.pageSize;
        data.offset = state.pagination.current;
        data.state_delete = 1;
        const res = await webapi.request.get(`${this.base_url}materials/lists`, { data: this.init_lists_build_data(data) });
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
    //构建-数据-列表
    init_lists_build_data = (data) => {
        return data;
    }
    __init_add_edit = async () => {
        const server_state = await this.get_server_state();
        this.setState({ server_state })
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/
    //批量操作 rowSelection
    __handle_tablepro_row_selection = () => {
        return false;
    }
    // finish 提交
    __handle_submit = async (data) => {
        const res = await webapi.request.post(
            `${this.base_url}materials/dopost`,
            { data: this.__handle_submit_build_data(data) });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace(`/${this.base_url}materials/index`);
        } else {
            webapi.message.error(res.message);
        }
    };
    //构建-数据-提交
    __handle_submit_build_data = (data) => {
        return data;
    }
    //批量删除
  __handle_delete_batch = (ids = []) => {
    webapi.confirm({
      url: `${this.base_url}materials/delete`,
      data: {
        ids: ids.length > 0 ? ids : this.state.selectedRowKeys,
      },
      success: (res) => {
        if (res.code === 10000) {
          webapi.message.success(res.message);
         this.__init_index();
        } else {
          webapi.message.error(res.message);
        }
      },
    });
  };
   
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    __render_index() {
        const state = this.state;
        const columns = [
            {
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
                fixed: "left",
                dataIndex: "name",
                align: "center",
                width: 100,

            },
            {
                title: "操作",
                align: "center",
                fixed: "right",
                valueType: "option",
                render: (_, row) => {
                    return (
                        <Space>
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<DeleteOutlined />}
                                title="删除"
                                onClick={() => {
                                    this.__handle_delete_batch([row.id]);
                                }}
                            />

                            <Link to={`/${this.base_url}materials/edit/${row.id}`}>
                                <Button type="primary" shape="circle" icon={<EditOutlined />} />
                            </Link>

                        </Space>
                    );
                },
            }];
        return <>
            <ProTable
                headerTitle={
                    <>
                        素材列表(<span style={{ fontSize: '11px', fontWeight: 'none' }}>共{this.state.pagination.total}个</span>)</>
                }
                rowKey={"id"}
                columns={columns}
                pagination={this.state.pagination}
                request={this.init_lists}
                onChange={this.__handle_table_change}
                // scroll={{ x: 1500, y: "calc(100vh - 290px)" }}
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
                tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
                    return this.render_table_alert_option(selectedRowKeys, selectedRows, onCleanSelected);
                }}
                search={false}
                rowSelection={this.__handle_tablepro_row_selection()}

            />
        </>
    }
    //渲染-添加|编辑
    __render_add_edit(u_action) {
        const state = this.state;
        const server_state = state.server_state || {};
        const related_type = server_state.materials ? server_state.materials.type : {};

        return <>

            <Form ref={this.formRef} onFinish={this.__handle_submit} {...this.__form_item_layout()}>

                <Form.Item label="名称" name="name">
                    <Input placeholder="名称" />
                </Form.Item>
                <Form.Item label="内容" name="conent">
                    <Input.TextArea
                        showCount
                        maxLength={300}
                        style={{
                            height: 120,
                            resize: 'none',
                        }}
                        placeholder="内容" />
                </Form.Item>
                <Form.Item label="类型" name="related_type">
                    <Select
                        placeholder="请选类型"
                    >

                        {Object.keys(related_type).map((key) => {
                            return (
                                <Select.Option value={key} key={key}>
                                    {related_type[key] && related_type[key].name}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="取代名称" name="displace">
                    <Input placeholder="取代名称" />
                </Form.Item>
                <Form.Item label="取代内容" name="displace_conent">
                    <Input.TextArea
                        showCount
                        maxLength={300}
                        style={{
                            height: 120,
                            resize: 'none',
                        }}
                        placeholder="取代内容"
                    />
                </Form.Item>

                <Form.Item label="">
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={this.props.server.loading}
                            shape="round"
                        >
                            提交保存
                        </Button>
                        <Link
                            to={`/${this.base_url}materials/index`}
                        >
                            返回
                        </Link>
                    </Space>
                </Form.Item>
            </Form>
        </>
    }
    /*----------------------4 render end  ----------------------*/
} 
