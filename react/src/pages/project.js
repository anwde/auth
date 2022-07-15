import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import moment from "moment";
import { Form, Input, Radio, Select, Table, Button, Cascader } from "antd";


const BREADCRUMB_LISTS=[
  { title: "主页", url: "/" },
  { title: "项目管理", url: "/authorize/project" },
];
const BREADCRUMB = {
  title: "项目管理",
  lists: BREADCRUMB_LISTS,
  buttons: [
    { title: "添加项目", url: "/authorize/project/add" }
  ],
};
class Project extends Basic_Component {
  formRef = React.createRef(); 
  projects = {};
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }

  /*----------------------1 other start----------------------*/
  /**
     * 获取
     * @return obj
     */
   async get_projects(project_id,reset = false) {
    var project = this.projects?(this.projects[project_id]?this.projects[project_id]:{}):{}; 
		if (reset || Object.keys(project).length === 0) {
			var res = await webapi.request.get("authorize/project/get", {
				id: project_id,
			});
			if (res.code === 10000) {
				project = res.data;
			}
		} 
		this.projects[project_id] = project; 
		return this.projects[project_id]; 
}
    

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/
  /**
   * index  列表数据
   */
  __init_index(d = {}) {
    this.init_lists("authorize/project/lists", d);
  }
  
  /**
   * items 列表数据
   */
  async __init_items(d = {}) {
    var query=webapi.utils.query();
    d.project_id=query.project_id; 
    var buttons = [
      { title: "添加", url: "/authorize/project/items_add?project_id="+d.project_id },
    ];
    
    var title = BREADCRUMB.title + "-群组";
    
    this.init_lists("authorize/project/items", d, { buttons, title });
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
      var res = await webapi.request.get("authorize/project/get", {
        id: this.state.id,
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = BREADCRUMB.title + "-编辑";
    } else {
      b.title = BREADCRUMB.title + "-添加";
    }
    this.setState({ data: data });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }
  __init_items_add() {
    this.__init_items_add_edit("add");
  }
  __init_items_edit() {
    this.__init_items_add_edit("edit");
  }
  async __init_items_add_edit(action) {
    var query=webapi.utils.query();
    var project_id=query.project_id;  
    var project=await this.get_projects(project_id);
    var lists=[...BREADCRUMB_LISTS];
    lists.push({  title: project.name, url: "/authorize/project/items?project_id="+project_id });
    var b = {buttons:[],lists};
    var data = {};
    if (action === "edit" && this.state.id) {
      var res = await webapi.request.get("authorize/project/items_get", {
        id: this.state.id,
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = BREADCRUMB.title + "-群组-编辑";
    } else {
      b.title = BREADCRUMB.title + "-群组-添加";
    }
    data.project_id=project_id;
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
    var res = await webapi.request.post("authorize/project/dopost", data);
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/authorize/project");
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 集中 删除
   **/
  handle_do_delete(url, id) {
    var that = this;
    webapi.delete("authorize/project/" + url, { id: id }, function (data) {
      if (data.status === "success") {
        webapi.message.success(data.message);
        that.__method("init_");
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
    data.project_id = this.state.data.project_id;
    var res = await webapi.request.post("authorize/project/items_dopost", data);
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/authorize/project/items?project_id="+this.state.data.project_id);
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
                <i className="ti-trash" />
              </a>
              <Link
                to={"/authorize/project/edit/" + d.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="ti-pencil-alt" />
              </Link>
              <Link
                to={"/authorize/project/items?project_id=" + d.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="ti-menu-alt" />
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
        
        <Form.Item name="url" label="链接">
          <Input />
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
          <Link className="button" to={"/authorize/project"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }

  __render_items() { 
    const columns = [
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name",

        align: "center",
      },
      {
        title: "分支",
        sorter: true,
        fixed: "left",
        dataIndex: "branch", 
        align: "center",
      },
      {
        title: "部署版本",
        sorter: true,
        fixed: "left",
        dataIndex: "build_version", 
        align: "center",
      },
      {
        title: "部署时间",
        sorter: true,
        fixed: "left",
        dataIndex: "build_datetime", 
        align: "center",
        render: (field, data) => {
          return (
            data.build_datetime > 0 &&
            moment(data.build_datetime * 1000).format("YYYY-MM-DD HH:mm:ss")
          );
        },
      },
      {
        title: "开发版本",
        sorter: true,
        fixed: "left",
        dataIndex: "developer_version", 
        align: "center",
      },
      {
        title: "开发时间",
        sorter: true,
        fixed: "developer_datetime",
        dataIndex: "visibility",

        align: "center",
        render: function (field, data) {
          return (
            data.developer_datetime > 0 &&
            moment(data.developer_datetime * 1000).format("YYYY-MM-DD HH:mm:ss")
          );
        },
      },
      {
        title: "创建时间",
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
                  this.handle_group_delete(d.id);
                }}
              >
                <i className="ti-trash" />
              </a>
              <Link
                to={"/authorize/project/items_edit/" + d.id+'?project_id='+d.project_id}
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
   * 添加
   * @return obj
   */
   __render_items_add() {
    return this.__render_items_add_edit();
  }
  /**
   * 编辑
   * @return obj
   */
   __render_items_edit() {
    return this.__render_items_add_edit();
  }
  /**
   * 添加、编辑
   * @return obj
   */
   __render_items_add_edit() {
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handle_group_submit}
        {...this.__form_item_layout()}
      >
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name="client_id" label="应用">
          <Input />
        </Form.Item>
        <Form.Item name="type" label="类型">
          <Radio.Group value={this.state.data.visibility}>
            <Radio value={"1"}>SSH</Radio>
            <Radio value={"2"}>Rsync</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="server_name" label="服务器名称">
          <Input />
        </Form.Item>
        
         <Form.Item name="server_ip" label="服务器地址">
          <Input />
        </Form.Item>
        <Form.Item name="server_user" label="服务器用户名">
          <Input />
        </Form.Item>
        <Form.Item name="server_rsync_port" label="服务器端口">
          <Input />
        </Form.Item>
        <Form.Item name="server_rsync_user" label="Rsync用户名">
          <Input />
        </Form.Item>
        <Form.Item name="server_rsync_port" label="Rsync端口">
          <Input />
        </Form.Item>
        
        <Form.Item name="server_dir" label="部署目录">
          <Input />
        </Form.Item>
        <Form.Item name="extend" label="扩展属性">
					<Input.TextArea rows={4} />
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
          <Link className="button" to={"/authorize/project/items?project_id="+this.state.data.project_id}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Project);
