import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import moment from "moment";
import { Form, Input, Radio, Select, Table, Button, Cascader } from "antd";

const BREADCRUMB = {
    title: "系统访问日志",
    lists: [
        { title: "主页", url: "/" },
        { title: "系统访问日志", url: "/authorize/system_visit_log" },
    ],
    buttons: [],
};
class System_visit_log extends Basic_Component {
    /**
     * 面包屑导航
     */
    __breadcrumb(data = {}) {
        super.__breadcrumb({ ...BREADCRUMB, ...data });
    }

    /*----------------------1 other start----------------------*/

    /*----------------------1 other end  ----------------------*/

    /*----------------------2 init start----------------------*/
    /**
     * index  列表数据
     */
    async __init_index(d = {}) {
        d.order_field = this.state.order_field;
        d.order_value = this.state.order_value;
        d.row_count = this.state.pagination.pageSize;
        d.offset = this.state.pagination.current;
        // d.q = this.state.q;
        var data = await webapi.request.get("authorize/system_visit_log/lists", d);
        var lists = [];
        if (data.code === 10000 && data.num_rows > 0) {
            lists = data.lists;
        }
        this.setState({
            lists: lists,
            pagination: { ...this.state.pagination, total: data.num_rows },
        });
        this.__breadcrumb();
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start----------------------*/

    /**
     *  删除
     **/
    handle_delete(id) {
        webapi.confirm({
            url: "authorize/system_visit_log/delete",
            data: { id },
            onOk: (data) => {
                if (data.status === "success") {
                    webapi.message.success(data.message);
                    this.__method("init_");
                } else {
                    webapi.message.error(data.message);
                }
            },
        });
    }

    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start----------------------*/

    /**
     * 渲染 首页
     **/
    __render_index() {
        const columns = [
            {
                title: "名称",
                sorter: true,
                fixed: "left",
                dataIndex: "name",
                align: "center",
            },
            {
                title: "用户",
                sorter: true,
                fixed: "left",
                dataIndex: "user_id",
                align: "center",
                render: (field, item) => {
                    return item.username + "(" + item.user_id + ")";
                },
            },
            {
                title: "地址",
                sorter: true,
                fixed: "left",
                dataIndex: "url",
                align: "center",
            },
            {
                title: "系统",
                fixed: "left",
                dataIndex: "os",
                align: "center",
            },
            {
                title: "浏览器",
                sorter: true,
                fixed: "left",
                dataIndex: "browser",
                align: "center",
                render: (field, item) => {
                    return item.browser + "  " + item.browser_version;
                },
            },
            {
                title: "IP",
                sorter: true,
                fixed: "left",
                dataIndex: "ip_address",
                align: "center",
            },

            {
                title: "时间",
                sorter: true,
                fixed: "left",
                dataIndex: "create_time",
                align: "center",
                render: function (d, item) {
                    return (
                        item.create_time > 0 &&
                        moment(item.create_time * 1000).format(
                            "YYYY-MM-DD HH:mm:ss"
                        )
                    );
                },
            },
            {
                title: "操作",
                dataIndex: "id",
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

    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(System_visit_log);
