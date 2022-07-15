import React from "react";
import Basic_Component from "@/components/base/basic_component.js";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import moment from "moment";
import { Form, Input, Tree, Table, Button, Drawer, Avatar } from "antd";

const BREADCRUMB = {
  title: "角色管理",
  lists: [
    { title: "主页", url: "/" },
    { title: "角色管理", url: "/competence" },
  ],
  buttons: [],
};
class Competence extends Basic_Component {
  formRef = React.createRef();
  /**
   * 构造
   */
  // constructor(props) {
  //     super(props);
  // }
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  __handle_init_before = () => {
    // this.get_server_state();
  };
  /*----------------------1 other start----------------------*/
  async get_columns(data = {}, reset = false) {
    let hash = webapi.utils.md5(
      JSON.stringify(webapi.utils.ksort(data.filters))
    );
    if (!this.columns) {
      this.columns = {};
    }
    let columns = this.columns[hash] ? this.columns[hash] : [];
    if (reset || columns.length === 0) {
      let res = await webapi.request.get("competence/columns", {
        data,
      });
      if (res.code === 10000) {
        columns = res.lists;
      }
    }
    this.columns[hash] = columns;
    return this.columns[hash];
  }
  async get_permission(data = {}, reset = false) {
    let hash = webapi.utils.md5(
      JSON.stringify(webapi.utils.ksort(data.filters))
    );
    if (!this.permission) {
      this.permission = {};
    }
    let permission = this.permission[hash] ? this.permission[hash] : [];
    if (reset || permission.length === 0) {
      let res = await webapi.request.get("competence/permission", {
        data,
      });
      if (res.code === 10000) {
        permission = res.lists;
      }
    }
    this.permission[hash] = permission;
    return this.permission[hash];
  }

