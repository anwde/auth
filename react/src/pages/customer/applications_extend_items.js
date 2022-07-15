import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Customer from "./basic.js";
import moment from "moment";
import { Form, Input, Table, Button, Select } from "antd";
const BREADCRUMB = {
  title: "拓展项目管理",
  lists: [
    { title: "主页", url: "/" },
    { title: "商户管理", url: "/customer" },
  ],
  buttons: [{ title: "添加商户", url: "/customer/add" }],
};
class Applications_extend_items extends Basic_Customer {
  
  /*----------------------0 parent start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/
  async get_extend(id, reset = false) {
    if (!this.extend) {
      this.extend = {};
    }
    let extend = this.extend[id] ? this.extend[id] : {};
    if (reset || Object.keys(extend).length === 0) {
      let res = await webapi.request.get(
        "customer/applications_extend/get",
        {
          data: {
            id,
          },
        }
      );
      if (res.code === 10000) {
        extend = res.data;
      }
    }
    this.extend[id] = extend;
    return extend;
  }
  get_extend_items_type = async (reset = false) => {
    let extend_items_type = this.extend_items_type || {};
    if (reset || Object.keys(extend_items_type).length === 0) {
      let res = await webapi.request.get(
        "customer/applications_extend_items/type"
      );
      if (res.code === 10000) {
        extend_items_type = res.data;
      }

      this.extend_items_type = extend_items_type;
    }
    return extend_items_type;
  };
  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/

  /**
   * index  列表数据
   */
  async __init_index(d = {}) {
    const extend_id = this.state.extend_id;
    const extend = await this.get_extend(extend_id);
    const app = await this.get_app(extend.applications_id);
    const b = { title: `${BREADCRUMB.title}-${extend.name}` };
    b.buttons = [
      {
        title: "添加",
        url: `/customer/applications_extend_items/add/${extend_id}`,
      },
    ];
    b.lists = BREADCRUMB.lists.concat();
    b.lists.push({
      title: "应用",
      url: `/customer/applications?customer_id=${app.customer_id}`,
    });
    b.lists.push({
      title: "拓展项",
      url: `/customer/applications_extend/index/${app.id}`,
    });
    let type = await this.get_extend_items_type();
    d.extend_id = extend_id;
    this.init_lists(
      "customer/applications_extend_items/lists",
      d,
      b,
      { type, extend }
    );
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
  __handle_init_before = () => {
    this.get_extend_items_type();
  };
  /**
   * 提交
   **/
  handle_submit = async (data = {}) => {
    const extend_id=this.state.extend_id;
    data.id = this.state.id;
    data.extend_id = extend_id; 
    const res = await webapi.request.post(
      "customer/applications_extend_items/dopost",
      { data }
    );
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace(
        `/customer/applications_extend_items/index/${extend_id}`
      );
    } else {
      webapi.message.error(res.message);
    }
  };
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  /**
   * 渲染 首页
   **/
  __render_index() {
    const type = this.state.type || {};
    const type_filters = Object.keys(type).map((key) => {
			return { text: type[key].name, value: key };
		});
    const columns = [
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name",
        align: "center",
        width: "100px",
      },
      {
        title: "字段",
        sorter: true,
        fixed: "left",
        dataIndex: "field",
        align: "center",
        width: "100px",
      },
      {
        title: "类型",
        sorter: true,
        fixed: "left",
        dataIndex: "type",
        align: "center",
        width: "100px",
        filters: type_filters,
        render: (field, data) => {
          return type[data.type] && type[data.type].name;
        },
      },
      {
        title: "排序",
        sorter: true,
        fixed: "left",
        dataIndex: "idx",
        align: "center",
        width: "100px",
      },
      {
        title: "更新时间",
        sorter: true,
        dataIndex: "update_time",
        width: "200px",
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
        width: "200px",
        render: (field, data) => {
          return moment(data.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
        },
        align: "center",
      },
      {
        title: "操作",
        align: "center",
        render: (item) => {
          return (
            <div>
              <a
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                href="#!"
                onClick={() => {
                  this.__handle_delete(item.id);
                }}
              >
                <i className="ti-trash" />
              </a>

              <Link
                to={`/customer/applications_extend_items/edit/${item.extend_id}/${item.id}`}
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
   * 添加、编辑
   * @return obj
   */
  __render_add_edit() {
    const type = this.state.type || {};
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handle_submit}
        {...this.__form_item_layout()}
      >
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name="field" label="字段">
          <Input />
        </Form.Item>
        <Form.Item name="idx" label="排序">
          <Input />
        </Form.Item>

        <Form.Item name="type" label="类型">
          <Select>
            {Object.keys(type).map((key) => {
              return (
                <Select.Option value={key * 1} key={key}>
                  {type[key].name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="visibility" label="可见">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="params" label="参数">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.props.server.loading}
          >
            立即提交
          </Button>
          <Link
            className="button"
            to={`/customer/applications_extend_items/index/${this.state.extend_id}`}
          >
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Applications_extend_items);
