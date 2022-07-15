import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import moment from "moment";
import { Form, Input, Radio, Select, Table, Button } from "antd";

const BREADCRUMB = {
    title: "模型管理",
    lists: [
        { title: "主页", url: "/" },
        { title: "模型管理", url: "/models" },
    ],
    buttons: [{ title: "添加模型", url: "/models/add" }],
};
class Models extends Basic_Component {
    formRef = React.createRef();
    server_state = { formtype: {}, datatype: {} };
    
    /*----------------------0 parent start----------------------*/
    /**
     * 面包屑导航
     */
    __breadcrumb(data = {}) {
        super.__breadcrumb({ ...BREADCRUMB, ...data });
    }
    __init_state_before() {
        return {};
    }
    __handle_init_before = () => {
        this.get_server_state();
    };

    /*----------------------0 parent end----------------------*/

    /*----------------------1 other start----------------------*/
    async get_server_state(reset = false) {
        var server_state = this.server_state && {
            datatype: {},
            formtype: {},
        };
        if (reset || Object.keys(server_state.datatype).length === 0) {
            var res = await webapi.request.get("models/state");
            if (res.code === 10000) {
                server_state = res.data;
            }
        }
        this.server_state = server_state;
        return server_state;
    }
    /*----------------------1 other end  ----------------------*/

    /*----------------------2 init start----------------------*/
    /**
     * index  列表数据
     */
    __init_index(d = {}) {
        this.init_lists("models/lists", d);
    }
    /**
     * index  列表数据
     */
    __init_field(d = {}) {
        this.init_lists("models/fields", { id: this.state.id });
    }

    /**
     *  列表数据
     */
    async init_lists(url, d = {}, b = {}) {
        d.order_field = this.state.order_field;
        d.order_value = this.state.order_value;
        d.row_count = this.state.pagination.pageSize;
        d.offset = this.state.pagination.current;
        d.q = this.state.q;
        var data = await webapi.request.get(url, d);
        var lists = [];
        if (data.code === 10000 && data.num_rows > 0) {
            lists = data.lists;
        }
        this.setState({
            lists: lists,
            pagination: { ...this.state.pagination, total: data.num_rows },
        });
        this.__breadcrumb(b);
    }
    async __init_add_edit(action) {
        var b = {};
        var data = {};
        if (action === "edit" && this.state.id) {
            var res = await webapi.request.get("models/get", {
                id: this.state.id,
            });
            if (res.code === 10000) {
                data = res.data;
            }
            b.title = BREADCRUMB.title + "-" + data.name + "-编辑";
        } else {
            b.title = BREADCRUMB.title + "-" + "添加";
        }
        this.setState({ data: data,u_action:'models' });
        this.formRef.current &&
            this.formRef.current.setFieldsValue({ ...data });
        this.__breadcrumb(b);
    }
    __init_field_edit() {
        this.__init_field_add_edit("edit");
    }
    __init_field_add() {
        this.__init_field_add_edit("add");
    }
    async __init_field_add_edit(action) {
        var b = {};
        var data = {};
        var server_state = await this.get_server_state();
        if (action === "edit" && this.state.id) {
            var res = await webapi.request.get("models/fields_get", {
                id: this.state.id,
            });
            if (res.code === 10000) {
                data = res.data;
            }
            b.title = BREADCRUMB.title + "-" + data.name + "-编辑";
        } else {
            b.title = BREADCRUMB.title + "-" + "添加";
        }
        this.setState({ data, server_state,u_action:'fields' });
        this.formRef.current &&
            this.formRef.current.setFieldsValue({ ...data });
        this.__breadcrumb(b);
    }

    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start----------------------*/

    handle_parent_id = (value) => {
        var parent_id = value[value.length - 1];
        if (parent_id !== this.state.id) {
            this.setState({
                parent_id: parent_id,
            });
        }
    };

