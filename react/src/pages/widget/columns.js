import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import moment from "moment";
import {
    Form,
    Input,
    Radio,
    Select,
    Table,
    Button,
    Cascader,
    Drawer,
    Tree,
} from "antd";
import Sortable from "sortablejs";  
const BREADCRUMB = {
    title: "栏目组件",
    lists: [
        { title: "主页", url: "/" },
        { title: "组件管理", url: "/widget/columns" },
    ],
    buttons: [{ title: "添加组件", url: "/widget/columns/add" }],
};
class Columns extends Basic_Component {
    formRef = React.createRef();
    columns = [];
    widget = {};
    /**
     * 面包屑导航
     */
    __breadcrumb(data = {}) {
        super.__breadcrumb({ ...BREADCRUMB, ...data });
    }
     
    __init_state_after(){
        var query = webapi.utils.query();
        const d={
            widget_id: query.widget_id ? query.widget_id : 0,
            item_id: query.item_id ? query.item_id : 0,
            columns: [],
        };
        console.log(this.props.match.params.method)
        if(this.props.match.params.method=='item'){
            d.order_field='idx';
            d.order_value='asc';
        } 
        return d;
    }
    __handle_init_before = () => {
        this.get_columns().then((columns) => {
            this.setState({ columns });
        });
    };
    /*----------------------1 other start----------------------*/

    async get_widget(reset = false, id) {
        var widget = this.widget
            ? this.widget[id]
                ? this.widget[id]
                : {}
            : {};
        if (reset || Object.keys(widget).length === 0) {
            var res = await webapi.request.get("widget/columns/get", {
                id,
            });
            if (res.code === 10000) {
                widget = res.data;
            }
        }
        this.widget[id] = widget;
        return widget;
    }
    /**
     * 获取columns
     * @return obj
     */
    async get_columns(reset = false) {
        var columns = this.columns || {};
        if (reset || Object.keys(columns).length === 0) {
            var res = await webapi.request.get("authorize/columns/children", {
                fieldnames: {
                    name: "title",
                    id: "key",
                    parent_id: "parent_id",
                },
            });
            if (res.code === 10000) {
                columns = res.lists;
            }
        }
        this.columns = columns;
        return columns;
    }

    /*----------------------1 other end  ----------------------*/

    /*----------------------2 init start----------------------*/
    /**
     * index  列表数据
     */
    __init_index(d = {}) {
        this.init_lists("widget/columns/lists", d);
    }
    /**
     * item 列表数据
     */
    async __init_item(d = {}) {
        var b = {};
        this.get_widget(false, this.state.widget_id).then((widget) => {
            this.setState({ widget,drawer_visible:false });
            b.title = BREADCRUMB.title + "-" + widget.name + "-项目";
        });
        d.widget_id = this.state.widget_id;
        b.buttons = [
            {
                title: "添加项目",
                url: "?widget_id=" + d.widget_id,
                onClick: this.__init_item_edit,
            },
        ];
        this.init_lists("widget/columns/item", d, b);
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
        console.log('data=>',this.state.pagination)
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
    /*----------------------2 init end  ----------------------*/

    async __init_add_edit(action) {
        var b = {};
        var data = {};
        if (action === "edit" && this.state.id) {
            var res = await webapi.request.get("widget/columns/get", {
                id: this.state.id,
            });
            if (res.code === 10000) {
                data = res.data;
            }
            b.title = BREADCRUMB.title + "-" + data.name + "-编辑";
        } else {
            b.title = BREADCRUMB.title + "-" + "添加";
        }
        this.setState({ data: data, u_action: "lists" });
        this.formRef.current &&
            this.formRef.current.setFieldsValue({ ...data });
        this.__breadcrumb(b);
    }
    __init_item_edit = () => {
        this.__init_item_add_edit("edit");
    };
    __init_item_add() {
        this.__init_item_add_edit("add");
    }
    async __init_item_add_edit(action) {
        var data = {}; 
        var res = await webapi.request.get("widget/columns/items", {
            widget_id: this.state.widget_id,
        });
        if (res.code === 10000) {
            data = res.data;
        } 
        this.setState({
            drawer_visible: true,
            data: data,
        });
        this.formRef.current &&
            this.formRef.current.setFieldsValue({ ...data });
    }

    /*----------------------3 handle start----------------------*/

    /**
     * 提交
     **/
    handle_submit = async (data = {}) => {
        data.id = this.state.id;
        data.parent_id = this.state.parent_id;
        var res = await webapi.request.post(
            "widget/columns/dopost",
            data
        );
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace("/widget/columns/");
        } else {
            webapi.message.error(res.message);
        }
    };

    /**
     * 集中 删除
     **/
    handle_do_delete(url, id) {
        var that = this;
        webapi.confirm(
            "widget/columns/" + url,
            { id: id },
            function (data) {
                if (data.status === "success") {
                    webapi.message.success(data.message);
                    that.__method("init_");
                } else {
                    webapi.message.error(data.message);
                }
            }
        );
    }
    /**
     * 删除
     **/

