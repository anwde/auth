import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import {
  Form,
  Input,
  Cascader,
  Upload,
  Menu,
  Pagination,
  Button,
  Avatar,
  Space,
  Dropdown,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  WomanOutlined,
  ManOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import moment from "moment";
const BREADCRUMB = {
  type: "BREADCRUMB",
  data: {
    title: "作者管理",
    lists: [{ title: "作者管理", url: "/novel/author" }],
    buttons: [{ title: "添加作者", url: "/novel/author/add" }],
  },
};
class Author extends Basic_Component {
  formRef = React.createRef();
  area = [];
  constructor(props) {
    super(props);
  }

  /*----------------------1 other start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }

  async get_area(reset = false) {
    var area = this.area;
    if (reset || area.length == 0) {
      var res = await webapi.request.get("server/area");
      if (res.code === 10000) {
        this.area = area = res.lists;
      }
    }
    return area;
  }
  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  __init_page_data() {
    return {
      pageSize: 20,
      total: 0,
      current: 1,
      onChange: this.__handle_page_change,
    };
  }

  __init_state_after() {
    return {
      data: { idcard_model: {} },
      state: { 1: "正常", 2: "关闭", 3: "待激活", 4: "禁止", 5: "注销" },
    };
  }

  /**
   * index  列表数据
   */
  async __init_index(d = {}) {
    this.__breadcrumb();
    d.filters = this.state.filters;
    d.q = this.state.q;
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    var data = await webapi.request.get("novel/author/lists", d);
    var lists = [];
    if (data.code === 10000 && data.num_rows > 0) {
      lists = data.lists;
    }
    this.setState(
      {
        lists: lists,
        pagination: { ...this.state.pagination, total: data.num_rows },
      },
      () => {
        this.__handle_scroll_top();
      }
    );
  }
  /**
   * 添加-编辑始化
   */
  async __init_add_edit(u_action) {
    this.__breadcrumb({ buttons: [] });
    this.get_area().then((area) => {
      this.setState({ area, area });
    });
    if (this.state.id) {
      var res = await webapi.request.get("novel/author/get", {
        user_id: this.state.id,
      });
      if (res.code === 10000) {
        this.setState({ data: res.data });
        this.formRef.current && this.formRef.current.setFieldsValue(res.data);
      }
    }
  }

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/

  __handle_init_before = () => {
    if (this.area.length === 0) {
      this.get_area();
    }
  };
  handle_submit = async (values) => {
    const data = new FormData();
    data.append("user_id", this.state.id || "");
    data.append("nickname", values.nickname || "");
    data.append("address", values.address || "");
    data.append("intro", values.intro || "");
    data.append("area_id", this.state.area_id || "");
    data.append("pseudonym", values.pseudonym || "");
    data.append("idcard", values.idcard || "");
    data.append("userrealname", values.userrealname || "");
    data.append("mobile", values.mobile || "");
    this.state.file && data.append("avatar", this.state.file);
    var res = await webapi.request.post(
      "novel/author/dopost",
      data,
      null,
      null,
      null,
      true
    );
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.push("/novel/author/edit/" + res.data.user_id);
    } else {
      webapi.message.error(res.message);
    }
  };
  handle_profile_area_id = (value) => {
    var area_id = value[value.length - 1];
    if (area_id != this.state.area_id) {
      this.setState({
        area_id: area_id,
      });
    }
  };
  /**
   * 删除
   **/
  handle_delete = (user_id) => {
    webapi.confirm({
      url: "novel/author/delete",
      data: {
        user_id: user_id,
      },
      success: (data) => {
        if (data.code === 10000) {
          webapi.message.success(data.message);
          this.init_index();
        } else {
          webapi.message.error(data.message);
        }
      },
    });
  };
  handle_blur_idcard = async (event) => {
    if (this.state.idcard) {
      var data = await webapi.request.post("authorize/account/idcard", {
        idcard: this.state.idcard,
      });
      if (data.code === 10000) {
        this.setState({
          data: {
            ...this.state.data,
            idcard_model: data.idcard_model,
          },
        });
      }
    }
  };
  handle_change_idcard = (event) => {
    var val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
    if (val != "") {
      this.setState({
        idcard: val,
      });
    }
  };
  handle_filter_drawer_show = () => {
    this.setState({
      drawer_visible: true,
    });
  };
  handel_action_state = (e, state, user_id, user) => {
    if (state == user.state) {
      return webapi.modal.info({ content: "当前状态不需要改变" });
    }
    var content = "确认操作为 " + this.state[state];

    webapi.confirm({
      content: content,
      url: "novel/author/state",
      data: { user_id: user_id },
      success: (data) => {
        if (data.status == "success") {
          webapi.message.success(data.message);
          this.__method("init");
        } else {
          webapi.message.error(data.message);
        }
      },
    });
  };
  /*---------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/

  __render_add_edit() {
    const ucdata = this.state.data;
    // console.log(this.state);
    var suffix = <span />;
    if (ucdata.idcard_model) {
      if (ucdata.idcard_model.gender == 1) {
        suffix = (
          <ManOutlined
            style={{
              fontSize: 16,
              color: "#1890ff",
            }}
          />
        );
      }
      if (ucdata.idcard_model.gender == 2) {
        suffix = (
          <WomanOutlined
            style={{
              fontSize: 16,
              color: "#FFC0CB",
            }}
          />
        );
      }
    }
    return (
      <Form
        {...this.__form_item_layout()}
        ref={this.formRef}
        onFinish={this.handle_submit}
      >
        <Form.Item label="头像">
          <Space align="center" size="middle">
            <Avatar
              size={64}
              src={ucdata.image ? ucdata.image : ucdata.avatar}
              onError={<UserOutlined />}
            />
            <ImgCrop rotate>
              <Upload {...this.__upload_single_props()}>
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </ImgCrop>
          </Space>
        </Form.Item>
        <Form.Item name="mobile" label="手机号码">
          <Input />
        </Form.Item>
        <Form.Item name="nickname" label="昵称">
          <Input />
        </Form.Item>
        <Form.Item name="pseudonym" label="笔名">
          <Input />
        </Form.Item>
        <Form.Item name="userrealname" label="姓名">
          <Input />
        </Form.Item>
        <Form.Item name="idcard" label="身份证号">
          <Input
            suffix={suffix}
            onBlur={this.handle_blur_idcard}
            onChange={this.handle_change_idcard}
          />
        </Form.Item>
        <Form.Item name="area" label="所在省市">
          <Cascader
            options={this.state.area}
            showSearch
            placeholder="请选择地址"
            onChange={this.handle_profile_area_id}
          />
        </Form.Item>

        <Form.Item name="address" label="详细地址">
          <Input />
        </Form.Item>
        <Form.Item name="intro" label="个人简介">
          <Input.TextArea placeholder="个人简介" rows={4} />
        </Form.Item>

        <Form.Item {...this.__tail_layout()}>
          <Button htmlType="submit" type="primary" shape="round">
            提交保存
          </Button>
        </Form.Item>
      </Form>
    );
  }
  __render_index() {
    // console.log(this.state.state)
    return (
      <>
        <div className="main-header">
          <div className="row">
            <div className="title">
              <h2>作家管理</h2>
              <span>（共{this.state.pagination.total}位）</span>
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
                  onClick={this.handle_search}
                >
                  <i className="icon icon-search"></i>
                </button>
              </div>
              <div className="btn-group">
                <a
                  className="btn w-8 round"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handle_filter_drawer_show();
                  }}
                >
                  <i className="icon icon-filter mr-1"></i>筛选
                </a>
                <Link className="btn w-8 round" to="/novel/author/add">
                  <i className="icon icon-collection mr-1"></i>添加
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content" v-if="method == 'index'">
          <div className="authors-list">
            {this.state.lists.map((item, key) => {
              const menu = (
                <Menu>
                  <Menu.Item>
                    <Button
                      type="primary"
                      onClick={(o) =>
                        this.handel_action_state(o, 1, item.user_id, item)
                      }
                    >
                      激活
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      type="primary"
                      onClick={(o) =>
                        this.handel_action_state(o, 3, item.user_id, item)
                      }
                    >
                      待激活
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      type="primary"
                      onClick={(o) =>
                        this.handel_action_state(o, 2, item.user_id, item)
                      }
                    >
                      关闭
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      type="primary"
                      onClick={(o) =>
                        this.handel_action_state(o, 4, item.user_id, item)
                      }
                    >
                      禁止
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      type="primary"
                      onClick={(o) =>
                        this.handel_action_state(o, 5, item.user_id, item)
                      }
                    >
                      注销
                    </Button>
                  </Menu.Item>

                  <Menu.Item></Menu.Item>
                </Menu>
              );
              return (
                <div className="item" key={key}>
                  <div className="item-avatar">
                    <a href="#" className="avatar">
                      <img src={item.avatar} />
                    </a>
                  </div>
                  <div className="item-body">
                    <div className="title">
                      <h5>
                        <a href="#">{item.pseudonym}</a>
                      </h5>
                    </div>
                    <p>
                      <span
                        className="[
					  'gender',
					  'mr-2',
					  item.gender == 1 ? 'male' : '',
					  item.gender == 2 ? 'female' : ''
					]"
                      ></span>
                      {item.area}
                    </p>
                    <p className="time">
                      <span className="mr-4">
                        <i className="icon icon-safe mr-1"></i>注册时间：
                        {item.create_time > 0 &&
                          moment(item.create_time * 1000).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                      </span>
                      <span>
                        <i className="icon icon-time mr-1"></i>最后登录：
                        {item.last_login_time > 0 &&
                          moment(item.last_login_time * 1000).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                      </span>
                    </p>
                  </div>
                  <ul className="item-data">
                    <li>
                      <Link to={`/novel/books?author_id=${item.user_id}`}>
                        <p>{item.books}</p>
                        <p>
                          <i className="icon icon-book mr-1"></i>累计作品数
                        </p>
                      </Link>
                    </li>
                    <li>
                      <p> 
                        {item.words > 0
                          ? (item.words / 1000).toFixed() + "k"
                          : "0"}
                      </p>
                      <p>
                        <i className="icon icon-manuscript mr-1"></i>累计字数
                      </p>
                    </li>
                  </ul>
                  <ul className="item-control">
                    <li className="state">
                      <p
                        className={
                          item.state == 1 ? "text-primary" : "text-crimson"
                        }
                      >
                        <i className="icon icon-user"></i>
                        {this.state.state && this.state.state[item.state]}
                      </p>
                    </li>
                    <li>
                      <Dropdown overlay={menu}>
                        <a
                          className="btn outline-primary ant-dropdown-link"
                          href="#!"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          操作
                        </a>
                      </Dropdown>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="pagination fill lg">
            <Pagination
              {...this.state.pagination}
              onChange={this.__handle_page_change}
            />
          </div>
          <div className="pagination_fill_placeholder"></div>
        </div>
      </>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Author);
