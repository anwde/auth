import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import moment from "moment";
import { Form, Input, Radio, Select, Table, Button, Cascader } from "antd";

const BREADCRUMB = {
  title: "菜单管理",
  lists: [
    { title: "主页", url: "/" },
    { title: "菜单管理", url: "/menus" },
  ],
  buttons: [
    { title: "添加菜单", url: "/menus/add" },
    { title: "群组管理", url: "/menus/group" },
  ],
};
class Menus extends Basic_Component {
  formRef = React.createRef();
  group = {};
  menus_children = [];

  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }

  /*----------------------1 other start----------------------*/

  /**
   * 获取群组
   * @return obj
   */
  async get_group(reset = false) {
    let group = this.group || {};
    if (reset || Object.keys(group).length === 0) {
      let res = await webapi.request.get("menus/group");
      if (res.code === 10000) {
        group = res.lists;
      }
      this.group = group;
    }
    return group;
  }
  /**
   * 获取菜单村
   * @return obj
   */
  async get_menus_children(reset = false) {
    var menus_children = this.menus_children || [];
    if (reset || menus_children.length === 0) {
      var res = await webapi.request.get("menus/children");
      if (res.code === 10000) {
        menus_children = res.lists;
      }
      this.menus_children = menus_children;
    }
    return menus_children;
  }

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/
  /**
   * index  列表数据
   */
  __init_index(d = {}) {
    this.init_lists("menus/lists", d);
  }
  /**
   * group 列表数据
   */
  async __init_group(d = {}) {
    var buttons = [
      { title: "添加群组", url: "/menus/group_add" },
      { title: "菜单管理", url: "/menus" },
    ];
    var title = BREADCRUMB.title + "-群组";
    this.init_lists("menus/group", d, { buttons, title });
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
  /*----------------------2 init end  ----------------------*/

  async __init_add_edit(action) {
    var b = {};
    var data = {};
    if (action === "edit" && this.state.id) {
      var res = await webapi.request.get("menus/get", {data:{
        id: this.state.id}
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = `${BREADCRUMB.title}-${data.name}-编辑`;
    } else {
      b.title = `${BREADCRUMB.title}-添加`;
    }
    let menus_children = await this.get_menus_children();
    let group = await this.get_group();
    this.setState({ data: data, menus_children, group });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }
  __init_group_edit() {
    this.__init_group_add_edit("edit");
  }
  __init_group_add() {
    this.__init_group_add_edit("add");
  }
  async __init_group_add_edit(action) {
    var b = {};
    var data = {};
    if (action === "edit" && this.state.id) {
      var res = await webapi.request.get("menus/group_get", {data:{
        id: this.state.id}
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = `${BREADCRUMB.title}-群组-${data.name}-编辑`;
    } else {
      b.title = `${BREADCRUMB.title}-群组-添加`;
    }
    this.setState({
      data: data,
    });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }

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
    var res = await webapi.request.post("menus/dopost", {data});
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/menus");
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 集中 删除
   **/
  handle_do_delete(url, id) {
    this.__handle_delete({
      url: "menus/" + url,
      data: { id },
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
    var res = await webapi.request.post("menus/group_dopost", {data});
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/menus/group");
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
    const columns = [
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name",
        align: "center",
      },
      {
        title: "链接",
        sorter: true,
        fixed: "left",
        dataIndex: "url",
        align: "center",
      },

      {
        title: "更新时间",
        sorter: true,
        dataIndex: "update_time",
        render: (field, data) => {
          return (
            data.update_time > 0 &&
            moment(data.update_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          );
        },
        align: "center",
      },
      {
        title: "创建时间",
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
        render: (d, i) => {
          return (
            <div>
              <a
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                href="#!"
                onClick={() => {
                  this.handle_delete(d.id);
                }}
              >
                <i className="ti-trash" />{" "}
              </a>
              <Link
                to={"/menus/edit/" + d.id}
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
    const menus_children = this.state.menus_children || [];
    const group = this.state.group || {};
    // console.log('d=>',this.props)
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handle_submit}
        {...this.__form_item_layout()}
      >
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name="idx" label="序号">
          <Input />
        </Form.Item>
        <Form.Item name="url" label="链接">
          <Input />
        </Form.Item>
        <Form.Item name="icon" label="图标">
          <Input />
        </Form.Item>
        <Form.Item name="style" label="样式">
          <Input />
        </Form.Item>
        <Form.Item name="group_id" label="群组">
          <Select>
            {Object.keys(group).map((val, key) => {
              return (
                <Select.Option key={key} value={group[val]["id"]}>
                  {group[val]["name"]}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="所属">
          <Cascader
            options={menus_children}
            fieldNames={{ label: "name", value: "id" }}
            changeOnSelect
            onChange={this.handle_parent_id}
          />
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
          <Link className="button" to={"/menus"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }

  __render_group() { 
    const columns = [
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name",

        align: "center",
      },
      {
        title: "状态",
        sorter: true,
        fixed: "left",
        dataIndex: "visibility",

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
          return moment(data.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
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
                title="#!"
                href="$!"
                onClick={() => {
                  this.handle_group_delete(d.id);
                }}
              >
                <i className="ti-trash" />{" "}
              </a>
              <Link
                to={"/menus/group_edit/" + d.id}
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
  __render_group_edit() {
    return this.__render_group_add_edit();
  }
  /**
   * 添加
   * @return obj
   */
  __render_group_add() {
    return this.__render_group_add_edit();
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_group_add_edit() {
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handle_group_submit}
        {...this.__form_item_layout()}
      >
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name="allow" label="链接">
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
          <Link className="button" to={"/menus/group"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Menus);