    handle_delete(id) {
        this.handle_do_delete("delete", id);
    }
    /**
     * 项目删除
     **/
    handle_group_delete(id) {
        this.handle_do_delete("group_delete", id);
    }
    /**
     * 项目提交
     **/
    handle_group_submit = async (data = {}) => {
        data.ids = this.state.data.ids;
        data.widget_id = this.state.widget_id;
        var res = await webapi.request.post(
            "widget/columns/item_dopost",
            data
        );
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.handle_drawer_close();
            this.__init_item();
        } else {
            webapi.message.error(res.message);
        }
    };
    handle_drawer_close = () => {
        this.formRef.current.resetFields();
        this.setState({
            drawer_visible: false,
        });
    };
    handle_drawer_submit = () => {
        this.formRef.current
            .validateFields()
            .then((values) => {
                this.handle_group_submit(values);
            })
            .catch((info) => {
                //console.log('Validate Failed:', info);
            });
    };
    handle_columns_check = (selectedKeys, info) => {
        this.setState({ data: { ...this.state.data, ids: selectedKeys } });
    };
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
                                to={
                                    "/widget/columns/item/?widget_id=" +
                                    d.id
                                }
                                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                            >
                                <i className="ti-menu-alt" />
                            </Link>
                            <Link
                                to={"/widget/columns/edit/" + d.id}
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
                <Form.Item {...this.__tail_layout()}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: "8px" }}
                        loading={this.props.loading}
                    >
                        {this.props.loading ? "正在提交" : "立即提交"}
                    </Button>
                    <Link className="button" to={"/widget/columns"}>
                        返回
                    </Link>
                </Form.Item>
            </Form>
        );
    }
    // 拖拽组件
    sortableWidget = (componentBackingInstance) => {
        let tab = document.getElementsByClassName("widgetTable");
        let el = tab[0].getElementsByClassName("ant-table-tbody")[0];
        let self = this; //可忽略
        let sortable = Sortable.create(el, {
            animation: 100, // 动画参数
            onEnd: function (evt) {
                // 拖拽完毕之后发生，只需关注该事件
                let menuArr = self.state.lists;
                let old_idx = menuArr[evt.oldIndex].idx;
                let new_idx = menuArr[evt.newIndex].idx;
                menuArr[evt.newIndex].idx = old_idx;
                menuArr[evt.oldIndex].idx = new_idx;
                let ids = [menuArr[evt.newIndex], menuArr[evt.oldIndex]];
                //先把拖拽元素的位置删除 再新的位置添加进旧的元素
                const oldEl = menuArr.splice(evt.oldIndex, 1);
                menuArr.splice(evt.newIndex, 0, oldEl[0]);
                console.log(old_idx, old_idx, menuArr, oldEl, evt);
                return self.change_item(ids, menuArr);
                //新的
                self.setState(
                    {
                        lists: menuArr,
                    },
                    () => {
                        self.change_item(ids);
                    }
                );
            },
        });
    };
    // 拖拽后保存列表请求
    change_item = (newLists, menuArr) => {
        var ids = newLists.map(function (value, index) {
            return { idx: value.idx, id: value.id, name: value.name };
        });

        webapi.request
            .post("widget/columns/item_idxspost", {
                widget_id: this.state.widget_id,
                ids: ids,
            })
            .then((data) => {
                if (data.code === 10000) {
                    this.setState({
                        lists: menuArr,
                    });
                    webapi.message.success(data.message);
                } else {
                    webapi.message.error(data.message);
                }
            });
    };

    __render_item() { 
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
                dataIndex: "related_id",
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
                                    this.handle_group_delete(d.id);
                                }}
                            >
                                <i className="ti-trash" />{" "}
                            </a>
                            <Link
                                to={
                                    "/widget/columns/item_edit/" +
                                    d.id +
                                    "?widget_id=" +
                                    d.widget_id
                                }
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
                <div className="widgetTable" ref={this.sortableWidget}>
                    <Table
                        rowKey={(res) => res.id}
                        columns={columns}
                        dataSource={this.state.lists}
                        pagination={this.state.pagination}
                        loading={this.props.loading}
                        onChange={this.__handle_table_change}
                    />
                </div>
                <Drawer
                    title="添加、编辑"
                    width={500}
                    forceRender={true}
                    onClose={this.handle_drawer_close}
                    visible={this.state.drawer_visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: "right",
                            }}
                        >
                            <Button
                                onClick={this.handle_drawer_close}
                                style={{ marginRight: 8 }}
                            >
                                取消
                            </Button>
                            <Button
                                onClick={this.handle_drawer_submit}
                                loading={this.props.loading}
                                type="primary"
                            >
                                提交
                            </Button>
                        </div>
                    }
                >
                    <Form layout="horizontal" ref={this.formRef}>
                        <Form.Item label="用户">
                            <Tree
                                showLine={true}
                                checkable
                                checkStrictly={true}
                                checkedKeys={this.state.data.ids}
                                onCheck={this.handle_columns_check}
                                treeData={this.columns || []}
                            />
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        );
    }
    /**
     * 编辑
     * @return obj
     */
    __render_item_edit() {
        return this.__render_item_add_edit();
    }
    /**
     * 添加
     * @return obj
     */
    __render_item_add() {
        return this.__render_item_add_edit();
    }
    /**
     * 添加、编辑
     * @return obj
     */
    __render_item_add_edit() {
        return (
            <Form
                ref={this.formRef}
                onFinish={this.handle_item_submit}
                {...this.__form_item_layout()}
            >
                <Form.Item name="name" label="名称">
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="名称">
                    <Input />
                </Form.Item>
                <Form.Item name="idx" label="排序">
                    <Input />
                </Form.Item>
                <Form.Item name="related_id" label="数据">
                    <Input />
                </Form.Item>
                <Form.Item label="" {...this.__tail_layout()}>
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
                        to={
                            "/widget/columns/item?widget_id=" +
                            this.state.widget_id
                        }
                    >
                        返回
                    </Link>
                </Form.Item>
            </Form>
        );
    }
    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Columns);
