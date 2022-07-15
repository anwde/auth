import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Basic_Component from "@/components/base/basic_component.js";
import webapi from "@/utils/webapi";
import moment from "moment";
import {
  Form,
  Input,
  Drawer,
  Tree,
  Table,
  Button,
  Cascader,
  Radio,
} from "antd";

const BREADCRUMB = {
  title: "权限管理",
  lists: [
    { title: "主页", url: "/" },
    { title: "权限管理", url: "/permission" },
  ],
  buttons: [{ title: "权限组管理", url: "/permission/group" }],
};
class Permission extends Basic_Component {
  formRef = React.createRef();
  group = {};
  permission_children = [];
  /**
   * 构造
   */
  constructor(props) {
    super(props);
  }

  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  __init_state_after() {
    return {
      ...super.__init_state_after(),
      group: {},
      permission_children: [],
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
    var data = this.permission_children || {};
    if (reset || Object.keys(data).length === 0) {
      var res = await webapi.request.get("permission/children");
      if (res.code === 10000) {
        data = res.lists;
      }
    }
    this.permission_children = data;
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
  __init_index(d = {}) {
    var buttons = [
      { title: "添加权限", url: "/permission/add" },
      { title: "树结构", url: "/permission/children" },
      { title: "群组管理", url: "/permission/group" },
    ];
    this.get_group().then((group) => {
      this.setState({ group }, () => {
        this.init_lists("permission/lists", d, { buttons });
      });
    });
  }
  /**
   * group 列表数据
   */

  async __init_group(d = {}) {
    var buttons = [
      { title: "添加群组", url: "/permission/group_add" },
      { title: "权限管理", url: "/permission" },
    ];
    var title = BREADCRUMB.title + "-群组";
    this.init_lists("permission/group", d, { buttons, title });
  }
  /**
   *  列表数据
   */
  async init_lists(url, data = {}, b = {}) {
    data.q = this.state.q;
    data.order_field = this.state.order_field;
    data.order_value = this.state.order_value;
    data.row_count = this.state.pagination.pageSize;
    data.offset = this.state.pagination.current;
    let res = await webapi.request.get(url, { data });
    let lists = [];
    if (res.code === 10000 && res.num_rows > 0) {
      lists = res.lists;
    }
    this.setState({
      lists: lists,
      pagination: { ...this.state.pagination, total: res.num_rows },
    });
    this.__breadcrumb(b);
  }
  /*----------------------2 init end  ----------------------*/

  async __init_add_edit(u_action) {
    let b = {};
    let data = {};
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
  async __init_group_add_edit(u_action) {
    var b = {};
    var data = {};
    if (u_action === "edit" && this.state.id) {
      var res = await webapi.request.get("permission/group_get", {
        data: {
          id: this.state.id,
        },
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = BREADCRUMB.title + "-群组-" + data.name + "-编辑";
    } else {
      b.title = BREADCRUMB.title + "-群组-" + "添加";
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
  handle_cascader_id = (value, field) => {
    var id = value[value.length - 1];
    if (id != this.state.id) {
      this.setState({
        [field]: id,
      });
    }
  };

  /**
   * 提交
   **/
  handle_submit = async (data = {}) => {
    data.id = this.state.id;
    data.parent_id = this.state.parent_id || 0;
    data.group_id = this.state.group_id || 0;
    var res = await webapi.request.post("permission/dopost", {
      data,
    });
    if (res.code === 10000) {
      this.get_permission_children(1);
      webapi.message.success(res.message);
      this.props.history.replace("/permission");
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 集中 删除
   **/
  handle_do_delete(url, id) {
    this.__handle_delete({
      url: "permission/" + url,
      data: { data: { id } },
    });
  }
  /**
   * 删除
   **/
  handle_delete(id) {
    this.handle_do_delete("delete", id);
  }
  /**
   * 群组删除
   **/
  handle_group_delete(id) {
    this.handle_do_delete("group_delete", id);
  }
  /**
   * 群组提交
   **/
  handle_group_submit = async (data = {}) => {
    data.id = this.state.id;
    var res = await webapi.request.post("permission/group_dopost", {
      data,
    });
    if (res.code === 10000) {
      this.get_group(1);
      webapi.message.success(res.message);
      this.props.history.replace("/permission/group");
    } else {
      webapi.message.error(res.message);
    }
  };
  handle_add = () => {
    this.handle_add_edit("add", 0);
  };
  handle_add_edit = async (u_action, id) => {
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
  handle_select = (selectedKeys, info) => {
    this.handle_add_edit("edit", info.node.key);
  };
  handle_drag_end = (info) => {
    console.log(info);
  };
  handle_drop2 = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...this.state.children];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    } 
    this.setState({
      children: data,
    });
    webapi.request.post("permission/dopost", {
      data: { id: dragKey, parent_id: dropKey },
    });
  };
  handle_drop = async (info) => { 
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
    this.formRef.current.resetFields();
    this.setState({
      drawer_visible: false,
    });
  };

  handle_drawer_submit = () => {
    this.formRef.current
      .validateFields()
      .then((data) => {
        this.handle_finish_dopost(data);
      })
      .catch((info) => {
        //console.log('Validate Failed:', info);
      });
  };
  handle_finish_dopost = async (data = {}) => {
    data.id = this.state.permission_id;
    data.parent_id = this.state.parent_id || 0;
    data.group_id = this.state.group_id || 0;
    const res = await webapi.request.post("permission/dopost", {
      data,
    });
    if (res.code === 10000) {
      this.setState({parent_id:0});
      this.get_permission_children(1);
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
  __render_index() {
    const group = this.state.group || {};
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
        render: (field, data) => {
          return group[data.group_id] ? group[data.group_id]["name"] : "--";
        },
        align: "center",
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
        fixed: "right",
        width: 140,
        render: (field, data) => {
          return (
            <div>
              <a
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                onClick={() => {
                  this.handle_delete(data.id);
                }}
              >
                <i className="ti-trash" />
              </a>
              <Link
                to={"/permission/edit/" + data.id}
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
          scroll={{ x: 200, y: "calc(100vh - 290px)" }}
        />
      </div>
    );
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit_children(u_action) {
    return (
      <>
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>

        <Form.Item name="url" label="链接">
          <Input />
        </Form.Item>
        <Form.Item name="parent_id_all" label="所属">
          <Cascader
            defaultValue={this.state.parent_id_all}
            options={this.state.permission_children}
            fieldNames={{ label: "name", value: "id" }}
            changeOnSelect
            onChange={(o) => {
              this.handle_cascader_id(o, "parent_id");
            }}
          />
        </Form.Item>
        {u_action === "add" ? (
          <Form.Item name="is_new" label="全新" defaultValue="2">
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
  __render_add_edit(u_action) {
    return (
      <Form ref={this.formRef} onFinish={this.handle_submit}>
        {this.__render_add_edit_children(u_action)}
        <Form.Item label="">
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.props.loading}
          >
            {this.props.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/permission"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  __render_group() {
    var that = this;
    const columns = [
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
        render: function (field, data) {
          return moment(data.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
        },

        align: "center",
      },
      {
        title: "操作",
        fixed: "right",
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
                to={"/permission/group_edit/" + d.id}
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
      <Table
        rowKey={(res) => res.id}
        columns={columns}
        dataSource={this.state.lists}
        pagination={this.state.pagination}
        loading={this.props.server.loading}
        onChange={this.__handle_table_change}
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
            loading={this.props.loading}
          >
            {this.props.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/permission/group"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  __render_children() {
    const children = this.state.children || [];
    return (
      <>
        <Tree
          className="draggable-tree"
          showLine={{ showLeafIcon: false }}
          draggable
          blockNode
          onDragEnd={this.handle_drag_end}
          onDrop={this.handle_drop}
          onSelect={this.handle_select}
          treeData={children}
        />
        <Drawer
          title={(this.state.u_action === "add" ? "添加" : "编辑") + "权限"}
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
                shape="round"
                style={{ marginRight: 8 }}
                onClick={this.handle_drawer_close}
              >
                取消
              </Button>
              <Button
                shape="round"
                loading={this.props.loading}
                type="primary"
                onClick={this.handle_drawer_submit}
              >
                提交
              </Button>
            </div>
          }
        >
          <Form ref={this.formRef} onFinish={this.handle_submit}>
            {this.__render_add_edit_children(this.state.u_action)}
          </Form>
        </Drawer>
      </>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Permission);
