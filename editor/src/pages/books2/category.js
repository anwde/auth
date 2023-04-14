import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Novel from "@/pages/novel/basic_novel.js";
import {
  Form,
  Input,
  Cascader,
  Upload,
  Table,
  Image,
  List,
  Avatar,
  Menu,
  Dropdown,
  Button,
  Statistic,
  Descriptions,
  Space,
  Badge,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import ImgCrop from "antd-img-crop";
const BREADCRUMB = {
  title: "分类管理",
  lists: [{ title: "分类管理", url: "/novel/category" }],
  buttons: [],
};
class Category extends Basic_Novel {
  formRef = React.createRef();
  group = {};
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
    // 创建一个空的editorState作为初始值
    return {
      group: {},
    };
  }

  /*----------------------1 other start----------------------*/

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/
  async __init_index() {
    this.get_group().then((group) => {
      this.setState({ group });
    });

    var lists = [{ title: "分类管理", url: "/novel/category" }];
    var buttons = [
      {
        title: "创建分类",
        url: "/novel/category/add/",
      },
    ];
    this.__breadcrumb({ lists, buttons });
    var d = {};
    d.filters = this.state.filters;
    d.q = this.state.q;
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    d.state_delete = [1];
    var res = await webapi.request.get("novel/category/lists", d);
    if (res.code === 10000) {
      this.setState(
        {
          lists: res.lists,
          pagination: {
            ...this.state.pagination,
            total: res.num_rows,
          },
        },
        () => {
          this.__handle_scroll_top();
        }
      );
    }
  }

  async __init_add_edit() {
    this.get_group().then((group) => {
      this.setState({ group });
    });
    let data = {};
    if (this.state.id) {
      var res = await webapi.request.get("novel/category/get", {
        id: this.state.id,
      });
      if (res.code === 10000) {
        data = res.data;
      }
      var lists = [{ title: "分类管理", url: "/novel/category" }];
      var buttons = [];
      this.__breadcrumb({ lists, buttons });
      this.setState({ data });
      this.formRef.current && this.formRef.current.setFieldsValue(data);
    }
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  /**
   *   提交
   */

  handle_submit = async (value) => {
    value.id = this.state.id;
    var res = await webapi.request.post("novel/category/dopost", value);
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/novel/category/");
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   *   批量删除
   */
  handle_delete = (id) => {
    webapi.confirm({
      url: "novel/category/delete",
      data: {
        id,
      },
      success: (data) => {
        if (data.code === 10000) {
          webapi.message.success(data.message);
          this.__init_index();
        } else {
          webapi.message.error(data.message);
        }
      },
    });
  };

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/
  __render_index() {
    const group = this.state.group || {};
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "类型",
        dataIndex: "group_id",
        key: "group_id",
        sorter: true,
        render: (field, item) => {
          return group[item.group_id] && group[item.group_id].name;
        },
      },

      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        align: "center",
        render: (field, item) => {
          return (
            <div>
              <a
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                onClick={() => {
                  this.handle_delete(item.id);
                }}
              >
                <i className="icon icon-del-thin"></i>
              </a>
              <Link
                to={"/novel/category/edit/" + item.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="icon icon-edit"></i>
              </Link>
            </div>
          );
        },
      },
    ];

    return (
      <>
        <div className="main-header">
          <div className="row">
            <div className="title">
              <h2> 类型管理</h2>
              <span>（共{this.state.pagination.total}条）</span>
            </div>
            <div className="col-right">
              <div className="searchBox">
                <input
                  className="input"
                  type="text"
                  onChange={(o) => {
                    this.__handle_search_change(o);
                  }}
                  onKeyUp={(o) => {
                    this.__handle_search_keyup(o);
                  }}
                  placeholder="搜索"
                />
                <button
                  type="button"
                  className="btn fill-secondary"
                  onClick={this.__handle_search}
                >
                  <i className="icon icon-search"></i>
                </button>
              </div>
              <div className="btn-group">
                <Link to="/novel/category/add" className="btn w-8 round">
                  <i className="icon icon-collection mr-1"></i>添加
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content">
          <Table
            rowKey={(res) => res.id}
            dataSource={this.state.lists}
            pagination={this.state.pagination}
            loading={this.props.loading}
            columns={columns}
            onChange={this.__handle_table_change}
          />
        </div>
      </>
    );
  }

  __render_add_edit(u_action) {
    return (
      <>
        <div className="main-header">
          <div className="row">
            <div className="title">
              <h2>类型管理</h2>
            </div>
            <div className="col-right">
              <div className="btn-group">
                <Link to="/novel/category" className="btn w-8 round">
                  <i className="icon icon-grid mr-1"></i>类型
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content">
          <Form
            {...this.__form_item_layout()}
            layout="horizontal"
            ref={this.formRef}
            onFinish={this.handle_submit}
          >
            <Form.Item label="名称" name="name">
              <Input placeholder="输入名称" />
            </Form.Item>

            <Form.Item label="类型" name="group_id">
              <Select placeholder="请选择">
                {Object.keys(this.state.group).map((key) => {
                  return (
                    <Select.Option value={key} key={key}>
                      {this.state.group[key] && this.state.group[key].name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="介绍" name="intro">
              <Input.TextArea
                placeholder="请输入介绍"
                autoSize={{ minRows: 5, maxRows: 10 }}
              />
            </Form.Item>
            <Form.Item {...this.__tail_layout()}>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.props.server.loading}
                style={{ marginRight: "8px" }}
                shape="round"
              >
                提交保存
              </Button>
              <Link className="button" to={"/novel/category"}>
                返回
              </Link>
            </Form.Item>
          </Form>
        </div>
      </>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Category);