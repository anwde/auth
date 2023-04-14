import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Customer from "./basic.js";
import moment from "moment";
import { Form, Input, Table, Button, Dropdown, Menu, Space, } from "antd";
import { UnorderedListOutlined, DeleteOutlined, EditOutlined, } from "@ant-design/icons";
const BREADCRUMB = {
    title: "商户管理",
    lists: [{
        title: "主页",
        url: "/"
    }, {
        title: "商户管理",
        url: "/customer"
    },],
    buttons: [{
        title: "添加商户",
        url: "/customer/add"
    }],
};
class Customer extends Basic_Customer {
    formRef = React.createRef();

    /*----------------------1 other start----------------------*/
    /**
     * 面包屑导航
     */
    __breadcrumb(data = {}) {
        super.__breadcrumb({
            ...BREADCRUMB,
            ...data
        });
    }
    /*----------------------1 other end  ----------------------*/

    /*----------------------2 init start----------------------*/
    /**
     * index  列表数据
     */
    __init_index(d = {}) {
        this.init_lists("customer/home/lists", d);
    }
    async __init_add_edit(action) {
        let b = {};
        let data = {};
        if (action === "edit" && this.state.id) {
            const res = await webapi.request.get("customer/home/get", {
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
        this.setState({
            u_action: "customer",
            data: data
        });
        this.formRef.current && this.formRef.current.setFieldsValue({
            ...data
        });
        this.__breadcrumb(b);
    }

    /*----------------------2 init end  ----------------------*/

    /**
     * 提交
     **/
    handle_submit = async (data = {}) => {
        data.id = this.state.id;
        const res = await webapi.request.post("customer/home/dopost", {
            data,
        });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace("/customer");
        } else {
            webapi.message.error(res.message);
        }
    };

    /**
     * 删除
     **/

    handle_delete(id) {
        this.handle_do_delete("home/delete", id);
    }

    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start----------------------*/

    /**
     * 渲染 首页
     **/
    __render_index() {
        const columns = [{
            title: "ID",
            sorter: true,
            fixed: "left",
            dataIndex: "id",
            align: "center",
        },
        {
            title: "名称",
            sorter: true,
            fixed: "left",
            dataIndex: "name",
            align: "center",
        }, {
            title: "应用",
            sorter: true,
            fixed: "left",
            dataIndex: "apps",
            align: "center",
        },

            {
                title: "更新时间",
                sorter: true,
                dataIndex: "update_time",
                render: (_, data) => {
                    return (
                        data.update_time > 0 &&
                        moment(data.update_time * 1000).format("YYYY-MM-DD HH:mm:ss")
                    );
                },
                align: "center",
            }, {
                title: "创建时间",
                sorter: true,
                dataIndex: "create_time",
                render: (field, data) => {
                    return moment(data.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
                },
                align: "center",
            }, {
                title: "操作",
                align: "center",
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

              <Link to={`/customer/edit/${row.id}`}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
              </Link>
              <Dropdown
                        overlay={this._render_dropdown_menus_action(row)}
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
    _render_dropdown_menus_action = (data) => {
        return (
            <Menu>
        <Menu.Item key='1'>
          <Link to={`/customer/applications?customer_id=${data.id}`}>
            <Button type="primary" shape="round">
              应用管理
            </Button>
          </Link>
        </Menu.Item>
        <Menu.Item key='2'>
          <Link to={`/customer/competence_user/index/${data.id}`}>
            <Button type="primary" shape="round">
              权限用户
            </Button>
          </Link>
        </Menu.Item>
      </Menu>
        );
    };
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
            style={{
                marginRight: "8px"
            }}
            loading={this.props.loading}
            >
            {this.props.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/customer"}>
            返回
          </Link>
        </Form.Item>
      </Form>
        );
    }

/*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({
    ...store
}))(Customer);