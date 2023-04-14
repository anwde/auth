import React from "react";
import {
  Link
} from "react-router-dom";
import {
  connect
} from "react-redux";
import webapi from "@/utils/webapi";
import customizer from "@/utils/customizer";

import moment from "moment";
import {
  Form,
  Input,
  Radio,
  Space,
  Tabs,
  Table,
  Button,
  Upload,
  Menu,
  Dropdown,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined
} from "@ant-design/icons";
import "braft-editor/dist/index.css";
import BraftEditor from "braft-editor";
import Basic_Customer from "./basic.js";
import {
  UnorderedListOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
const BREADCRUMB = {
  title: "商户管理",
  lists: [{
    title: "主页",
    url: "/"
  }, {
    title: "商户管理",
    url: "/customer"
  },],
  buttons: [],
};
class Applications extends Basic_Customer {
  formRef = React.createRef();
  // constructor(props) {
  //   super(props);
  // }
  /*----------------------0 parent start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({
      ...BREADCRUMB,
      ...data
    });
  }
  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  __init_state_before() {
    const query = webapi.utils.query();
    return {
      ext: {},
      ext_item: {},
      drawer_visible: {},
      customer_id: query.customer_id,
      channels: {},
      pages_type: {},
      editorState: BraftEditor.createEditorState(null),
    };
  }
  /**
   * app 列表数据
   */
  async __init_index(d = {}) {
    let customer = await this.get_customer(this.state.customer_id);

    let buttons = [{
      title: "添加应用",
      url: "/customer/applications/add?customer_id=" +
        this.state.customer_id,
    },];
    let title = BREADCRUMB.title + "-应用-" + customer.name;
    this.init_lists("customer/applications/home/lists", d, {
      buttons,
      title,
    });
  }
  async __init_add_edit(action) {
    const b = {};
    let data = {};
    data.customer_id = this.state.customer_id;
    if (action === "edit" && this.state.id) {
      const res = await webapi.request.get(
        "customer/applications/get", {
        data: {
          id: this.state.id,
        },
      }
      );
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = `${BREADCRUMB.title}-应用-${data.name}-编辑`;
    } else {
      b.title = `${BREADCRUMB.title}-应用-添加`;
    }
    b.buttons = [];
    b.lists = BREADCRUMB.lists.concat();
    b.lists.push({
      title: "应用",
      url: "/customer/applications?customer_id=" + data.customer_id,
    });
    this.setState({
      customer_id: data.customer_id,
      u_action: "applications",
      data: data,
    });
    this.formRef.current && this.formRef.current.setFieldsValue({
      ...data
    });
    this.__breadcrumb(b);
  }

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
  handle_tabs_pay = (activeKey) => {
    // var data = this.state.data;
    // data.pay['o' + Math.random()] = { 'name': '自定义' };
    // this.setState({ data });
    this.setState({
      drawer_visible: {
        ext: true
      }
    });
  };
  handle_tabs_change = (activeKey) => {
    let applications_operations = "";
    if (activeKey === "3" || activeKey === "7") {
      applications_operations = (
        <Button onClick={() => this.handle_tabs_pay(activeKey)}>
          添加一项
        </Button>
      );
    }
    this.setState({
      applications_operations
    });
  };

  handle_ext_change_value = (item, parent_field, child_field, value) => {
    const extend = this.state.data.extend || {};
    extend[item].items[parent_field].items[child_field].value = value;
    this.setState({
      data: {
        ...this.state.data,
        extend
      }
    });
  };
  handle_input_change = (item, parent_field, child_field, event) => {
    this.handle_ext_change_value(
      item,
      parent_field,
      child_field,
      event.target.value
    );
    //replace(/(^\s*)|(\s*$)/g, "")
  };
  handle_ext_upload_change = (options, file, base64Data) => {
    // return console.log('data=>',options)
    this.handle_ext_change_value(
      options.item,
      options.parent_field,
      options.child_field,
      base64Data
    );
  };
  handle_submit = async (data = {}) => {
    let url = "customer/applications/dopost";
    let history =
      "/customer/applications?customer_id=" + this.state.customer_id;
    data.extend = this.state.data.extend;
    data.customer_id = this.state.customer_id;
    data.id = this.state.id;
    const res = await webapi.request.post(url, {
      data
    });
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace(history);
      customizer.apps(true);
    } else {
      webapi.message.error(res.message);
    }
  };
  /**
   * 删除
   **/

  handle_delete(id) {
    this.handle_do_delete("applications/delete", id);
  }
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  _render_dropdown_menus_action = (data) => {
    return (
      <Menu>
        <Menu.Item key="pages_1">
          <Link to={`/customer/applications/pages/${data.id}`}>
            <Button type="primary" shape="round">
              页面管理
            </Button>
          </Link>
        </Menu.Item>
        <Menu.Item key="pages_2">
          <Link to={`/customer/competence_user/index/${data.id}`}>
            <Button type="primary" shape="round">
              权限用户
            </Button>
          </Link>
        </Menu.Item>
        <Menu.Item key="pages_3">
          <Link to={`/customer/applications/spm/page/index?applications_id=${data.id}`}>
            <Button type="primary" shape="round">
              SPM-页面
            </Button>
          </Link>
        </Menu.Item>
        <Menu.Item key="pages_3">
          <Link to={`/customer/applications/spm/module/index?applications_id=${data.id}`}>
            <Button type="primary" shape="round">
              SPM-模块
            </Button>
          </Link>
        </Menu.Item>
        <Menu.Item key="pages_3">
          <Link to={`/customer/applications/spm/area/index?applications_id=${data.id}`}>
            <Button type="primary" shape="round">
              SPM-区域
            </Button>
          </Link>
        </Menu.Item>
      </Menu>
    );
  };
  __render_index() {
    const columns = [{
      title: "ID",
      sorter: true,
      fixed: "left",
      dataIndex: "id",
      align: "center",
    }, {
      title: "名称",
      sorter: true,
      fixed: "left",
      dataIndex: "name",
      align: "center",
    }, {
      title: "状态",
      sorter: true,
      fixed: "left",
      dataIndex: "state",
      align: "center",
      render: function (field, data) {
        return field === "1" ? "显示" : "隐藏";
      },
    }, {
      title: "时间",
      sorter: true,
      dataIndex: "create_time",
      render: function (field, data) {
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

            <Link to={`/customer/applications/edit/${row.id}`}>
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
    },];
    return (
      <div className="card">
        <Table
          rowKey={(res) => res.id}
          columns={columns}
          dataSource={this.state.lists}
          pagination={this.state.pagination}
          loading={this.props.server.loading}
          onChange={this.__handle_table_change}
        />
      </div>
    );
  }
  __render_tabs_pane(item, data = {}) {
    const fieldset_style = {
      position: "relative",
      display: "block",
      marginBottom: "20px",
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
      borderRadius: "8px",
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
    return Object.keys(data || {}).map((parent_field) => {
      const val = data[parent_field];
      const visibility = val.visibility || {};

      //  data[visibility.items.parent].items[visibility.value].value;
      if (Object.keys(visibility).length > 0 && visibility.items) {
        if (
          webapi.utils.in_array(
            data[visibility.items.parent].items[visibility.items.child].value,
            visibility.value
          )
        ) {
          return "";
        }
      }
      return val.field === "unknown" ? (
        this.__render_tabs_pane_items(item, val, data)
      ) : (
        <fieldset key={parent_field} style={fieldset_style}>
          <legend style={legend_style}>{val.name}</legend>
          {this.__render_tabs_pane_items(item, val, data)}
        </fieldset>
      );
    });
  }
  __render_tabs_pane_items(item, val, data) {
    const uploadButton = (
      <div>
        {this.props.server.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );
    const parent_field = val.field;
    // const button_style = {
    //   position: "absolute",
    //   top: "0px",
    //   right: "0px",
    //   padding: 0,
    //   border: 0,
    //   width: "auto",
    //   display: "block",
    //   marginBottom: "20px",
    //   fontSize: "21px",
    //   lineHeight: "inherit",
    //   color: "rgba(0, 0, 0, 0.45)",
    // };

    return Object.keys(val.items || {}).map((child_field) => {
      const vval = val.items[child_field];
      const visibility = vval.visibility || {};

      if (Object.keys(visibility).length > 0 && visibility.items) {
        // console.log("data=>", visibility);
        if (
          webapi.utils.in_array(
            data[visibility.items.parent].items[visibility.items.child].value,
            visibility.value
          )
        ) {
          return "";
        }
      }

      return (
        <Form.Item label={vval.name} key={child_field}>
          {vval.type === "radio" ? (
            <Radio.Group
              value={vval.value}
              onChange={(o) =>
                this.handle_input_change(item, parent_field, child_field, o)
              }
            >
              {Object.keys(vval.params || {}).map((evkey) => {
                const evval = vval.params[evkey] || {};
                return (
                  <Radio value={evval.value} key={evkey}>
                    {evval.name}
                  </Radio>
                );
              })}
            </Radio.Group>
          ) : (
            ""
          )}
          {vval.type === "input" ? (
            <Input
              value={vval.value}
              onChange={(o) =>
                this.handle_input_change(item, parent_field, child_field, o)
              }
            />
          ) : (
            ""
          )}
          {vval.type === "textarea" ? (
            <Input.TextArea
              rows={4}
              onChange={(o) =>
                this.handle_input_change(item, parent_field, child_field, o)
              }
            />
          ) : (
            ""
          )}

          {vval.type === "image" ? (
            <>
              <Upload
                {...this.__upload_single_props({
                  item: item,
                  parent_field: parent_field,
                  child_field: child_field,
                  success: this.handle_ext_upload_change,
                })}
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
              >
                {vval.value ? (
                  <img src={vval.value} style={{ width: "100%" }} alt="" />
                ) : (
                  uploadButton
                )}
              </Upload>
            </>
          ) : (
            ""
          )}
        </Form.Item>
      );
    });
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit() {
    const state = this.state;
    const data = state.data || {};
    const extend = data.extend || {};
    const pay = extend[1] ? extend[1].items : {};
    const sms = extend[2] ? extend[2].items : {};
    const authorize = extend[3] ? extend[3].items : {};
    const ext = extend[4] ? extend[4].items : {};
    const storage = extend[5] ? extend[5].items : {};
    const applications_operations = (
      <>
        {this.state.id > 0 ? (
          <Link
            to={`/customer/applications_extend/index/${this.state.id}`}
          >
            <Button>拓展项设置</Button>
          </Link>
        ) : (
          ""
        )}
      </>
    );
    return (
      <>
        <Form
          ref={this.formRef}
          onFinish={this.handle_submit}
          {...this.__form_item_layout()}
        >
          <Tabs
            defaultActiveKey="1"
            tabBarExtraContent={applications_operations}
            onChange={(activeKey) => this.handle_tabs_change(activeKey)}
          >
            <Tabs.TabPane tab="基本信息" key="1">
              <Form.Item name="name" label="名称">
                <Input />
              </Form.Item>
              {state.method == 'edit' ? ( 
                <Form.Item name="secret" label="密钥">
                  <Input disabled bordered={false} />
                </Form.Item>
              ) : ''}
              <Form.Item name="auth_key" label="加密密钥">
                <Input disabled bordered={false} />
              </Form.Item>


              <Form.Item name="uri" label="访问域名">
                <Input />
              </Form.Item>
              <Form.Item name="cdn_uri" label="加速域名">
                <Input />
              </Form.Item>
              <Form.Item name="module" label="模块">
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
              {this.__render_tabs_pane(1, pay)}
            </Tabs.TabPane>
            <Tabs.TabPane tab="授权信息" key="4">
              {this.__render_tabs_pane(3, authorize)}
            </Tabs.TabPane>

            <Tabs.TabPane tab="短信设置" key="6">
              {this.__render_tabs_pane(2, sms)}
            </Tabs.TabPane>
            <Tabs.TabPane tab="扩展设置" key="7">
              {this.__render_tabs_pane(4, ext)}
            </Tabs.TabPane>
            <Tabs.TabPane tab="文件存储" key="8">
              {this.__render_tabs_pane(5, storage)}
            </Tabs.TabPane>
          </Tabs>

          <Form.Item {...this.__tail_layout()}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "8px" }}
              loading={this.props.server.loading}
            >
              {this.props.server.loading ? "正在提交" : "立即提交"}
            </Button>
            <Link
              className="button"
              to={
                "/customer/applications?customer_id=" +
                this.state.customer_id
              }
            >
              返回
            </Link>
          </Form.Item>
        </Form>
      </>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({
  ...store
}))(Applications);