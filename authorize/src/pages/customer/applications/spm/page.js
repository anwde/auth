import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../../../utils/webapi";
import moment from "moment";
import { Form, Input, Table, Button, Select, Space,Menu,Dropdown } from "antd";
import { DeleteOutlined, EditOutlined,UnorderedListOutlined } from "@ant-design/icons";
import Basic_Customer from "../../basic";
const BREADCRUMB = {
  title: "页面",
  lists: [{
    title: "主页",
    url: "/"
  }, {
    title: "商户管理",
    url: "/customer"
  },],
  buttons: [],
};
class Page extends Basic_Customer {
  constructor(props: any) {
    super(props);
  }
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
  __init_state_before() {
    const query = webapi.utils.query();
    return {
      applications_id: query.applications_id,
    };
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
    let app = await this.get_app(applications_id);
    d.applications_id = applications_id;
    const b = {};
    b.buttons = [{
      title: "添加",
      url: `/customer/applications/spm/page/add?applications_id=${applications_id}`,
    },];
    b.lists = BREADCRUMB.lists.concat();
    b.lists.push({
      title: "应用",
      url: `/customer/applications?customer_id=${app.customer_id}`,
    });
    b.lists.push({
      title: "SPM",
      url: `/customer/applications/spm/page/index?applications_id=${applications_id}`,
    });
    this.init_lists("customer/applications/spm/page/lists", d, b);
  }
  
  async __init_add_edit(action) { 
    let b = {};
    let data = {};
    if (action === "edit" && this.state.id) {
        const res = await webapi.request.get(
            "customer/applications/spm/page/get", {
                data: {
                    id: this.state.id
                },
            }
        );
        if (res.code === 10000) {
            data = res.data;
        }
        b.title = `${BREADCRUMB.title}-${data.name}-编辑`;
    } else {
        b.title = `${BREADCRUMB.title}-添加`;
    }
    this.setState({ 
        data: data
    });
    this.formRef.current && this.formRef.current.setFieldsValue({
        ...data
    });
    this.__breadcrumb(b);
}
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
  /**
    * 提交
    **/
  handle_submit = async (data = {}) => {
    const state = this.state;
    data.id = state.id;
    data.applications_id = state.applications_id;
    const res = await webapi.request.post(
      "customer/applications/spm/page/dopost", {
      data
    }
    );
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace(`/customer/applications/spm/page/index?applications_id=${state.applications_id}`

      );
    } else {
      webapi.message.error(res.message);
    }
  };
  /**
     * 删除
     **/

  handle_delete(id) {
    this.handle_do_delete("customer/applications/spm/page", id);
}
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  /**
    * 渲染 首页
    **/
  __render_index() {
    const type = this.state.type || {};
    const type_filters = Object.keys(type).map((key) => {
      return {
        text: type[key].name,
        value: key
      };
    });
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
      width: "100px",
    }
      , {
      title: "子数",
      sorter: true,
      fixed: "left",
      dataIndex: "childrens",
      align: "center",
      width: "100px",
    }, {
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
    }, {
      title: "创建时间",
      sorter: true,
      dataIndex: "create_time",
      width: "200px",
      render: (field, data) => {
        return moment(data.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
      },
      align: "center",
    }, {
      title: "操作",
      align: "center",
      render: (item) => {
        return (
          <Space>
            <Button
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              title="删除"
              onClick={() => {
                this.handle_delete(item.id);
              }}
            />

            <Link
              to={`/customer/applications/spm/page/edit/${item.id}?applications_id=${item.applications_id}`}
            >
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Link>
            <Link 
            to={`/customer/applications/spm/module/index?page_id=${item.id}`}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<UnorderedListOutlined />}
              />
            </Link>
          </Space>
        );
      },
    },];
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
    const state = this.state;
    const type = state.type || {};
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handle_submit}
        {...this.__form_item_layout()}
      >
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name="related" label="关联">
          <Input />
        </Form.Item>


        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            style={{
              marginRight: "8px"
            }}
            loading={this.props.server.loading}
          >
            立即提交
          </Button>
          <Link
            className="button"
            to={`/customer/applications/spm/page/index?applications_id=${state.applications_id}`}
          >
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  } 
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Page);
