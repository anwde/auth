import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import moment from "moment";
import "kindeditor";
import "kindeditor/themes/default/default.css";
// import "braft-editor/dist/index.css";
// import BraftEditor from "braft-editor";
// import { ContentUtils } from "braft-utils";
import { Form, Input,  Table, Button, Tabs, Upload, } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const BREADCRUMB = {
  title: "",
  lists: [],
  buttons: [],
};

class Content extends Basic_Component {
  modules = {};
  formRef = React.createRef();
   
  /*----------------------0 parent start----------------------*/
  __init_state_after() {
    var query = webapi.utils.query();
    return {
      // editorState: BraftEditor.createEditorState(null),
      column_id: query.column_id ? query.column_id : 0,
      columns: {},
      modules: {
        columns: {},
        model: {},
        model_field: []
      },
      data: {
        base: [],
        expand: []
      },
    };
  }
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
  /**
   * other 获取服务器状态
   */
  async get_model_field(reset = false) {
    var column_id = this.state.column_id;
    var modules = this.modules ?
      this.modules[column_id] ?
        this.modules[column_id] : {} : {};
    if (reset || Object.keys(modules).length === 0) {
      var res = await webapi.request.get("content/model_field", {
        column_id,
      });
      if (res.code === 10000) {
        modules = res.data;
      }
    } else {
    }
    this.modules[column_id] = modules;
    return modules;
  }
  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  __init_list(d = {}) {
    this.get_model_field().then((modules) => {
      this.setState({
        modules
      });

      this.__breadcrumb({
        title: modules.columns.name,
        buttons: [{
          title: "添加",
          url: "/content/add?column_id=" + modules.columns.id,
        },],
      });
    });
    d.column_id = this.state.column_id;
    this.init_lists("content/lists", d);
  }
  /**
   * 添加-编辑始化
   */
  async __init_add_edit(u_action) {
    var modules = await this.get_model_field();
    var res = await webapi.request.get("content/get", {
      column_id: this.state.column_id,
      id: this.state.id,
    });
    var data = {};
    this.__breadcrumb({
      title: modules.columns.name,
      buttons: [],
      lists: [{
        title: modules.columns.name,
        url: "/content/list?column_id=" + modules.columns.id,
      },],
    });
    if (res.code === 10000) {
      data = res.data;
    } else {
      data = {
        base: [],
        expand: []
      };
    }
    // console.log('data=>',res);
    this.setState({
      u_action: "lists",
      modules,
      data
    }, () => {
      Object.keys(data.base).map((val) => { 
        if (data.base[val].formtype === "editor") {
           window.KindEditor &&
          window.KindEditor.create("#" + data.base[val].field, {
            extraFileUploadParams: {
              format: "json",
              "data[path]": "uploads/content",
              "data[create_time]": data.create_time ?
                data.create_time : 0,
            },
            uploadJson: "/uploadfile/upload",
            loadStyleMode: false,
            resizeType: 1,
            urlType: "absolute",
            width: "100%",
            height: "450px",
            afterBlur: function(e) {
              this.handle_input(
                "base",
                data.base[val],
                this.html()
              );
              // console.log('data=>',);
              // this.handle_input(type, d[val], e.target.value);
              this.sync();
            },
          });
        }
        return [];
      });
    });
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
      pagination: {
        ...this.state.pagination,
        total: data.num_rows
      },
    });
  }

  __init_index() {}
  async __init_page() {
    var res = await webapi.request.get("content/get", {
      column_id: this.state.id,
    });
    var data = {};
    if (res.code === 10000) {
      data = res.data;
    } else {
      data = {
        columns: {}
      };
    }
    this.setState({
      u_action: "page",
      data,
    });
    this.__breadcrumb({
      title: data.columns.name,
      buttons: [],
      lists: [{
        title: data.columns.name,
        url: "/content/page/" + data.columns.id + "?column_id=" + data.columns.id,
      },],
    });
    this.formRef.current &&
    this.formRef.current.setFieldsValue({
      ...data
    });
    var that = this;
    window.KindEditor &&
    window.KindEditor.create("#content", {
      extraFileUploadParams: {
        format: "json",
        "data[path]": "uploads/content",
        "data[create_time]": data.create_time ?
          data.create_time : 0,
      },
      uploadJson: "/uploadfile/upload",
      loadStyleMode: false,
      resizeType: 1,
      urlType: "absolute",
      width: "100%",
      height: "450px",
      afterBlur: function() {
        this.sync();
        that.setState({
          data: {
            ...that.state.data,
            content: this.html()
          },
        });
      },
    });
  // console.log("data=>", window.KindEditor && window.KindEditor.options);
  }
  __init_link() {}
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
  handle_agreement_change = (editorState) => {
    this.setState({
      editorState
    });
  };
  /**
   * finish 提交
   */
  handle_submit = async (values) => { 
    let history = "/";
    const data = {
      ...this.state.data,
      ...values
    };
    // return console.log('data=>',data);
    // data.content=this.state.editorState.toHTML();
    if (this.state.u_action === "lists") {
      history = "/content/list?column_id=" + this.state.column_id;
      data.column_id = this.state.column_id;
      data.id = this.state.id;
    }
    if (this.state.u_action === "page") {
      history = null;
      data.column_id = this.state.id;
    }
    const res = await webapi.request.post("content/dopost", data);
    if (res.code === 10000) {
      webapi.message.success(res.message);
      history && this.props.history.push(history);
    } else {
      webapi.message.error(res.message);
    }
  };
  /**
   * 删除
   **/

  handle_delete(id) {
    webapi.confirm({
      url: "content/delete",
      data: {
        id,
        column_id: this.state.column_id
      },
      success: (data) => {
        if (data.status === "success") {
          webapi.message.success(data.message);
          this.__method("init_");
        } else {
          webapi.message.error(data.message);
        }
      },
    });
  }
  handle_upload_callback = (type, d, base64data) => {
    var data = this.state.data;
    data[type][d.id].struct.value = base64data;
    this.setState({
      data
    });
  };
  handle_input = (type, d, value) => {
    var data = this.state.data;
    data[type][d.id].struct.value = value;
    this.setState({
      data
    });
  };

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  __render_index() {
    return "dsafdafas";
  }
  __render_list() {
    const columns = [];
    var model_field = this.state.modules.model_field ?
      this.state.modules.model_field :
      [];
    model_field.map((v) => {
      return columns.push({
        title: v.name,
        sorter: true,
        dataIndex: v.field,
        align: "left",
      });
    });

    columns.push({
      title: "时间",
      sorter: true,
      fixed: "right",
      dataIndex: "create_time",
      align: "center",
      render: (field, data) => {
        return moment(data.create_time * 1000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    });
    columns.push({
      title: "操作",
      fixed: "right",
      dataIndex: "id",
      align: "center",
      render: (field, data) => {
        return (
          <div>
						<a
          className="btn btn-outline-info btn-circle btn-lg btn-circle"
          title="删除"
          href="#!"
          onClick={() => {
            this.handle_delete(data.id);
          }}
          >
							<i className="ti-trash" />
						</a>
						<Link
          to={
          "/content/edit/" +
          data.id +
          "?column_id=" +
          data.column_id
          }
          className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
          >
							<i className="ti-pencil-alt" />
						</Link>
					</div>
        );
      },
    });
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

  __render_page() {
    return (
      <Form
      layout="horizontal"
      ref={this.formRef}
      onFinish={this.handle_submit}
      {...this.__form_item_layout()}
      >
				<Form.Item name="name" label="名称">
					<Input />
				</Form.Item>
				<Form.Item label="图片" name="image">
					{this.state.data.image ? (
        <p>
							<img
              alt=""
        src={this.state.data.image}
        style={{
          width: "100px"
        }}
        />
						</p>
        ) : (
        ""
        )}

					<Upload {...this.__upload_single_props()}>
						<Button icon={<UploadOutlined />}>上传图片</Button>
					</Upload>
				</Form.Item>
				<Form.Item name="keywords" label="关键词">
					<Input.TextArea rows={4} />
				</Form.Item>
				<Form.Item name="description" label="描述">
					<Input.TextArea rows={4} />
				</Form.Item>
				<Form.Item name="summary" label="简介">
					<Input.TextArea rows={4} />
				</Form.Item>
				<Form.Item label="内容">
					<Input.TextArea rows={20} id="content" value={this.state.data.content} />
				</Form.Item>
				<Form.Item {...this.__tail_layout()}>
					<Button
      type="primary"
      htmlType="submit"
      loading={this.props.loading}
      >
						{this.props.loading ? "正在提交" : "立即提交"}
					</Button>
				</Form.Item>
			</Form>
    );
  }
  __render_link() {
    return "dsafdafas";
  }
  __render_c(type = "base", d = []) {
    var c = Object.keys(d).map((val, key) => {
      if (d[val].formtype === "textarea") {
        return (
          <Form.Item
          label={d[val].name}
          initialValue={d[val].struct.value}
          >
						<Input.TextArea
          rows={4}
          value={d[val].struct.value}
          onChange={(e) => {
            this.handle_input(type, d[val], e.target.value);
          }}
          />
					</Form.Item>
        );
      }
      if (d[val].formtype === "editor") {
        return (
          <Form.Item label={d[val].name}>
						<Input.TextArea
          rows={4}
          id={d[val].field}
          value={d[val].struct.value}
          />
					</Form.Item>
        );
      }
      if (d[val].formtype === "image") {
        return (
          <Form.Item label={d[val].name}>
						{d[val].struct.value ? (
            <p>
								<img
                alt=""
            src={d[val].struct.value}
            style={{
              width: "100px"
            }}
            />
							</p>
            ) : (
            ""
            )}

						<Upload
          {...this.__upload_single_props({
            success: (options, file, base64data) => {
              this.handle_upload_callback(
                type,
                d[val],
                base64data
              );
            },
          })}
          >
							<Button icon={<UploadOutlined />}>上传图片</Button>
						</Upload>
					</Form.Item>
        );
      }

      return (
        <Form.Item label={d[val].name}>
					<Input
        onChange={(e) => {
          this.handle_input(type, d[val], e.target.value);
        }}
        value={d[val].struct.value}
        />
				</Form.Item>
      );
    });
    return c;
  }
  __render_add_edit() {
    // console.log("data=>", this.state.data);
    return (
      <Form
      layout="horizontal"
      ref={this.formRef}
      onFinish={this.handle_submit}
      {...this.__form_item_layout()}
      >
				<Tabs defaultActiveKey="1">
					<Tabs.TabPane tab="基本选项" key="1">
						{this.__render_c("base", this.state.data.base || [])}
					</Tabs.TabPane>
					<Tabs.TabPane tab="高级设置" key="3">
						{this.__render_c(
        "expand",
        this.state.data.expand || []
      )}
					</Tabs.TabPane>
				</Tabs>

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
					<Link
      className="button"
      to={"/content/list/?column_id=" + this.state.column_id}
      >
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
}))(Content);