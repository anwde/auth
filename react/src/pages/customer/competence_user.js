import React from "react"; 
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Customer from "./basic.js";
import moment from "moment";
import { Form, Input, Table, Button, Drawer, Avatar } from "antd";
const BREADCRUMB = {
  title: "商户权限用户",
  lists: [
    { title: "主页", url: "/" },
    { title: "商户管理", url: "/customer" },
  ],
  buttons: [],
};
class Competence_user extends Basic_Customer {
  
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

  /**
   * index  列表数据
   */
  async __init_index(d = {}) {
    const customer_id = this.state.customer_id;
    const customer = await this.get_customer(customer_id);
    const b = { title: `${BREADCRUMB.title}-${customer.name}` };
    b.buttons = [
      {
        title: "添加用户",
        url: `#!`,
        onClick: () => {
          this.handle_user_add(1);
        },
      },
    ];
    d.customer_id = customer_id;
    this.init_lists("customer/competence_user/lists", d, b);
  }
  async __init_add_edit(action) {
    const type = await this.get_extend_items_type();
    const extend_id = this.state.extend_id;
    const extend = await this.get_extend(extend_id);
    const app = await this.get_app(extend.applications_id);
    const b = { buttons: [] };
    let data = {};
    if (action === "edit" && this.state.id) {
      const res = await webapi.request.get(
        "customer/applications_extend_items/get",
        {
          data: {
            id: this.state.id,
          },
        }
      );
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = `${BREADCRUMB.title}-${extend.name}-${data.name}-编辑`;
    } else {
      b.title = `${BREADCRUMB.title}-${extend.name}-添加`;
    }
    b.lists = BREADCRUMB.lists.concat();
    b.lists.push({
      title: "应用",
      url: `/customer/applications?customer_id=${app.customer_id}`,
    });
    b.lists.push({
      title: "拓展项",
      url: `/customer/applications_extend/index/${app.id}`,
    });
    this.setState({ type, data });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
  /**
   *  业务初始化前 子类可重写
   * @return obj
   */
  __handle_init_before = () => {};
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
        this.handle_finish_user(values);
      })
      .catch((info) => {
        //console.log('Validate Failed:', info);
      });
  };
  /**
   * 提交
   **/
  handle_finish_user = async (data = {}) => {
    const customer_id = this.state.customer_id;
    data.customer_id = customer_id;
    const res = await webapi.request.post("customer/competence_user/dopost", {
      data,
    });
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.handle_drawer_close();
      this.__method("init");
    } else {
      webapi.message.error(res.message);
    }
  };
  handle_user_add = () => {
    this.setState({
      drawer_visible: true,
    });
  };

  /**
   * 删除
   **/
  handle_delete = (id) => {
    this.__handle_delete({
      url: "customer/competence_user/delete",
      data: {
        id,
        customer_id: this.state.customer_id,
      },
    });
  };
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  /**
   * 渲染 首页
   **/
  __render_index() {
    const columns = [
      {
        title: "用户",
        sorter: true,
        fixed: "left",
        dataIndex: "id",
        align: "center",
        render: (field, data) => {
          return (
            <>
              <Avatar src={data.avatar}>{data.nickname}</Avatar>
              {data.nickname}({data.user_id} {data.mobile})
            </>
          );
        },
      },
      {
        title: "时间",
        sorter: true,
        dataIndex: "create_time",
        render: (field, data) => {
          return moment(data.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
        },
        align: "center",
      },
      {
        title: "操作",
        align: "center",
        render: (field, data) => {
          return (
            <div>
              <a
                href="#!"
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                onClick={() => {
                  this.handle_delete(data.id);
                }}
              >
                <i className="ti-trash" />
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <>
        <Table
          rowKey={(res) => res.id}
          columns={columns}
          dataSource={this.state.lists}
          pagination={this.state.pagination}
          loading={this.props.loading}
          onChange={this.__handle_table_change}
        />
        {this.__render_add_edit()}
      </>
    );
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit() {
    return (
      <Drawer
        title="添加用户"
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
          <Form.Item name="user_id" label="用户">
            <Input placeholder="请输入用户id或手机号" />
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Competence_user);
