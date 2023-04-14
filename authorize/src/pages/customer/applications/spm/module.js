import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../../../utils/webapi";
import moment from "moment";
import { Form, Input, InputNumber, Table, Button, Select, Space, Menu, Dropdown, Modal } from "antd";
import { DeleteOutlined, EditOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Basic_Customer from "../../basic";
const BREADCRUMB = {
  title: "模块",
  lists: [{
    title: "主页",
    url: "/"
  }, {
    title: "商户管理",
    url: "/customer"
  },],
  buttons: [],
};
class Module extends Basic_Customer {
  page = {};
  pages={};
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
  async get_page(id, reset = false) {
    let page = this.page ? (this.page[id] ? this.page[id] : {}) : {};
    if (reset || Object.keys(page).length === 0) {
      let res = await webapi.request.get(
        "customer/applications/spm/page/get",
        {
          data: {
            id,
          }
        }
      );
      if (res.code === 10000) {
        page = res.data;
      }
    }
    this.page[id] = page;
    return page;
  }
  async get_pages(applications_id,reset = false) {
    let pages = this.pages ? (this.pages[applications_id] ? this.pages[applications_id] : {}) : {};
    if (reset || Object.keys(pages).length === 0) {
      let res = await webapi.request.get(`customer/applications/spm/page/dict`,{data:{applications_id}});
      if (res.code === 10000) {
        pages = res.data;
      }
    }
    this.pages[applications_id] = pages;
    return pages;
  }

  /*----------------------1 other start----------------------*/

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  /**
     * index  列表数据
     */
  async __init_index(d = {}) {
    const applications_id = this.state.applications_id; 
    const app = await this.get_app(applications_id); 
    d.applications_id = applications_id;
    let pages = await this.get_pages(applications_id);
    const b = {};
    b.buttons = [{
      title: "添加",
      url: `/customer/applications/spm/module/add?applications_id=${applications_id}`,
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
    this.init_lists("customer/applications/spm/module/lists", d, b, { app, pages });
  }

  async __init_add_edit(action) {
    let b = {};
    let data = {};
    if (action === "edit" && this.state.id) {
      const res = await webapi.request.get(
        "customer/applications/spm/module/get", {
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
    data.page_id = state.page_id;
    const res = await webapi.request.post(
      "customer/applications/spm/module/dopost", {
      data
    }
    );
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace(`/customer/applications/spm/module/index?page_id=${state.page_id}`

      );
    } else {
      webapi.message.error(res.message);
    }
  };
  /**
  * 删除
  **/

  handle_delete(id) {
    this.handle_do_delete("customer/applications/spm/module", id);
  }
  /**
  * 复制
  **/

  handle_copy(copy_id) { 
    webapi.delete({
      url:'customer/applications/spm/module/copy',
      data:{id:copy_id},
      content:'确认复制吗?',
      success: (data) => {
        if (data.code === 10000) {
          webapi.message.success(data.message);
          this.__method("init");
        } else {
          webapi.message.error(data.message);
        }
      },
     
    }); 
  }
  /**
  * 复制到页面
  **/

  handle_copy_to_page(copy_id) {

    this.setState({ copy_id, to_id: 0, modal_copy_to_page: true });
  }
  /**
  * 复制到页面
  **/
  handle_input = (k, v) => {
    console.log('data=>', k, v)
    this.setState({ [k]: v })
  }
  /**
  * 复制到页面
  **/
  handle_copy_to_page_submit = async () => {
    const state = this.state;
    console.log('data=>', this.state)
    if (state.to_id === 0 || state.copy_id === 0) {
      return webapi.message.error('请输入页面ID');
    }
    const data = { to_id: state.to_id, copy_id: state.copy_id };
    const res = await webapi.request.post(
      "customer/applications/spm/module/copy_to_page", {
      data
    }
    );
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.handle_copy_to_page_cancel();
    } else {
      webapi.message.error(res.message);
    }

  }
  /**
  * 关闭model
  **/
  handle_copy_to_page_cancel = () => {
    this.setState({ copy_id: 0, to_id: 0, modal_copy_to_page: false });
  }
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  /**
    * 渲染 首页
  **/
  __render_index() {
    const state = this.state;
    const pages = state.pages || {};
    const pages_filters = Object.keys(pages).map((key) => {
      return {
        text: pages[key].name,
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
      },
      {
        title: "页面",
        sorter: true,
        fixed: "left",
        dataIndex: "page_id",
        align: "center",
        filters: pages_filters,
        render: (_, item) => {
          return pages[item.page_id] && pages[item.page_id].name;
        },
      }
      , {
        title: "子数",
        sorter: true,
        fixed: "left",
        dataIndex: "childrens",
        align: "center",
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
                to={`/customer/applications/spm/module/edit/${item.id}?page_id=${item.page_id}`}
              >
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
              </Link>

              <Dropdown
                overlay={this._render_dropdown_menus_action(item)}
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
      <>
        <Table
          rowKey={(res) => res.id}
          columns={columns}
          dataSource={state.lists}
          pagination={state.pagination}
          loading={this.props.loading}
          onChange={this.__handle_table_change}
        />
        <Modal
          title="复制到页面"
          centered={true}
          open={state.modal_copy_to_page}
          onOk={this.handle_copy_to_page_submit}
          confirmLoading={this.props.server.loading}
          onCancel={this.handle_copy_to_page_cancel}
        >
          <Form
            layout='vertical'
          >
            <Form.Item label="请输入页面id">
              <InputNumber
                style={{
                  width: '100%',
                }}
                type="number" onChange={(v) => this.handle_input('to_id', (v))} />
            </Form.Item>
          </Form>
        </Modal>
      </>

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
            to={`/customer/applications/spm/module/index?page_id=${state.page_id}`}
          >
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  _render_dropdown_menus_action = (data) => {

    return (
      <Menu>
        <Menu.Item key="pages_1">
          <Link to={`/customer/applications/spm/area/index?module_id=${data.id}`}>
            <Button type="primary" shape="round">
              区域
            </Button>
          </Link>
        </Menu.Item>
        <Menu.Item key="pages_2">
          <Button type="primary" shape="round" onClick={() => this.handle_copy(data.id)}>
            复制
          </Button>
        </Menu.Item>
        <Menu.Item key="pages_3">
          <Button type="primary" shape="round" onClick={() => this.handle_copy_to_page(data.id)}>
            复制到页面
          </Button>
        </Menu.Item>
      </Menu>
    );
  };
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Module);