  async get_menus(data = {}, reset = false) {
    let hash = webapi.utils.md5(
      JSON.stringify(webapi.utils.ksort(data.filters))
    );
    if (!this.menus) {
      this.menus = {};
    }
    let menus = this.menus[hash] ? this.menus[hash] : [];
    if (reset || menus.length === 0) {
      let res = await webapi.request.get("competence/menus", {
        data,
      });
      if (res.code === 10000) {
        menus = res.lists;
      }
    }
    this.menus[hash] = menus;
    return this.menus[hash];
  }
  async get_server_state(reset = false) {
    if (!this.server_state) {
      this.server_state = {};
    }
    let server_state = this.server_state ? this.server_state : {};
    if (reset || Object.keys(server_state).length === 0) {
      let res = await webapi.request.get("competence/state");
      if (res.code === 10000) {
        server_state = res.data;
      }
    }
    this.server_state = server_state;
    return this.server_state;
  }

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/
  /**
   * index  列表数据
   */
  async __init_user(d = {}) {
    let data = this.state.data;
    if (Object.keys(data).length === 0) {
      let res = await webapi.request.get("competence/get", {
        data: {
          id: this.state.id,
        },
      });

      if (res.code === 10000) {
        data = res.data;
        this.setState({
          data: data,
        });
      }
    }
    let title = BREADCRUMB.title + "-" + data.name;
    let buttons = [
      {
        title: "添加用户",
        url: "#!",
        onClick: this.handle_user_add.bind(this),
      },
    ];
    this.setState({ order_field: "UC.create_time" }, () => {
      d.competence_id = this.state.id;
      this.init_lists("competence/user", d, { title, buttons });
    });
  }
  /**
   * index  列表数据
   */
  async __init_index(d = {}) {
    let state = await this.get_server_state();
    let buttons = [
      { title: "添加角色", url: "/competence/add" },
      { title: "栏目", url: "/columns" },
      { title: "菜单", url: "/menus" },
      { title: "权限", url: "/permission" },
    ];
    this.setState(
      {
        server_state: state,
      },
      () => {
        this.init_lists("competence/lists", d, { buttons });
      }
    );
  }
  /**
   *  列表数据
   */
  async init_lists(url, d = {}, b = {}) {
    d.q = this.state.q;
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    const query = webapi.utils.query();
    console.log(query);
    if (!d.filters) {
      d.filters = {};
    }
    if (query.filters) {
      try {
        d.filters = JSON.parse(query.filters);
      } catch (err) {}
    }
    if (query.customerid) {
      d.filters.customer_id = query.customerid;
    }
    if (query.customerappid) {
      d.filters.client_id = query.customerappid;
    }
    let data = await webapi.request.get(url, { data: d });
    let lists = [];
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
    let b = {};
    let data = { customer_id: 0, client_id: 0 };
    if (action === "edit" && this.state.id) {
      let res = await webapi.request.get("competence/get", {
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

    let columns = await this.get_columns({
      filters: { customer_id: data.customer_id, client_id: data.client_id },
    });
    let permission = await this.get_permission({
      filters: { customer_id: data.customer_id, client_id: data.client_id },
    });
    let menus = await this.get_menus({
      filters: { customer_id: data.customer_id, client_id: data.client_id },
    });

    this.setState({
      data: data,
      columns: columns,
      menus: menus,
      permission: permission,
    });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }

  /*----------------------3 handle start----------------------*/
  handle_user_add(e) {
    this.setState({
      drawer_visible: true,
    });
  }
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
  async handle_finish_user(values) {
    let data = {};
    data.competence_id = this.state.id;
    data.user_id = values.user_id;
    let res = await webapi.request.post("competence/user_add", {
      data,
    });
    if (res.code === 10000) {
      this.formRef.current.resetFields();
      webapi.message.success(res.message);
    } else {
      webapi.message.error(res.message);
    }
    this.__init_user();
    this.setState({ drawer_visible: false });
  }

  handle_menus_check = (selectedKeys, info) => {
    this.setState({ data: { ...this.state.data, menus: selectedKeys } });
  };
  handle_columns_check = (selectedKeys, info) => {
    this.setState({ data: { ...this.state.data, columns: selectedKeys } });
  };
  handle_permission_check = (selectedKeys, info) => {
    this.setState({
      data: { ...this.state.data, permission: selectedKeys },
    });
  };

  /**
   * 提交
   **/
  async handle_submit(data = {}) {
    data.id = this.state.id;
    data.parent_id = this.state.parent_id;
    data.menus = this.state.data.menus;
    data.columns = this.state.data.columns;
    data.permission = this.state.data.permission;
    let res = await webapi.request.post("competence/dopost", {
      data,
    });
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/competence");
    } else {
      webapi.message.error(res.message);
    }
  }

  /**
   * 集中 删除
   **/
  handle_do_delete(url, d = {}) {
    this.__handle_delete({
      url: "competence/" + url,
      data: d,
    });
  }
  /**
   * 删除
   **/
  handle_delete(id) {
    this.handle_do_delete("delete", { id: this.state.id });
  }
  /**
   * 删除
   **/
  handle_user_delete = (id) => {
    this.handle_do_delete("user_delete", {
      id,
    });
  };

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/
  /**
   * 渲染 用户
   **/
  __render_user() {
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
                onClick={() => this.handle_user_delete(data.id)}
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
          rowKey={(res) => res.user_id}
          columns={columns}
          dataSource={this.state.lists}
          pagination={this.state.pagination}
          loading={this.props.loading}
          onChange={this.__handle_table_change}
        />

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
      </>
    );
  }
  /**
   * 渲染 首页
   **/
  __render_index() {
    const customer = this.props.server.customer || {};
    const applications = this.props.server.applications || {};
    const server_state = this.state.server_state || {};

    const columns = [
      {
        title: "编号",
        sorter: true,
        fixed: "left",
        dataIndex: "id",
        align: "center",
        width: "100px",
        render: (field, data) => {
          return (
            <>
              <Link to={"/competence/user/" + data.id}>{field}</Link>
            </>
          );
        },
      },
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name",
        align: "center",
        render: (field, data) => {
          return (
            <>
              <Link to={"/competence/user/" + data.id}>{field}</Link>
            </>
          );
        },
      },
      {
        title: "数量",
        sorter: true,
        fixed: "left",
        dataIndex: "total",
        align: "center",
        render: (field, data) => {
          return (
            <>
              <Link to={"/competence/user/" + data.id}>{field}</Link>
            </>
          );
        },
      },
      {
        title: "类型",
        sorter: true,
        fixed: "left",
        dataIndex: "state",
        align: "center",
        render: (state) => {
          return server_state[state] && server_state[state]["name"];
        },
      },

      {
        title: "商户",
        sorter: true,

        dataIndex: "customer_id",
        align: "center",
        render: (field, data) => {
          return (
            <>
              <Link
                to={"?customerid=" + data.customer_id}
                onClick={() => this.__init_index()}
              >
                {customer[data.customer_id] &&
                  customer[data.customer_id]["name"]}
              </Link>
            </>
          );
        },
      },
      {
        title: "应用",
        sorter: true,
        dataIndex: "client_id",
        align: "center",
        render: (field, data) => {
          return (
            <>
              <Link
                to={"?customerappid=" + data.client_id}
                onClick={() => this.__init_index()}
              >
                {applications[data.client_id] &&
                  applications[data.client_id]["name"]}
              </Link>
            </>
          );
        },
      },

      {
        title: "时间",
        sorter: true,
        dataIndex: "create_time",
        width: "190px",
        render: (field, data) => {
          return moment(data.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
        },
        align: "center",
      },
      {
        title: "操作",
        align: "center",
        width: "200px",
        fixed: "right",
        render: (field, data) => {
          return (
            <div>
              <a
                href="#!"
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                onClick={this.handle_delete.bind(this, data.id)}
              >
                <i className="ti-trash" />
              </a>
              <Link
                to={"/competence/edit/" + data.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="ti-pencil-alt" />
              </Link>
              <Link
                to={"/competence/user/" + data.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="ti-menu" />
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
          loading={this.props.server.loading}
          onChange={this.__handle_table_change}
          scroll={{ x: 100, y: "calc(100vh - 290px)" }}
        />
      </div>
    );
  }

  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit(u_action) {
    return (
      <Form ref={this.formRef} onFinish={this.handle_submit.bind(this)}>
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item label="菜单">
          <Tree
            showLine={true}
            checkable
            checkedKeys={this.state.data.menus}
            onCheck={this.handle_menus_check}
            treeData={this.state.menus}
          />
        </Form.Item>
        <Form.Item name="permission" label="权限">
          <Tree
            showLine={true}
            checkable
            checkedKeys={this.state.data.permission}
            onCheck={this.handle_permission_check}
            treeData={this.state.permission}
          />
        </Form.Item>
        <Form.Item label="栏目">
          <Tree
            showLine={true}
            checkable
            checkedKeys={this.state.data.columns}
            onCheck={this.handle_columns_check}
            treeData={this.state.columns}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.props.loading}
          >
            {this.props.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/competence"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }

  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Competence);
