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
  Tabs,
  Table,
  Button,
  Cascader,
  Upload,
  Drawer,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "braft-editor/dist/index.css";
import BraftEditor from "braft-editor";
import { exit } from "process";

// import awesome from "@/assets/scss/all/icons/font-awesome/css/font-awesome.css";
// console.log(awesome)
const BREADCRUMB = {
  title: "商户管理",
  lists: [
    { title: "主页", url: "/" },
    { title: "商户管理", url: "/authorize/customer" },
  ],
  buttons: [{ title: "添加商户", url: "/authorize/customer/add" }],
};
class Customer extends Basic_Component {
  formRef = React.createRef();
  customer = {};
  app = {};
  channels = {};
  pages_type = {};
  server_state = { channels: {}, pages_type: {} };
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  __init_state_before() {
    const query = webapi.utils.query();
    return {
      drawer_visible: {},
      customer_id: query.customer_id,
      applications_id: query.applications_id,
      channels: {},
      pages_type: {},
      editorState: BraftEditor.createEditorState(null),
    };
  }
  __handle_init_before = () => {
    this.get_server_state();
  };
  /*----------------------1 other start----------------------*/
  async get_server_state(reset = false) {
    let server_state = this.server_state && {
      channels: {},
      pages_type: {},
    };
    if (reset || Object.keys(server_state.channels).length === 0) {
      let res = await webapi.request.get("authorize/customer/server_state");
      if (res.code === 10000) {
        server_state = res.data;
      }
    }
    this.server_state = server_state;
    return server_state;
  }
  async get_app(id, reset = false) {
    let app = this.app ? (this.app[id] ? this.app[id] : {}) : {};
    if (reset || Object.keys(app).length === 0) {
      let res = await webapi.request.get(
        "authorize/customer/applications_get",
        {
          id,
        }
      );
      if (res.code === 10000) {
        app = res.data;
      }
    }
    this.app[id] = app;
    return app;
  }
  async get_customer(id, reset = false) {
    let customer = this.customer
      ? this.customer[id]
        ? this.customer[id]
        : {}
      : {};
    if (reset || Object.keys(customer).length === 0) {
      let res = await webapi.request.get("authorize/customer/get", {
        id,
      });
      if (res.code === 10000) {
        customer = res.data;
      }
    }
    this.customer[id] = customer;
    return customer;
  }

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/
  /**
   * index  列表数据
   */
  __init_index(d = {}) {
    this.init_lists("authorize/customer/lists", d);
  }
  /**
   * app 列表数据
   */
  async __init_applications(d = {}) {
    let customer = await this.get_customer(this.state.customer_id);

    let buttons = [
      {
        title: "添加应用",
        url:
          "/authorize/customer/applications_add?customer_id=" +
          this.state.customer_id,
      },
    ];
    let title = BREADCRUMB.title + "-应用-" + customer.name;
    this.init_lists("authorize/customer/applications", d, {
      buttons,
      title,
    });
  }
  /**
   *  列表数据
   */
  async init_lists(url, o = {}, b = {}) {
    const d = { ...webapi.utils.query(), ...o };
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    d.q = this.state.q;
    const data = await webapi.request.get(url, d);
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
    let data = {};
    if (action === "edit" && this.state.id) {
      const res = await webapi.request.get("authorize/customer/get", {
        id: this.state.id,
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = BREADCRUMB.title + "-" + data.name + "-编辑";
    } else {
      b.title = BREADCRUMB.title + "-" + "添加";
    }
    this.setState({ u_action: "customer", data: data });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }

  async __init_applications_pages(o = {}) {
    this.get_server_state().then((server_state) => {
      this.setState({ ...server_state });
    });

    const app = await this.get_app(this.state.id);

    const d = { ...webapi.utils.query(), ...o };
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    d.q = this.state.q;
    d.applications_id = this.state.id;
    const data = await webapi.request.post(
      "authorize/customer/applications_pages",
      d
    );
    if (data.code === 10000) {
      this.setState({
        lists: data.lists,
        pagination: { ...this.state.pagination, total: data.num_rows },
      });
    }
    const b = {
      title: BREADCRUMB.title + "-内容-" + app.name,
      buttons: [
        {
          title: "添加",
          url:
            "/authorize/customer/applications_pages_add?applications_id=" +
            this.state.id,
        },
      ],
    };
    b.lists = BREADCRUMB.lists.concat();
    b.lists.push({
      title: "应用",
      url: "/authorize/customer/applications?customer_id=" + app.customer_id,
    });
    this.__breadcrumb(b);
  }
  __init_applications_pages_add() {
    this.__init_applications_pages_add_edit("add");
  }
  __init_applications_pages_edit() {
    this.__init_applications_pages_add_edit("edit");
  }
  async __init_applications_pages_add_edit(action) {
    this.get_server_state().then((server_state) => {
      this.setState({ ...server_state });
    });
    let app = {};
    if (this.state.applications_id) {
      app = await this.get_app(this.state.applications_id);
    }
    const b = {};
    const data = {};
    data.applications_id = this.state.applications_id;
    if (action === "edit" && this.state.id) {
      const res = await webapi.request.get(
        "authorize/customer/applications_pages_get",
        {
          id: this.state.id,
        }
      );
      if (res.code === 10000) {
        data = res.data;
        app = await this.get_app(data.applications_id);
      }
    }
    b.title = BREADCRUMB.title + "-内容-" + app.name;
    b.buttons = [];
    b.lists = BREADCRUMB.lists.concat();
    // b.lists.push(BREADCRUMB.lists);
    b.lists.push({
      title: "应用",
      url: "/authorize/customer/applications?customer_id=" + data.customer_id,
    });
    b.lists.push({
      title: "内容",
      url: "/authorize/customer/applications_pages/" + data.applications_id,
    });
    this.setState({
      applications_id: data.applications_id,
      u_action: "pages",
      editorState: BraftEditor.createEditorState(data.content),
      data: data,
    });
    // console.log("data=>", BREADCRUMB, b);
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }
  __init_applications_add() {
    this.__init_applications_add_edit("add");
  }
  __init_applications_edit() {
    this.__init_applications_add_edit("edit");
  }
  async __init_applications_add_edit(action) {
    const b = {};
    const data = {};
    data.customer_id = this.state.customer_id;
    if (action === "edit" && this.state.id) {
      const res = await webapi.request.get(
        "authorize/customer/applications_get",
        {
          id: this.state.id,
        }
      );
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = BREADCRUMB.title + "-应用-" + data.name + "-编辑";
    } else {
      b.title = BREADCRUMB.title + "-应用-" + "添加";
    }
    b.buttons = [];
    b.lists = BREADCRUMB.lists.concat();
    b.lists.push({
      title: "应用",
      url: "/authorize/customer/applications?customer_id=" + data.customer_id,
    });
    this.setState({
      customer_id: data.customer_id,
      u_action: "applications",
      data: data,
    });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }
  /**
   * 列表数据
   */
  async __init_applications_channel(d = {}) {
    const b = {};
    b.title = BREADCRUMB.title + "-渠道";
    b.buttons = [
      {
        title: "添加渠道",
        url: "/authorize/customer/applications_channel_add",
      },
    ];
    this.init_lists("authorize/customer/applications_channel", d, b);
  }
  __init_applications_channel_edit() {
    this.__init_applications_channel_add_edit("edit");
  }
  __init_applications_channel_add() {
    this.__init_applications_channel_add_edit("add");
  }
  async __init_applications_channel_add_edit(action) {
    const b = {};
    const data = {};
    if (action === "edit" && this.state.id) {
      const res = await webapi.request.get(
        "authorize/customer/applications_channel_get",
        {
          id: this.state.id,
        }
      );
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = BREADCRUMB.title + "-渠道-" + data.name + "-编辑";
    } else {
      b.title = BREADCRUMB.title + "-渠道-" + "添加";
    }
    b.buttons = [];
    this.setState({
      u_action: "applications_channel",
      data: data,
    });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }

  /*----------------------3 handle start----------------------*/
  handle_pages_change = (editorState) => {
    this.setState({ editorState });
  };

  handle_parent_id = (value) => {
    const parent_id = value[value.length - 1];
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
    let url = "authorize/customer/dopost";
    let history = "/authorize/customer";
    if (this.state.u_action == "pages") {
      url = "authorize/customer/applications_pages_dopost";
      history =
        "/authorize/customer/applications_pages/" + this.state.applications_id;
      data.applications_id = this.state.applications_id;
      data.content = this.state.editorState.toHTML();
    }
    if (this.state.u_action == "applications") {
      url = "authorize/customer/applications_dopost";
      history =
        "/authorize/customer/applications?customer_id=" +
        this.state.customer_id;
      data.customer_id = this.state.customer_id;
    }
    if (this.state.u_action == "applications_channel") {
      url = "authorize/customer/applications_channel_dopost";
      history = "/authorize/customer/applications_channel";
    }
    data.id = this.state.id;
    const res = await webapi.request.post(url, data);
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace(history);
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 集中 删除
   **/
  handle_do_delete(url, id) {
    webapi.confirm("authorize/customer/" + url, { id: id }, (data) => {
      if (data.status === "success") {
        webapi.message.success(data.message);
        this.__method("init");
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
  /**
   * 应用删除
   **/
  handle_applications_delete(id) {
    this.handle_do_delete("applications_delete", id);
  }
  /**
   * 内容删除
   **/
  handle_pages_delete(id) {
    this.handle_do_delete("applications_pages_delete", id);
  }
  /**
   * 渠道删除
   **/
  handle_applications_channel_delete(id) {
    this.handle_do_delete("applications_channel", id);
  }

  /**
   * 应用提交
   **/
  handle_applications_submit = async (data = {}) => {
    data.id = this.state.id;
    const res = await webapi.request.post(
      "authorize/customer/applications_dopost",
      data
    );
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/authorize/customer/app");
    } else {
      webapi.message.error(res.message);
    }
  };
  handle_applications_ext_add = () => {
    this.setState({ drawer_visible: { ext_item: true } });
  };
  handle_tabs_applications_pay = (activeKey) => {
    // var data = this.state.data;
    // data.pay['o' + Math.random()] = { 'name': '自定义' };
    // this.setState({ data }); 
    this.setState({ drawer_visible: { ext: true } }); 
  };
  handle_tabs_applications_change = (activeKey) => {
    let applications_operations = "";
    if (activeKey == 3 || activeKey == 7) {
      applications_operations = (
        <Button onClick={() => this.handle_tabs_applications_pay(activeKey)}>
          添加一项
        </Button>
      );
    }
    this.setState({ applications_operations });
  };
  handle_drawer_close = (val) => {
    this.formRef.current.resetFields();
    this.setState({ drawer_visible: { [val]: false } }); 
     
  };
  handle_drawer_submit = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        let ext = this.state.data.ext || {};
        if (ext[values.value]) {
          ext[values.name]["name"] = values.name;
          ext[values.name]["val"] = values.value;
        } else {
          ext[values.name] = { ...values };
        }
        this.handle_drawer_close();
        this.setState({
          data: { ...this.state.data, ext: ext },
        });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
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
                onClick={() => {
                  this.handle_delete(d.id);
                }}
              >
                <i className="ti-trash" />{" "}
              </a>
              <Link
                to={"/authorize/customer/applications?customer_id=" + d.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="ti-menu-alt" />
              </Link>

              <Link
                to={"/authorize/customer/edit/" + d.id}
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
          <Link className="button" to={"/authorize/customer"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }

  __render_applications() {
    const columns = [
      {
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
      },
      {
        title: "状态",
        sorter: true,
        fixed: "left",
        dataIndex: "state",
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
                title="删除"
                onClick={() => {
                  this.handle_applications_delete(d.id);
                }}
              >
                <i className="ti-trash" />{" "}
              </a>
              <Link
                to={"/authorize/customer/applications_edit/" + d.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="ti-pencil-alt" />
              </Link>
              <Link
                to={"/authorize/customer/applications_pages/" + d.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                title="pages"
              >
                <i className="ti-shield" />
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
  __render_applications_edit() {
    return this.__render_applications_add_edit();
  }
  /**
   * 添加
   * @return obj
   */
  __render_applications_add() {
    return this.__render_applications_add_edit();
  }

  /**
   * 添加、编辑
   * @return obj
   */
  __render_applications_add_edit() {
    const fieldset_style = {
      position: "relative",
      display: "block",
      marginInlineStart: "2px",
      marginInlineEnd: "2px",
      paddingBlockStart: "0.35em",
      paddingInlineStart: "0.75em",
      paddingInlineEnd: "0.75em",
      paddingBlockEnd: "0.625em",
      minInlineSize: "min-content",
      borderWidth: "2px",
      borderStyle: "groove",
      borderColor: "threedface",
      borderImage: "initial",
      border: "1px solid silver",
      padding: ".35em .625em .75em",
    };
    const legend_style = {
      padding: 0,
      border: 0,
      width: "auto",
      display: "block",
      marginBottom: "20px",
      fontSize: "21px",
      lineHeight: "inherit",
      color: "rgba(0, 0, 0, 0.45)",
    };
    const button_style = {
      position: "absolute",
      top: "0px",
      right: "0px",
      padding: 0,
      border: 0,
      width: "auto",
      display: "block",
      marginBottom: "20px",
      fontSize: "21px",
      lineHeight: "inherit",
      color: "rgba(0, 0, 0, 0.45)",
    };
    const pay = this.state.data.pay || {};
    const ext = this.state.data.ext || {};

    return (
      <>
        <Form
          ref={this.formRef}
          onFinish={this.handle_submit}
          {...this.__form_item_layout()}
        >
          <Tabs
            defaultActiveKey="1"
            tabBarExtraContent={this.state.applications_operations}
            onChange={(activeKey) =>
              this.handle_tabs_applications_change(activeKey)
            }
          >
            <Tabs.TabPane tab="基本信息" key="1">
              <Form.Item name="name" label="名称">
                <Input />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab="版本信息" key="2">
              <Form.Item name="versions" label="当前版本">
                <Input />
              </Form.Item>
              <Form.Item name="after_version" label="下一版本">
                <Input />
              </Form.Item>
              <Form.Item name="version_url" label="下载地址">
                <Input />
              </Form.Item>
              <Form.Item name="versions_content" label="内容">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab="支付信息" key="3">
              {Object.keys(pay).map((val, key) => {
                return (
                  <fieldset key={key} style={fieldset_style}>
                    <legend style={legend_style}>
                      {pay[val].name}[{val}]
                    </legend>
                  </fieldset>
                );
              })}
              <fieldset style={fieldset_style}>
                <legend style={legend_style}>支付宝</legend>

                <Form.Item name="pay[alipay][app_id]" label="app id">
                  <Input />
                </Form.Item>
                <Form.Item name="pay[alipay][seller_id]" label="支付宝账号">
                  <Input />
                </Form.Item>
                <Form.Item name="pay[alipay][partner]" label="合作身份者ID">
                  <Input />
                </Form.Item>
                <Form.Item name="pay[alipay][public_key]" label="公钥">
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item name="pay[alipay][private_key]" label="私钥">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </fieldset>
              <fieldset>
                <legend>微信支付(原生)</legend>
                <Form.Item name="pay[alipay][app_id]" label="商户id">
                  <Input />
                </Form.Item>
                <Form.Item name="pay[alipay][seller_id]" label="支付密钥">
                  <Input />
                </Form.Item>
                <Form.Item name="pay[alipay][partner]" label="aes Key">
                  <Input />
                </Form.Item>
                <Form.Item name="pay[alipay][partner]" label="证书序列号">
                  <Input />
                </Form.Item>
              </fieldset>
              <fieldset>
                <legend>微信支付(网页)</legend>
                <Form.Item name="pay[alipay][app_id]" label="商户id">
                  <Input />
                </Form.Item>
                <Form.Item name="pay[alipay][seller_id]" label="支付密钥">
                  <Input />
                </Form.Item>
                <Form.Item name="pay[alipay][partner]" label="aes Key">
                  <Input />
                </Form.Item>
                <Form.Item name="pay[alipay][partner]" label="证书序列号">
                  <Input />
                </Form.Item>
              </fieldset>
            </Tabs.TabPane>
            <Tabs.TabPane tab="授权信息" key="4">
              <Form.Item name="name" label="名称">
                <Input />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab="消息通知" key="5">
              <Form.Item name="name" label="名称">
                <Input />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab="短信设置" key="6">
              <Form.Item name="name" label="名称">
                <Input />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab="扩展设置" key="7">
              {Object.keys(ext).map((val, key) => {
                return (
                  <fieldset key={key} style={fieldset_style}>
                    <legend style={legend_style}>
                      {ext[val].name}[
                      <a
                        onClick={() => {
                          this.handle_applications_ext_add();
                        }}
                      >
                        添加
                      </a>
                      ]
                    </legend>
                  </fieldset>
                );
              })}

              <Form.Item label="favicon">
                {this.state.data.favicon ? (
                  <p>
                    <img
                      src={this.state.data.favicon}
                      style={{ width: "100px" }}
                    />
                  </p>
                ) : (
                  ""
                )}

                <Upload
                  {...this.__upload_single_props({
                    file_field: "favicon",
                    image_field: "favicon",
                  })}
                >
                  <Button icon={<UploadOutlined />}>更改图片</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="logo">
                {this.state.data.logo ? (
                  <p>
                    <img
                      src={this.state.data.logo}
                      style={{ width: "100px" }}
                    />
                  </p>
                ) : (
                  ""
                )}

                <Upload
                  {...this.__upload_single_props({
                    file_field: "logo",
                    image_field: "logo",
                  })}
                >
                  <Button icon={<UploadOutlined />}>更改图片</Button>
                </Upload>
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>

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
              to={
                "/authorize/customer/applications?customer_id=" +
                this.state.customer_id
              }
            >
              返回
            </Link>
          </Form.Item>
        </Form>

        <Drawer
          title="项目"
          width={500}
          forceRender={true}
          onClose={() => {
            this.handle_drawer_close("ext_item");
          }}
          visible={this.state.drawer_visible['ext_item']}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => {
                  this.handle_drawer_close("ext_item");
                }}
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
          <Form layout="horizontal">
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入名称" />
            </Form.Item>
            <Form.Item name="value" label="数据">
              <Input placeholder="请输入数据" />
            </Form.Item>
          </Form>
        </Drawer>
        <Drawer
          title="项目"
          width={500}
          forceRender={true}
          onClose={() => {
            this.handle_drawer_close("ext");
          }}
          visible={this.state.drawer_visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => {
                  this.handle_drawer_close("ext_item");
                }}
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
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入名称" />
            </Form.Item>
            <Form.Item name="value" label="数据">
              <Input placeholder="请输入数据" />
            </Form.Item>
          </Form>
        </Drawer>
      </>
    );
  }
  __render_applications_pages() {
    const columns = [
      {
        title: "标题",
        dataIndex: "title",
      },

      {
        title: "类型",
        sorter: true,
        fixed: "left",
        dataIndex: "type",
        render: (text, res) => {
          return text == 0
            ? "--"
            : this.state.pages_type[res.type] &&
                this.state.pages_type[res.type]["name"];
        },
      },
      {
        title: "渠道",
        dataIndex: "channel",
        sorter: true,
        fixed: "left",
        render: (text, res) => {
          return text == 0
            ? "--"
            : this.state.channels[res.channel] &&
                this.state.channels[res.channel]["name"];
        },
      },
      {
        title: "操作",
        dataIndex: "id",
        render: (text, res) => {
          return (
            <>
              <a
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                onClick={() => {
                  this.handle_pages_delete(res.id);
                }}
              >
                <i className="ti-trash" />
              </a>
              <Link
                to={"/authorize/customer/applications_pages_edit/" + res.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="ti-pencil-alt" />
              </Link>
            </>
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
        loading={this.props.loading}
        onChange={this.__handle_table_change}
      />
    );
  }
  __render_applications_pages_add() {
    return this.__render_applications_pages_add_edit("add");
  }
  __render_applications_pages_edit() {
    return this.__render_applications_pages_add_edit("edit");
  }
  __render_applications_pages_add_edit() {
    return (
      <Form
        layout="horizontal"
        ref={this.formRef}
        onFinish={this.handle_submit}
        {...this.__form_item_layout()}
      >
        <Form.Item name="title" label="标题">
          <Input type="text" />
        </Form.Item>
        <Form.Item name="channel" label="渠道">
          <Select>
            {Object.keys(this.state.channels).map((val, key) => {
              return (
                <Select.Option key={key} value={val}>
                  {this.state.channels[val]["name"]}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="type" label="类型">
          <Select>
            {Object.keys(this.state.pages_type).map((val, key) => {
              return (
                <Select.Option key={key} value={val}>
                  {this.state.pages_type[val]["name"]}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item label="内容" value={this.state.editorState}>
          <BraftEditor
            value={this.state.editorState}
            onChange={this.handle_pages_change}
            style={{
              border: "1px solid #d1d1d1",
              backgroundColor: "#fff",
            }}
          />
        </Form.Item>

        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.state.loading}
          >
            提交
          </Button>
          <Link
            className="button"
            to={
              "/authorize/customer/applications_pages/" +
              this.state.data.applications_id
            }
          >
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  __render_applications_channel() {
    const columns = [
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name",

        align: "center",
      },
      {
        title: "渠道",
        sorter: true,
        fixed: "left",
        dataIndex: "channel",

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

        align: "center",
        render: (d, i) => {
          return (
            <div>
              <a
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                onClick={() => {
                  this.handle_applications_channel_delete(d.id);
                }}
              >
                <i className="ti-trash" />{" "}
              </a>
              <Link
                to={"/authorize/customer/applications_channel_edit/" + d.id}
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
        loading={this.props.loading}
        onChange={this.__handle_table_change}
      />
    );
  }
  /**
   * 编辑
   * @return obj
   */
  __render_applications_channel_edit() {
    return this.__render_applications_channel_add_edit();
  }
  /**
   * 添加
   * @return obj
   */
  __render_applications_channel_add() {
    return this.__render_applications_channel_add_edit();
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_applications_channel_add_edit() {
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handle_submit}
        {...this.__form_item_layout()}
      >
        <Form.Item name="name" label="名字">
          <Input />
        </Form.Item>
        <Form.Item name="channel" label="渠道">
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
          <Link
            className="button"
            to={"/authorize/customer/applications_channel"}
          >
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Customer);
