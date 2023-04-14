import React from "react";
import webapi from "../../utils/webapi";
import Basic_Novel from "./basic_novel";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Cascader,
  Upload,
  Button,
  Modal,
  Select,
  Checkbox,
  Row,
  Drawer,
  Tag,
  Popover,
  Card,
  Skeleton,
  Avatar,
  DatePicker,
} from "antd";
import { EditOutlined, FileWordOutlined } from "@ant-design/icons";
import moment from "moment";
const BREADCRUMB = {
  title: "作品管理",
  lists: [
    {
      title: "作品管理",
      url: "/novel/books",
    },
  ],
  buttons: [
    {
      title: "创建作品",
      url: "/novel/books/add",
    },
  ],
};
export default class Basic_Book extends Basic_Novel {
  formRef = React.createRef();

  constructor(props) {
    super(props);
  }

  __init_state_after() {
    const query = webapi.utils.query();
    let filters = {};
    if (query.filters) {
      try {
        filters = JSON.parse(query.filters);
      } catch (err) { }
    }
    return {
      // ...super.__init_state_after(),
      tag: [],
      add_edit_visible: false,
      category_dict: {},
      group: {},
      drawer_visible: false,
      sign_drawer_visible: false,
      filters: filters,
      checked_books_ids: {},
    };
  }
  /**
   * handle_init_after
   */
  __handle_init_after() {
    this.get_book().then((book) => {
      BREADCRUMB.lists = [
        { title: "作品管理", url: "/novel/books" },
        {
          title: book.name,
          url: "/novel/books/edit/" + this.state.book_id,
        },
      ];
    });
  }
  /*----------------------1 other start  ----------------------*/

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/
  /**
   * 添加-编辑始化
   */
  async __init_add_edit(u_action) {
    this.get_category().then((category) => {
      this.setState({
        category,
      });
    });
    this.get_tag().then((tag) => {
      this.setState({
        tag,
      });
    });

    this.get_book(true).then((data) => {
      var buttons = [];
      var lists = [
        {
          title: "作品管理",
          url: "/novel/books",
        },
      ];
      if (this.state.book_id) {
        lists.push({
          title: "章节管理",
          url: "/novel/chapter/index/" + this.state.book_id,
        });
        lists.push({
          title: "卷管理",
          url: "/novel/volume/index/" + this.state.book_id,
        });
        if (webapi.utils.in_array(data.state_sale, ["1", "2", "3", "6"])) {
          buttons.push({
            title: "退稿",
            url: "#",
            onClick: () => {
              this.handle_revert(this.state.book_id);
            },
          });
        }
        if (data.state_sale == 6) {
          buttons.push({
            title: "作品上线",
            url: "#",
            onClick: () => {
              this.handle_sale(this.state.book_id, 7);
            },
          });
        }
        if (data.state_sale == 7) {
          buttons.push({
            title: "作品下线",
            url: "#",
            onClick: () => {
              this.handle_sale(this.state.book_id, 6);
            },
          });
        }
      }
      this.formRef.current && this.formRef.current.setFieldsValue(data);
      this.__breadcrumb({
        buttons,
        lists,
      });
      this.setState({
        data,
      });
    });
  }

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  handle_drawer_close = () => {
    this.formRef.current && this.formRef.current.resetFields();
    this.setState({
      filters: {},
      u_action: "",
      drawer_visible: false,
    });
  };
  handle_drawer_reset = () => {
    this.formRef.current && this.formRef.current.resetFields();
    this.setState({
      filters: {},
    });
  };
  handle_sign_add = (book_id) => {
    this.setState({
      u_action: "sign",
      book_id,
      drawer_visible: true,
    });
  };

