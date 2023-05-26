import React from "react";
import Basic_Authorize from "./basic_authorize";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../utils/webapi";
import { Form, Input, Tree, Space, Button, Drawer, Avatar } from "antd";
import {
  UserSwitchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { FormInstance } from "antd/lib/form";
import moment from "moment";
import ProTable from "@ant-design/pro-table";
import type { ProColumns } from "@ant-design/pro-table";
const BREADCRUMB = {
  title: "角色管理",
  lists: [
    { title: "主页", url: "/" },
    { title: "角色管理", url: "/competence" },
  ],
  buttons: [],
};

type Module_data<T = any> = {
  [key: number | string]: T;
};

type State = Server.State & {
  drawer_visible: boolean;
  customer: Server.data;
  applications: Server.data;
  server_state: Server.data;
  menus: [];
  columns: [];
  permission: [];
};
class Competence extends Basic_Authorize<{}, State> {
  formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
  columns: Module_data<[Server.Columns]> = {};
  permission: Module_data<[Server.Permission]> = {};
  menus: Module_data<[Server.Menus]> = {};
  server_state: Server.data = {};
  /**
   * 构造
   */
  // constructor(props) {
  //     super(props);
  // }

  __handle_init_before = () => {
    super.__handle_init_before();
    this.get_server_state();
  };
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}): void {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  /*----------------------1 other start----------------------*/
  async get_columns(data: { filters: {} }, reset = false) {
    let hash = webapi.utils.md5(
      JSON.stringify(webapi.utils.ksort(data.filters))
    ) as string;
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
    this.columns[hash] = columns as [Server.Columns];
    return this.columns[hash];
  }
  async get_permission(data: { filters: {} }, reset = false) {
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
    this.permission[hash] = permission as [Server.Permission];
    return this.permission[hash];
  }

  async get_menus(data: { filters: {} }, reset = false) {
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
    this.menus[hash] = menus as [Server.Menus];
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
  async __init_user(d = { competence_id: 0 }) {
    let data = this.state.data as Server.Competence;
    if (Object.keys(data).length === 1) {
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
    let title = `${BREADCRUMB.title}-${data.name}`;
    let buttons = [
      {
        title: "添加用户",
        url: "#!",
        onClick: this.handle_user_add,
      },
    ];
    this.setState({ order_field: "UC.create_time" }, () => {
      d.competence_id = this.state.id;
      this.init_lists("competence/user", d as Server.Query, {
        title,
        buttons,
      });
    });
  }
  /**
   * index  列表数据
   */
  async __init_index(d = {}) {
    let state = await this.get_server_state();
    let customer = await this.get_customer();
    let applications = await this.get_applications();
    let buttons = [
      { title: "添加角色", url: "/competence/add" },
      { title: "栏目", url: "/columns" },
      { title: "菜单", url: "/menus" },
      { title: "权限", url: "/permission" },
    ];
    this.setState(
      {
        customer,
        applications,
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
  async init_lists(url: string, d: Server.Query, b = {}) {
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
    // if (query.filters) {
    //   try {
    //     d.filters = JSON.parse(query.filters);
    //   } catch (err) {}
    // }
    // if (query.customerid) {
    //   d.filters.customer_id = query.customerid;
    // }
    // if (query.customerappid) {
    //   d.filters.client_id = query.customerappid;
    // }
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

  async __init_add_edit(action: string) {
    let b: Server.Breadcrumb = {};
    let data = { customer_id: 0, client_id: 0, name: "" };
    if (action === "edit" && this.state.id) {
      const res = await webapi.request.get("competence/get", {
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

    const columns = await this.get_columns({
      filters: { customer_id: data.customer_id, client_id: data.client_id },
    });
    const permission = await this.get_permission({
      filters: { customer_id: data.customer_id, client_id: data.client_id },
    });
    const menus = await this.get_menus({
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
  handle_user_add = () => {
    this.setState({
      drawer_visible: true,
    });
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
        .then((values) => {
          this.handle_finish_user(values);
        })
        .catch((info) => {
          //console.log('Validate Failed:', info);
        });
  };
  async handle_finish_user(values: Server.Competence_user) {
    let data: Server.Competence_user = { id: 0 };
    data.competence_id = this.state.id;
    data.user_id = values.user_id;
    let res = await webapi.request.post("competence/user_add", {
      data,
    });
    if (res.code === 10000) {
      this.formRef.current && this.formRef.current.resetFields();
      webapi.message.success(res.message);
    } else {
      webapi.message.error(res.message);
    }
    this.__init_user();
    this.setState({ drawer_visible: false });
  }

  handle_menus_check = (selectedKeys: any = []) => {
    this.setState({ data: { ...this.state.data, menus: selectedKeys } });
  };
  handle_columns_check = (selectedKeys: any = []) => {
    this.setState({ data: { ...this.state.data, columns: selectedKeys } });
  };
  handle_permission_check = (selectedKeys: any = []) => {
    this.setState({
      data: { ...this.state.data, permission: selectedKeys },
    });
  };

  /**
   * 提交
   **/
  handle_submit = async (data: Server.Competence) => {
    const state = this.state.data as Server.Competence;
    data.id = this.state.id;
    data.menus = state.menus;
    data.columns = state.columns;
    data.permission = state.permission;
    // data.browser_test_no_encrypt = 'qw12@!';
    let res = await webapi.request.post("competence/dopost", {
      data,
    });
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/competence");
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 集中 删除
   **/
  handle_do_delete(url: string, data = {}) {
    this.__handle_delete({
      url: "competence/" + url,
      data: data,
    });
  }
  /**
   * 删除
   **/
  handle_delete(id: number) {
    this.handle_do_delete("delete", { id: this.state.id });
  }
  /**
   * 删除
   **/
  handle_user_delete = (id: number) => {
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
    const state = this.state as unknown as State;
    const columns: ProColumns<Server.Competence_user>[] = [
      {
        title: "用户",
        sorter: true,
        fixed: "left",
        dataIndex: "id",
        align: "center",
        render: (_, row) => {
          return (
            <>
              <Avatar src={row.avatar}>{row.nickname}</Avatar>
              {row.nickname}({row.user_id} {row.mobile})
            </>
          );
        },
      },
      {
        title: "时间",
        sorter: true,
        dataIndex: "create_time",
        align: "center",
        render: (_, row) => {
          if (row.create_time && row.create_time > 0) {
            return moment(row.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
          } else {
            return <></>;
          }
        },
      },
      {
        title: "操作",
        align: "center",
        render: (_, row) => {
          return (

            <>
              <Button
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                title="删除"
                onClick={() => {
                  this.handle_user_delete(row.id);
                }}
              />

            </>
          );
        },
      },
    ];

    return (<>
      <ProTable
        headerTitle="授权用户"
        rowKey={"id"}
        columns={columns}
        pagination={this.state.pagination}
        dataSource={this.state.lists}
        loading={this.props.server.loading}
        onChange={this.__handle_table_change}
      />
      <Drawer
        title="添加用户"
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
              onClick={this.handle_drawer_close}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button
              onClick={this.handle_drawer_submit}
              loading={this.props.server.loading}
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
    </>);
  }
  /**
   * 渲染 首页
   **/
  __render_index() {
    const state = this.state as unknown as State;
    const server = this.props.server;
    const customer = state.customer;
    const applications = state.applications;
    const server_state = state.server_state;

    const columns: ProColumns<Server.Competence>[] = [
      {
        title: "ID",
        sorter: true,
        fixed: "left",
        dataIndex: "id",
        align: "center",
        width: "100px",
        render: (_, row) => {
          return (
            <>
              <Link to={"/competence/user/" + row.id}>{row.id}</Link>
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
        search: false,
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
        search: false,
        render: (_, row) => {
          let i = row.state as number;
          return server_state[i] && server_state[i]["name"];
        },
      },

      {
        title: "商户",
        sorter: true,
        dataIndex: "customer_id",
        align: "center",
        search: false,
        render: (_, row) => {
          let i = row.customer_id as number;
          return (
            <>
              <Link to={`?customerid=${i}`} onClick={() => this.__init_index()}>
                {customer[i] && customer[i]["name"]}
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
        search: false,
        render: (_, row) => {
          let i = row.client_id as number;
          return (
            <>
              <Link
                to={`?customerappid=${i}`}
                onClick={() => this.__init_index()}
              >
                {applications[i] && applications[i]["name"]}({i})
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
        align: "center",
        render: (_, row) => {
          return row.create_time && row.create_time > 0 ? (
            moment(row.create_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          ) : (
            <></>
          );
        },
        valueType: "dateRange",
        search: {
          transform: (value) => {
            return {
              start_time: value[0],
              end_time: value[1],
            };
          },
        },
      },
      {
        title: "操作",
        align: "center",
        width: "200px",
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

              <Link to={`/competence/edit/${row.id}`}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
              </Link>
              <Link to={`/competence/user/${row.id}`}>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<UserSwitchOutlined />}
                />
              </Link>
            </Space>
          );
        },
      },
    ];
    return (
      <ProTable
        rowKey="id"
        columns={columns}
        pagination={this.state.pagination}
        dataSource={this.state.lists}
        loading={this.props.server.loading}
        search={{
          labelWidth: "auto",
        }}
        request={async (params = {}, sorts, filter) => {
          return this.__handle_tablepro_request(params, sorts, filter);
        }}
      />
    );
  }

  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit(u_action: string) {
    const state = this.state as unknown as State;
    const data = state.data as Server.Competence;
    console.log("data=>", state);
    return (
      <Form ref={this.formRef} onFinish={this.handle_submit}>
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item label="菜单">
          <Tree
            showLine={true}
            checkable
            checkedKeys={data.menus}
            onCheck={this.handle_menus_check}
            treeData={state.menus}
          />
        </Form.Item>
        <Form.Item name="permission" label="权限">
          <Tree
            showLine={true}
            checkable
            checkedKeys={data.permission}
            onCheck={this.handle_permission_check}
            treeData={state.permission}
          />
        </Form.Item>
        <Form.Item label="栏目">
          <Tree
            showLine={true}
            checkable
            checkedKeys={data.columns}
            onCheck={this.handle_columns_check}
            treeData={state.columns}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.props.server.loading}
          >
            {this.props.server.loading ? "正在提交" : "立即提交"}
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
