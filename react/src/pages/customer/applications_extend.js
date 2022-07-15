import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Customer from "./basic.js";
import moment from "moment";
import { Form, Input, Table, Button, Select } from "antd";
const BREADCRUMB = {
  title: "拓展项管理",
  lists: [
    { title: "主页", url: "/" },
    { title: "商户管理", url: "/customer" },
  ],
  buttons: [{ title: "添加商户", url: "/customer/add" }],
};
class Applications_extend extends Basic_Customer {
   
  /*----------------------0 parent start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/

  /**
   * index  列表数据
   */
  async __init_index(d = {}) {
    const applications_id = this.state.applications_id;
    let type = await this.get_applications_extend_type();
    let app = await this.get_app(applications_id);
    d.applications_id = applications_id;
    const b = {};
    b.buttons = [
      {
        title: "添加",
        url: `/customer/applications_extend/add/${applications_id}`,
      },
    ];
    b.lists = BREADCRUMB.lists.concat();
    b.lists.push({
      title: "应用",
      url: `/customer/applications?customer_id=${app.customer_id}`,
    });
    this.init_lists("customer/applications_extend/lists", d, b, {
      type,
    });
  }
  async __init_add_edit(action) {
    let type = await this.get_applications_extend_type();
    let b = {};
    let data = {};
    if (action === "edit" && this.state.id) {
      const res = await webapi.request.get(
        "customer/applications_extend/get",
        {
          data: { id: this.state.id },
        }
      );
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = `${BREADCRUMB.title}-${data.name}-编辑`;
    } else {
      b.title = `${BREADCRUMB.title}-添加`;
    }
    this.setState({ type, data: data });
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
    this.get_applications_extend_type();
  };
  /**
   * 提交
   **/
  handle_submit = async (data = {}) => {
    data.id = this.state.id;
    data.applications_id = this.state.applications_id;
    const res = await webapi.request.post(
      "customer/applications_extend/dopost",
      { data }
    );
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace(
        "/customer/applications_extend/index/" +
          this.state.applications_id
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
        dataIndex: "type",
        align: "center",
        width: "100px",
        filters:type_filters,
        render: (field, data) => {
          return type[data.type] && type[data.type].name;
        },
      },
      {
        title: "排序",
        sorter: true, 
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
        width: "200px",
        fixed: "right",
        render: (d, i) => {
          return (
            <div>
              <a
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                href="#!"
                onClick={() => {
                  this.__handle_delete(d.id);
                }}
              >
                <i className="ti-trash" />{" "}
              </a>
              <Link
                to={
                  "/customer/applications_extend_items/index/" + d.id
                }
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="ti-menu-alt" />
              </Link>

              <Link
                to={
                  "/customer/applications_extend/edit/" +
                  d.applications_id +
                  "/" +
                  d.id
                }
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
          scroll={{ x: 1000, y: "calc(100vh - 290px)" }}
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
            to={`/customer/applications_extend/index/${this.state.applications_id}`}
          >
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Applications_extend);