  handle_sign_submit = () => {
    this.formRef.current &&
      this.formRef.current
        .validateFields()
        .then((values) => {
          this.handle_sign_finish_user(values);
        })
        .catch((info) => {
          //console.log('Validate Failed:', info);
        });
  };
  async handle_sign_finish_user(values) {
    var data = {};
    data.book_id = this.state.book_id;
    data.type = values.type;
    data.sale = values.sale;
    var res = await webapi.request.post("novel/books/sign_add", data);
    if (res.code === 10000) {
      this.formRef.current.resetFields();
      this.__init_index();
      this.setState({
        drawer_visible: false,
      });
      webapi.message.success(res.message);
    } else {
      webapi.message.error(res.message);
    }
  }
  handle_duty_add = (book_id) => {
    this.setState({
      u_action: "duty",
      book_id,
      drawer_visible: true,
    });
  };

  handle_duty_submit = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        this.handle_duty_finish_user(values);
      })
      .catch((info) => {
        //console.log('Validate Failed:', info);
      });
  };
  async handle_duty_finish_user(values) {
    var data = {};
    data.book_id = this.state.book_id;
    data.user_id = values.user_id;
    var res = await webapi.request.post("novel/books/duty_add", data);
    if (res.code === 10000) {
      this.formRef.current.resetFields();
      this.__init_index();
      this.setState({
        drawer_visible: false,
      });
      webapi.message.success(res.message);
    } else {
      webapi.message.error(res.message);
    }
  }
  handle_add_edit_dopost = () => {
    this.formRef.current &&
      this.formRef.current
        .validateFields()
        .then((values) => {
          this.handle_submit(values);
        })
        .catch((info) => { });
  };

  /**
   * finish 提交
   */
  handle_submit = async (values) => {
    const data = new FormData();
    data.append("book_id", this.state.book_id || "");
    data.append("name", values.name || "");
    data.append("category_id", this.state.category_id || "");
    data.append("intro", values.intro || "");
    data.append("author_id", values.author_id || "");
    data.append("tag", values.tag || "");
    data.append("age_group", values.age_group || "");
    this.state.file && data.append("image", this.state.file);
    var res = await webapi.request.post(
      "novel/books/dopost",
      data,
      null,
      null,
      null,
      true
    );
    if (res.code === 10000) {
      webapi.message.success(res.message);
      if (this.state.add_edit_visible) {
        this.setState({
          add_edit_visible: false,
        });
        this.__init_index();
      } else {
        this.props.history.push("/novel/books/edit/" + res.data.book_id);
      }
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 退稿
   **/
  handle_revert = (book_id) => {
    var that = this;
    webapi.modal.confirm({
      title: "提示",
      content: "退稿后，作者可以对章、卷进行操作?",
      okText: "确认设置",
      cancelText: "不要设置",
      autoFocusButton: "cancel",
      onOk() {
        return new Promise((resolve, reject) => {
          var r = webapi.request.post("novel/books/sale", {
            book_id,
            state: 9,
          });
          resolve(r);
        }).then((res) => {
          if (res.code === 10000) {
            that.__init_index({}, false);
            webapi.message.success(res.message);
          } else {
            webapi.message.error(res.message);
          }
        });
      },
      onCancel() { },
    });
  };
  /**
   * 完结或连载
   **/
  handle_end_of_serial = (book_id, state) => {
    var that = this;
    var str = "设置为连载,作者可以对章、卷进行操作?";
    if (state == "1") {
      str = "设置为完结,作者不能再进行更新等操作?";
    }
    webapi.modal.confirm({
      title: "提示",
      content: str,
      okText: "确认设置",
      cancelText: "不要设置",
      autoFocusButton: "cancel",
      onOk() {
        return new Promise((resolve, reject) => {
          var r = webapi.request.post("novel/books/end_of_serial", {
            book_id,
          });
          resolve(r);
        }).then((res) => {
          if (res.code === 10000) {
            that.__init_index({}, false);
            webapi.message.success(res.message);
          } else {
            webapi.message.error(res.message);
          }
        });
      },
      onCancel() { },
    });
  };
  /**
   * 1先审后发 2先发后审
   **/
  handle_published = (book_id, state) => {
    var that = this;
    var str = "设置为先审后发,作者更新内容需要审核后可上线?";
    if (state === 2) {
      str = "设置为先发后审,作者更新的内容不需要审核可上线?";
    }
    webapi.modal.confirm({
      title: "提示",
      content: str,
      okText: "确认设置",
      cancelText: "不要设置",
      autoFocusButton: "cancel",
      onOk() {
        return new Promise((resolve, reject) => {
          var r = webapi.request.post("novel/books/published", {
            book_id,
          });
          resolve(r);
        }).then((res) => {
          if (res.code === 10000) {
            that.__init_index({}, false);
            webapi.message.success(res.message);
          } else {
            webapi.message.error(res.message);
          }
        });
      },
      onCancel() { },
    });
  };
  /**
   * sale
   **/
  handle_sale = (book_id, state) => {
    var that = this;
    var str = "";
    if (state === 7) {
      str = "确认上线作品吗?";
    }
    if (state === 11) {
      str = "确认下线作品吗?";
    }
    webapi.modal.confirm({
      title: "提示",
      content: str,
      okText: "确认设置",
      cancelText: "不要设置",
      autoFocusButton: "cancel",
      onOk() {
        return new Promise((resolve, reject) => {
          var r = webapi.request.post("novel/books/sale", {
            book_id,
            state,
          });
          resolve(r);
        }).then((res) => {
          if (res.code === 10000) {
            that.__init_index({}, false);
            webapi.message.success(res.message);
          } else {
            webapi.message.error(res.message);
          }
        });
      },
      onCancel() { },
    });
  };
  handle_table_select_change = (selectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({
      selectedRowKeys,
    });
  };
  /**
   * 删除
   **/
  handle_delete = (id) => {
    webapi.confirm({
      url: "novel/books/delete",
      data: {
        book_id: id,
      },
      success: (data) => {
        if (data.code === 10000) {
          webapi.message.success(data.message);
          this.__init_index({}, false);
        } else {
          webapi.message.error(data.message);
        }
      },
    });
  };
  handle_category_change = (value) => {
    var category_id = value[value.length - 1];
    if (category_id != this.state.category_id) {
      this.setState({
        category_id,
      });
    }
  };
  handle_reset_chapters_idx = async (book_id) => {
    var res = await webapi.request.post("novel/books/reset_chapters_idx", {
      book_id,
    });
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.__init_index({}, false);
    } else {
      webapi.message.error(res.message);
    }
  };

  handle_add = () => {
    this.handle_add_edit("edit", 0, "添加作品");
  };
  handle_edit = async (book_id, book) => {
    var data = await this.get_book(true, book_id);
    this.handle_add_edit("edit", book_id, "修改作品", data);
  };
  handle_add_edit = async (u_action, book_id, add_edit_title, data = {}) => {
    if (this.props.loading) {
      return false;
    }

    var category = await this.get_category();
    var tag = await this.get_tag();
    this.setState({
      book_id,
      u_action,
      add_edit_visible: true,
      add_edit_title,
      data,
      tag,
      category,
    });
    this.formRef.current && this.formRef.current.setFieldsValue(data);
  };
  handle_add_edit_modal_close = () => {
    this.setState({
      u_action: "",
      add_edit_visible: false,
      add_edit_title: "",
    });
  };
  handle_filter_drawer_show = () => {
    this.setState({
      drawer_visible: true,
    });
  };

  handle_filter_submit = () => {
    let filters = this.state.filters;
    // if (Object.keys(this.state.filters).length > 0) {
    this.setState(
      {
        drawer_visible: false,
        filters: {},
      },
      () => {
        const urlParams = new URL(window.location.href);
        const params = webapi.utils.query();
        params.filters = JSON.stringify(filters);
        const param = webapi.utils.http_build_query(params);
        var url = urlParams.pathname + "?" + param;
        this.props.history.replace(url);
        this.__init_index();
      }
    );
    // }
  };

  handle_filters_radio_change_values = (field, id, val) => {
    const filters = this.state.filters || {};
    filters[field] = {};
    if (val) {
      filters[field][id] = id;
    }
    this.setState({
      filters,
    });
  };
  handle_filters_checkbox_change_values = (field, id, check, val) => {
    // console.log(field, id, check, val);
    const filters = this.state.filters || {};
    if (!filters[field]) {
      filters[field] = {};
    }
    if (check) {
      filters[field][id] = val ? val : id;
    } else {
      delete filters[field][id];
    }
    this.setState({
      filters,
    });
  };
  handle_user_card_change = async (visible, author_id, id) => {
    let user = {};
    if (visible) {
      user = await this.get_author_info(author_id);
    }
    this.setState({
      user_card_visible: {
        ...this.state.user_card_visible,
        [id]: visible,
      },
      user,
    });
    // console.log(visible, author_id, this.state.user_card_visible);
  };
  handle_change_RangePicker = (dates, dateStrings) => {
    // console.log("-1: ", dates);
    // console.log("-2: ", dateStrings);
  };
  handle_change_RangePicker_clendar = (val) => {
    // console.log("-3: ", val);
    if (!val) {
      this.handle_filters_checkbox_change_values(
        "last_chapter_update_time",
        "start",
        false
      );
      this.handle_filters_checkbox_change_values(
        "last_chapter_update_time",
        "end",
        false
      );
      return 1;
    }
    if (val[0]) {
      this.handle_filters_checkbox_change_values(
        "last_chapter_update_time",
        "start",
        true,
        moment(val[0]).format("YYYY-MM-DD")
      );
    }
    if (val[1]) {
      this.handle_filters_checkbox_change_values(
        "last_chapter_update_time",
        "end",
        true,
        moment(val[1]).format("YYYY-MM-DD")
      );
    }
  };
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/
  __render_index_sign() {
    const server_state = this.state.server_state || {};
    const sign = server_state.book
      ? server_state.book.sign
        ? server_state.book.sign
        : {}
      : {};
    const sign_type = sign.type ? sign.type : {};
    const sign_sale = sign.sale ? sign.sale : {};
    return (
      <Drawer
        title="添加/修改 签约 "
        width={500}
        forceRender={true}
        onClose={this.handle_drawer_close}
        visible={this.state.drawer_visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button
              onClick={this.handle_drawer_close}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button
              onClick={this.handle_sign_submit}
              loading={this.props.loading}
              type="primary"
            >
              提交
            </Button>
          </div>
        }
      >
        <Form layout="horizontal" ref={this.formRef}>
          <Form.Item name="type" label="签约方式">
            <Select>
              {Object.keys(sign_type).map((val, key) => {
                return (
                  <Select.Option key={key} value={val}>
                    {sign_type[val]["name"]}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="sale" label="签约类型">
            <Select>
              {Object.keys(sign_sale).map((val, key) => {
                return (
                  <Select.Option key={key} value={val}>
                    {sign_sale[val]["name"]}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
  __render_index_duty() {
    return (
      <Drawer
        title="添加/修改 责编 "
        width={500}
        forceRender={true}
        onClose={this.handle_drawer_close}
        visible={this.state.drawer_visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button
              onClick={this.handle_drawer_close}
              style={{ marginRight: 8 }}
            >
              取消;
            </Button>
            <Button
              onClick={this.handle_duty_submit}
              loading={this.props.loading}
              type="primary"
            >
              提交
            </Button>
          </div>
        }
      >
        <Form layout="horizontal" ref={this.formRef}>
          <Form.Item name="user_id" label="用户">
            <Input placeholder="请输入责编id或手机号" />
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
  __render_index_add_edit(u_action) {
    const footer = (
      <div className="popup-footer" style={{ textAlign: "center" }}>
        <button
          className="btn fill-primary round lg"
          style={{ width: "300px" }}
          onClick={() => {
            this.handle_add_edit_dopost();
          }}
        >
          <span>确 定</span>
        </button>
      </div>
    );

    return (
      <Modal
        visible={this.state.add_edit_visible}
        onOk={this.handle_add_edit_dopost}
        closeIcon={
          <a
            onClick={(e) => {
              e.preventDefault();
              this.handle_add_edit_modal_close();
            }}
            className="closeBtn"
            style={{ top: 0 }}
          >
            <i className="icon icon-close"></i>
          </a>
        }
        title={
          <>
            <h4>{this.state.add_edit_title}</h4>
          </>
        }
        width="1000px"
        height="calc(100vh - 40px)"
        style={{ top: "20px" }}
        keyboard={false}
        maskClosable={false}
        footer={footer}
        bodyStyle={{
          height: "calc(100vh - 180px)",
          overflowX: "hidden",
          overflowY: "scroll",
        }}
      >
        <div className="form-book-edit">{this.__render_add_edit(u_action)}</div>
      </Modal>
    );
  }
  __render_add_edit(u_action) {
    return (
      <Form
        {...this.__form_item_layout()}
        layout="horizontal"
        ref={this.formRef}
        onFinish={this.handle_submit}
      >
        <Form.Item label="封面图片">
          {this.state.data.image ? (
            <p>
              <img src={this.state.data.image} style={{ width: "100px" }} />
            </p>
          ) : (
            ""
          )}
          <ImgCrop rotate modalTitle="请编辑图片" aspect={0.76923076923077}>
            <Upload {...this.__upload_single_props()}>
              <Button icon={<UploadOutlined />}>更改图片</Button>
              <p className="explain">
                格式：jpg、png
                <br />
                尺寸：600*780
                <br />
                大小：&#60;=500KB
              </p>
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item label="作品名称" name="name">
          <Input placeholder="输入名称" />
        </Form.Item>
        <Form.Item label="作者信息" name="author_id">
          <Input placeholder="输入作者uid或手机号码,不填写就默认是当前登录的人" />
        </Form.Item>

        <Form.Item label="作品类型" name="category">
          <Cascader
            fieldNames={{ label: "name", value: "id" }}
            options={this.state.category}
            placeholder="请选择类型"
            onChange={this.handle_category_change}
          />
        </Form.Item>
        <Form.Item label="商户作品" name="customer_book_id">
          <Input placeholder="商户作品id" />
        </Form.Item>
        <Form.Item label="年龄分段" name="age_group">
          <Select >
            <Select.Option value="16">16+</Select.Option>
            <Select.Option value="18">18+</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="作品标签" name="tag">
          <Checkbox.Group>
            <Row>
              {this.state.tag &&
                Object.keys(this.state.tag).map((val) => {
                  return (
                    <Checkbox
                      key={this.state.tag[val].id}
                      value={this.state.tag[val].id}
                      style={{
                        marginLeft: "0",
                      }}
                    >
                      {this.state.tag[val].name}
                    </Checkbox>
                  );
                })}
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="作品介绍" name="intro">
          <Input.TextArea
            placeholder="请输入介绍"
            autoSize={{ minRows: 5, maxRows: 10 }}
          />
        </Form.Item>
        {this.state.add_edit_visible ? (
          ""
        ) : (
          <Form.Item {...this.__tail_layout()}>
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
            >
              提交保存
            </Button>
          </Form.Item>
        )}
      </Form>
    );
  }
  __render_drawer_tag = (filters, field, id, name) => {
    return (
      <Tag.CheckableTag
        value={id}
        key={id}
        onChange={(checked) =>
          this.handle_filters_checkbox_change_values(field, id, checked)
        }
        checked={filters[field] && filters[field][id]}
      >
        {name}
      </Tag.CheckableTag>
    );
  };
  __render_drawer(children = "") {
    const channel = this.state.channel || {};
    const category = this.state.category || [];
    const server_state = this.state.server_state || {};
    const state_sale = server_state.book ? server_state.book.sale : {};
    const filters = this.state.filters || {};
    // console.log(filters);
    return (
      <Drawer
        title="筛选"
        width="38.2%"
        forceRender={true}
        onClose={this.handle_drawer_close}
        visible={this.state.drawer_visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button
              onClick={this.handle_filter_submit}
              loading={this.props.loading}
              type="primary"
              style={{ marginRight: 8 }}
            >
              确认
            </Button>
            <Button onClick={this.handle_drawer_reset}>重置</Button>
          </div>
        }
      >
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
        >
          <Form.Item label="状态" name="state_sale">
            <div
              style={{
                lineHeight: "32px",
                transition: "all 0.3s",
                userSelect: "none",
              }}
            >
              {Object.keys(state_sale).map((val) => {
                return this.__render_drawer_tag(
                  filters,
                  "state_sale",
                  val,
                  state_sale[val].name
                );
              })}
            </div>
          </Form.Item>

          <Form.Item
            label="分类"
            name="category_id"
            style={{ display: "none" }}
          >
            <div
              style={{
                lineHeight: "32px",
                transition: "all 0.3s",
                userSelect: "none",
              }}
            >
              {category.map((val) => {
                let c = "";
                if (val.children) {
                  c = val.children.map((v) => {
                    return this.__render_drawer_tag(
                      filters,
                      "category_id",
                      v.id,
                      v.name
                    );
                  });
                }
                return c;
              })}
            </div>
          </Form.Item>
          <Form.Item label="更新时间" name="last_chapter_update_time">
            <DatePicker.RangePicker
              onChange={this.handle_change_RangePicker}
              onCalendarChange={this.handle_change_RangePicker_clendar}
              initialValues={[
                filters["last_chapter_update_time"] &&
                  filters["last_chapter_update_time"]["start"]
                  ? moment(
                    filters["last_chapter_update_time"]["start"],
                    "YYYY-MM-DD"
                  )
                  : "",
                filters["last_chapter_update_time"] &&
                  filters["last_chapter_update_time"]["end"]
                  ? moment(
                    filters["last_chapter_update_time"]["end"],
                    "YYYY-MM-DD"
                  )
                  : "",
              ]}
            />
          </Form.Item>


          <Form.Item label="连载/完结" name="end_of_serial">
            <div
              style={{
                lineHeight: "32px",
                transition: "all 0.3s",
                userSelect: "none",
              }}
            >
              {this.__render_drawer_tag(filters, "end_of_serial", 1, "连载")}
              {this.__render_drawer_tag(filters, "end_of_serial", 2, "完结")}
            </div>
          </Form.Item>
          {children}
        </Form>
      </Drawer>
    );
  }
  __render_user_popover(item, children) {
    const user = this.state.user || {};
    return (
      <Popover
        content={
          <Card
            bordered={false}
            style={{ width: 300, marginTop: 16 }}
            actions={[
              <>
                <EditOutlined key="ellipsis" />
                作品总数 {user.books || 0}
              </>,
              <>
                <FileWordOutlined />
                累计字数{" "}
                {user.words > 10000
                  ? (user.words / 10000).toFixed(2) + "万"
                  : user.words || 0}
              </>,
            ]}
          >
            <Skeleton loading={this.props.server.loading} avatar active>
              <Card.Meta
                avatar={<Avatar size={80} src={user.avatar} />}
                title={
                  user.nickname &&
                  user.nickname +
                  (user.pseudonym ? "(" + user.pseudonym + ")" : "")
                }
                description={
                  <>
                    {user.mobile ? <p>手机:{user.mobile}</p> : ""}
                    {user.qq ? <p>QQ:{user.qq}</p> : ""}
                    {user.weixin ? <p>微信:{user.weixin}</p> : ""}
                    <div>{user.intro}</div>
                  </>
                }
              />
            </Skeleton>
          </Card>
        }
        title=""
        visible={
          this.state.user_card_visible &&
          this.state.user_card_visible[item.user_id + "_" + item.id]
        }
        onVisibleChange={(o) =>
          this.handle_user_card_change(
            o,
            item.user_id,
            item.user_id + "_" + item.id
          )
        }
      >
        {children}
      </Popover>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