    /**
     * 提交
     **/
    handle_submit = async (data = {}) => {
        data.id = this.state.id;
        data.parent_id = this.state.parent_id;
        var res = await webapi.request.post("models/dopost", data);
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace("/models");
        } else {
            webapi.message.error(res.message);
        }
    };

    /**
     * 集中 删除
     **/
    handle_do_delete(url, id) {
        var that = this;
        webapi.delete("models/" + url, { id: id }, function (data) {
            if (data.status === "success") {
                webapi.message.success(data.message);
                that.__method("init_");
            } else {
                webapi.message.error(data.message);
            }
        });
    }
    /**
     * 删除
     **/

    handle_delete(id) {
        this.handle_do_delete("delete", id);
    }

    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start----------------------*/

    /**
     * 渲染 首页
     **/
    __render_index() {
        var that = this;
        const columns = [
            {
                title: "名称",
                sorter: true,
                fixed: "left",
                dataIndex: "name",
                align: "center",
            },
            {
                title: "数据",
                sorter: true,
                fixed: "left",
                dataIndex: "tablename",
                align: "center",
            },
            {
                title: "描述",
                sorter: true,
                fixed: "left",
                dataIndex: "intro",
                align: "center",
            },
            {
                title: "状态",
                sorter: true,
                fixed: "left",
                dataIndex: "disabled",
                align: "center",
            },

            {
                title: "更新时间",
                sorter: true,
                dataIndex: "update_time",
                render: (field, data) => {
                    return (
                        data.update_time > 0 &&
                        moment(data.update_time * 1000).format(
                            "YYYY-MM-DD HH:mm:ss"
                        )
                    );
                },
                align: "center",
            },
            {
                title: "创建时间",
                sorter: true,
                dataIndex: "create_time",
                render: (field, data) => {
                    return moment(data.create_time * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                    );
                },
                align: "center",
            },
            {
                title: "操作",
                align: "center",
                render: (d, i) => {
                    return (
                        <div>
                            <a
                                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                                title="删除"
                                onClick={() => {
                                    this.handle_delete(d.id);
                                }}
                            >
                                <i className="ti-trash" />{" "}
                            </a>
                            <Link
                                to={"/models/field/" + d.id}
                                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                            >
                                <i className="ti-menu-alt" />
                            </Link>
                            <Link
                                to={"/models/edit/" + d.id}
                                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                            >
                                <i className="ti-infinite" />
                            </Link>

                            <Link
                                to={"/models/edit/" + d.id}
                                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                            >
                                <i className="ti-pencil-alt" />
                            </Link>
                        </div>
                    );
                },
            },
        ];
        return (
            <div className="card">
                <Table
                    rowKey={(res) => res.id}
                    columns={columns}
                    dataSource={this.state.lists}
                    pagination={this.state.pagination}
                    loading={this.props.loading}
                    onChange={this.__handle_table_change}
                />
            </div>
        );
    }

    /**
     * 添加、编辑
     * @return obj
     */
    __render_add_edit() {
        return (
            <Form
                ref={this.formRef}
                onFinish={this.handle_submit}
                {...this.__form_item_layout()}
            >
                <Form.Item name="name" label="名称">
                    <Input />
                </Form.Item>

                <Form.Item name="tablename" label="数据">
                    <Input />
                </Form.Item>

                <Form.Item name="intro" label="描述">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item {...this.__tail_layout()}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: "8px" }}
                        loading={this.props.loading}
                    >
                        {this.props.loading ? "正在提交" : "立即提交"}
                    </Button>
                    <Link className="button" to={"/models"}>
                        返回
                    </Link>
                </Form.Item>
            </Form>
        );
    }

    __render_field() {
        var that = this;
        const columns = [
            {
                title: "字段名",
                sorter: true,
                fixed: "left",
                dataIndex: "field",

                align: "center",
            },
            {
                title: "别名",
                sorter: true,
                fixed: "left",
                dataIndex: "name",

                align: "center",
            },
            {
                title: "类型",
                sorter: true,
                fixed: "left",
                dataIndex: "formtype",

                align: "center",
            },
            {
                title: "系统",
                sorter: true,
                fixed: "left",
                dataIndex: "is_system",

                align: "center",
                render: function (field, data) {
                    return field === "1" ? "是" : "否";
                },
            },
            {
                title: "基本",
                sorter: true,
                dataIndex: "is_base",
                align: "center",
                render: function (field, data) {
                    return field === "1" ? "是" : "否";
                },
            },
            {
                title: "内部",
                sorter: true,
                dataIndex: "is_core",
                align: "center",
                render: function (field, data) {
                    return field === "1" ? "是" : "否";
                },
            },
            {
                title: "排序",
                sorter: true,
                fixed: "left",
                dataIndex: "idx",

                align: "center",
            },
            {
                title: "禁用",
                dataIndex: "is_add",
                align: "center",
                render: function (field, data) {
                    return field === "1" ? "显示" : "隐藏";
                },
            },
            {
                title: "时间",
                sorter: true,
                dataIndex: "create_time",
                render: function (field, data) {
                    return moment(data.create_time * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                    );
                },

                align: "center",
            },
            {
                title: "操作",

                align: "center",
                render: (d, i) => {
                    return (
                        <div>
                            <a
                                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                                title="删除"
                                onClick={() => {
                                    this.handle_field_delete(d.id);
                                }}
                            >
                                <i className="ti-trash" />{" "}
                            </a>
                            <Link
                                to={"/models/field_edit/" + d.id}
                                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                            >
                                <i className="ti-pencil-alt" />
                            </Link>
                        </div>
                    );
                },
            },
        ];
        return (
            <div className="card">
                <Table
                    rowKey={(res) => res.id}
                    columns={columns}
                    dataSource={this.state.lists}
                    pagination={this.state.pagination}
                    loading={this.props.loading}
                    onChange={this.__handle_table_change}
                />
            </div>
        );
    }
    /**
     * 编辑
     * @return obj
     */
    __render_field_edit() {
        return this.__render_field_add_edit();
    }
    /**
     * 添加
     * @return obj
     */
    __render_field_add() {
        return this.__render_field_add_edit();
    }
    /**
     * 添加、编辑
     * @return obj
     */
    __render_field_add_edit() {
        const server_state = this.state.server_state || {
            formtype: {},
            datatype: {},
        };
        return (
            <Form
                ref={this.formRef}
                nFinish={this.handle_submit}
                {...this.__form_item_layout()}
            >
                <Form.Item name="formtype" label="类型">
                    <Select>
                        {Object.keys(server_state.formtype).map((val, key) => {
                            return (
                                <Select.Option key={key} value={val}>
                                    {server_state.formtype[val]}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="datatype" label="数据">
                    <Select>
                        {Object.keys(server_state.datatype).map((val, key) => {
                            return (
                                <Select.Option key={key} value={val}>
                                    {server_state.datatype[val]}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="constraint" label="长度">
                    <Input />
                </Form.Item>
                <Form.Item name="comment" label="注释">
                    <Input />
                </Form.Item>
                <Form.Item name="defaultvalues" label="默认">
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="别名">
                    <Input />
                </Form.Item>

                <Form.Item name="setting" label="选项">
                    <Input />
                </Form.Item> 
                

                

                <Form.Item name="visibility" label="状态">
                    <Radio.Group value={this.state.data.visibility}>
                        <Radio value={"1"}>显示</Radio>
                        <Radio value={"2"}>隐藏</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item {...this.__tail_layout()}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: "8px" }}
                        loading={this.props.loading}
                    >
                        {this.props.loading ? "正在提交" : "立即提交"}
                    </Button>
                    <Link
                        className="button"
                        to={"/models/fields/" + this.state.data.model_id}
                    >
                        返回
                    </Link>
                </Form.Item>
            </Form>
        );
    }
    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Models);
