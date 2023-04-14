import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Basic_Authorize from "./basic_authorize";
import webapi from "../utils/webapi";
import moment from "moment";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import {
  Form,
  Input,
  Drawer,
  Tree,
  Table,
  Button,
  Cascader,
  Radio,
  Space,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib/form"; 
const BREADCRUMB = {
  title: "权限管理",
  lists: [
    { title: "主页", url: "/" },
    { title: "权限管理", url: "/permission" },
  ],
  buttons: [{ title: "权限组管理", url: "/permission/group" }],
};
type Module_data<T = any> = {
  [key: number]: T;
};
type State = {
  menus_children?: [];
  group?: Module_data<Server.Permission_group>;
  visibility?: boolean;
  permission_children?: [];
  children?: [];
  u_action?: string;
  drawer_visible?: boolean;
  applications: Server.data;
};
class Permission extends Basic_Authorize<{}, State> {
  formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
  group = {};
  permission_children = [];
  tree_children = [];
  /**
   * 构造
   */
  constructor(props: any) {
    super(props);
  }
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}): void {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  __init_state_after() {
    return {
      ...super.__init_state_after(),
      group: {},
      permission_children: [],
      children: [],
    };
  }
  __handle_init_before = () => {
    // super.__handle_init_before();
  };

  /*----------------------1 other start----------------------*/

  /**
   * 获取群组
   * @return obj
   */
  async get_group(reset = false) {
    var data = this.group || {};
    if (reset || Object.keys(data).length === 0) {
      var res = await webapi.request.get("permission/group", {
        data: {
          dict: 1,
        },
      });
      if (res.code === 10000) {
        data = res.lists;
      }
    }
    this.group = data;
    return this.group;
  }
  /**
   * 获取权限树
   * @return obj
   */
  async get_permission_children(reset = false) {
    let data = this.permission_children || {};
    if (reset || Object.keys(data).length === 0) {
      const res = await webapi.request.get("permission/children");
      if (res.code === 10000) {
        data = res.lists;
      }
    }
    this.permission_children = data as [];
    return this.permission_children;
  }
  /**
   * 获取栏目树
   * @return obj
   */
  async get_children(reset = false) {
    let children = this.tree_children || [];
    if (reset || children.length === 0) {
      let data = await webapi.request.get("permission/children", {
        data: {
          select: "CONCAT(name,url) as title,id as key,parent_id,group_id",
          fieldnames: { name: "title", id: "key", parent_id: "parent_id" },
          fieldnames_group: { name: "title", id: "key" },
        },
      });
      if (data.code === 10000) {
        this.tree_children = children = data.lists;
      }
    }
    return children;
  }

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/

  /**
   * index  列表数据
   */
  async __init_index(d = {}) {
    const applications = await this.get_applications();
    const buttons = [
      { title: "添加权限", url: "/permission/add" },
      { title: "树结构", url: "/permission/children" },
      { title: "群组管理", url: "/permission/group" },
    ];
    const group = await this.get_group();
    this.setState({ group,applications }, () => {
      this.__init_lists("permission/lists", d);
    });
    this.__breadcrumb({ buttons });
  }
  /**
   * group 列表数据
   */

  async __init_group(d = {}) {
    let buttons = [
      { title: "添加群组", url: "/permission/group_add" },
      { title: "权限管理", url: "/permission" },
    ];
    let lists=BREADCRUMB.lists;
    lists.push({ title: "群组", url: "/permission/group" });
    let title = "群组";
    this.__init_lists("permission/group", d);
    this.__breadcrumb({ buttons, title,lists });
  }

  /*----------------------2 init end  ----------------------*/

  async __init_add_edit(u_action: string) {
    const b = { title: "" };
    let data = { name: "" };
    const id = this.state.id;
    if (u_action === "edit" && id) {
      const res = await webapi.request.get("permission/get", {
        data: {
          id,
        },
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = `${BREADCRUMB.title} - ${data.name} - 编辑`;
    } else {
      b.title = `${BREADCRUMB.title} - 添加`;
    }
    const permission_children = await this.get_permission_children();
    this.setState({ data, permission_children });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }
  __init_group_edit() {
    this.__init_group_add_edit("edit");
  }
  __init_group_add() {
    this.__init_group_add_edit("add");
  }
  async __init_group_add_edit(u_action: string) {
    const b = { title: "" };
    let data = { name: "" };
    if (u_action === "edit" && this.state.id) {
      var res = await webapi.request.get("permission/group_get", {
        data: {
          id: this.state.id,
        },
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = `{BREADCRUMB.title}-群组-${data.name}-编辑`;
    } else {
      b.title = `${BREADCRUMB.title}-群组-添加`;
    }
    this.setState({
      data: data,
    });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }
  async __init_children() {
    const children = await this.get_children(true);
    const b = {
      buttons: [
        {
          title: "添加权限",
          url: "#!",
          onClick: () => {
            this.handle_add();
          },
        },
      ],
    };
    this.setState({
      children,
    });
    this.__breadcrumb(b);
  }
  /*----------------------3 handle start----------------------*/
  /**
   * cascader_id 操作
   **/
  handle_cascader_id = (value: any, field: any) => {
    var id = value[value.length - 1];
    if (id !== this.state.id) {
      this.setState({
        [field]: id,
      });
    }
  };

  /**
   * 提交
   **/
  handle_submit = async (data: Server.Permission = { id: 0 }) => {
    data.parent_id = data.parent_id || 0;
    var res = await webapi.request.post("permission/dopost", {
      data,
    });
    if (res.code === 10000) {
      this.get_permission_children(true);
      webapi.message.success(res.message);
      this.props.history.replace("/permission");
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 集中 删除
   **/
  handle_do_delete(url: string, id: number) {
    this.__handle_delete({
      url: `permission/${url}`,
      data: { data: { id } },
    });
  }
  /**
   * 删除
   **/
  handle_delete(id: number) {
    this.handle_do_delete("delete", id);
  }
  /**
   * 群组删除
   **/
  handle_group_delete(id: number) {
    this.handle_do_delete("group_delete", id);
  }
  /**
   * 群组提交
   **/
  handle_group_submit = async (data = {}) => {
    const res = await webapi.request.post("permission/group_dopost", {
      data,
    });
    if (res.code === 10000) {
      this.get_group(true);
      webapi.message.success(res.message);
      this.props.history.replace("/permission/group");
    } else {
      webapi.message.error(res.message);
    }
  };
  handle_add = () => {
    this.handle_add_edit("add", 0);
  };
  handle_add_edit = async (u_action: string, id: number) => {
    let data = {};
    if (u_action === "edit" && id) {
      const res = await webapi.request.get("permission/get", {
        data: {
          id,
        },
      });
      if (res.code === 10000) {
        data = res.data;
      }
    }
    const permission_children = await this.get_permission_children();
    this.setState({
      data,
      u_action,
      permission_id: id,
      permission_children,
      drawer_visible: true,
    });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
  };
  handle_select = (selectedKeys = [], info = { node: { key: 0 } }) => {
    this.handle_add_edit("edit", info.node.key);
  };
  handle_drag_end = (info: any) => {
    console.log(info);
  };

  handle_drop = async (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const res = await webapi.request.post("permission/dopost", {
      data: { id: dragKey, parent_id: dropKey },
    });
    if (res.code === 10000) {
      this.__init_children();
    }
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
        .then((data) => {
          this.handle_finish_dopost(data);
        })
        .catch((info) => {
          //console.log('Validate Failed:', info);
        });
  };
  handle_finish_dopost = async (data: Server.Permission = { id: 0 }) => {
    // data.id = this.state.permission_id;
    // data.parent_id = this.state.parent_id || 0;
    // data.group_id = this.state.group_id || 0;
    const res = await webapi.request.post("permission/dopost", {
      data,
    });
    if (res.code === 10000) {
      this.setState({ parent_id: 0 });
      this.get_permission_children(true);
      this.__init_children();
      this.handle_drawer_close();
      webapi.message.success(res.message);
    } else {
      webapi.message.error(res.message);
    }
  };
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/

  /**
   * 渲染 首页
   **/
  __render_index(): JSX.Element {
    const state = this.state as unknown as State;
    const group = state.group || {};
    const applications = state.applications;
    const columns: ProColumns<Server.Permission>[] = [
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
        width: 200,
      },
      {
        title: "链接",
        sorter: true,
        dataIndex: "url",
        align: "left",
      },
      {
        title: "群组",
        sorter: true,
        width: 100,
        dataIndex: "group_id",
        render: (_, row) => {
          let i = row.group_id as number;
          return group[i] ? group[i]["name"] : "--";
        },
        align: "center",
        search: false,
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
        render: (_, row) => {
          if (row.update_time && row.update_time > 0) {
            return moment(row.update_time * 1000).format("YYYY-MM-DD HH:mm:ss");
          } else {
            return <></>;
          }
        },
        align: "center",
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
        fixed: "right",
        width: 140,
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

              <Link to={`/permission/edit/${row.id}`}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
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
        // onChange={this.__handle_table_change} 
        search={{
          labelWidth: "auto",
        }}
        request={async (params = {}, sorts, filter) => {
          return this.__handle_tablepro_request(params,sorts,filter); 
        }}
       
      />
    );
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit_children(u_action: string) {
    const state = this.state as unknown as State;
    return (
      <>
        <Form.Item name="id" label="ID" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>

        <Form.Item name="url" label="链接">
          <Input />
        </Form.Item>
        <Form.Item name="parent_id_all" label="所属">
          <Cascader
            // defaultValue={this.state.parent_id_all}
            options={state.permission_children}
            fieldNames={{ label: "name", value: "id" }}
            changeOnSelect
            onChange={(o) => {
              this.handle_cascader_id(o, "parent_id");
            }}
          />
        </Form.Item>
        {u_action === "add" ? (
          <Form.Item name="is_new" label="全新">
            <Radio.Group>
              <Radio value={"1"}>是</Radio>
              <Radio value={"2"}>否</Radio>
            </Radio.Group>
          </Form.Item>
        ) : (
          ""
        )}
      </>
    );
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit(u_action: string) {
    return (
      <Form ref={this.formRef} onFinish={this.handle_submit}>
        {this.__render_add_edit_children(u_action)}
        <Form.Item label="">
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.props.server.loading}
          >
            {this.props.server.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/permission"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  __render_group() {
    const columns: ProColumns<Server.Menus>[] = [
      {
        title: "id",
        dataIndex: "id",

        sorter: true,
        align: "center",
      },
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name",

        align: "center",
      },

      {
        title: "时间",
        sorter: true,
        dataIndex: "create_time",
        render: (_, row) => {
          return row.create_time && row.create_time > 0 ? (
            moment(row.create_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          ) : (
            <></>
          );
        },

        align: "center",
      },
      {
        title: "操作",
        fixed: "right",
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

              <Link to={`/menus/edit/${row.id}`}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
              </Link>
            </Space>
          );
        },
      },
    ];
    return (
      <ProTable
        headerTitle="群组管理"
        rowKey={"id"}
        columns={columns}
        pagination={this.state.pagination}
        dataSource={this.state.lists}
        loading={this.props.server.loading}
        onChange={this.__handle_table_change}
        toolBarRender={() => [
          <Link to={"/menus/add"}>
            <Button type="primary" shape="round">
              添加菜单
            </Button>
          </Link>,
        ]}
        search={{
          labelWidth: 120,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {},
        }}
      />
    );
  }
  /**
   * 编辑
   * @return obj
   */
  __render_group_edit() {
    return this.render_group_add_edit();
  }
  /**
   * 添加
   * @return obj
   */
  __render_group_add() {
    return this.render_group_add_edit();
  }
  /**
   * 添加、编辑
   * @return obj
   */
  render_group_add_edit() {
    return (
      <Form ref={this.formRef} onFinish={this.handle_group_submit}>
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name="allow" label="链接">
          <Input />
        </Form.Item>

        <Form.Item label="">
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.props.server.loading}
          >
            {this.props.server.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/permission/group"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  __render_children() {
    const state = this.state as unknown as State;
    const children = state.children || [];
    return (<>
      <Tree
        className="draggable-tree"
        showLine={{ showLeafIcon: false }}
        draggable
        blockNode
        onDragEnd={this.handle_drag_end}
        onDrop={this.handle_drop}
        // onSelect={this.handle_select}
        treeData={children}
      />
      <Drawer
        title={(state.u_action === "add" ? "添加" : "编辑") + "权限"}
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
              shape="round"
              style={{ marginRight: 8 }}
              onClick={this.handle_drawer_close}
            >
              取消
            </Button>
            <Button
              shape="round"
              loading={this.props.server.loading}
              type="primary"
              onClick={this.handle_drawer_submit}
            >
              提交
            </Button>
          </div>
        }
      >
        <Form ref={this.formRef} onFinish={this.handle_submit}>
          {this.__render_add_edit_children(state.u_action)}
        </Form>
      </Drawer>
    </>);
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Permission);
