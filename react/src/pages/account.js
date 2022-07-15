import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import {
  Button,
  Input,
  Select,
  Upload,
  Form,
  List,
  Avatar,
  Switch,
  Cascader,
  Space,
} from "antd";
import * as icons from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import styles from "./account.less";

const BREADCRUMB = {
  title: "我的资料",
  lists: [{ title: "我的资料", url: "/authorize/account/profile" }],
  //{ title: "账号绑定", url: "/authorize/account/oauth" }
  //{ title: "消息通知", url: "/authorize/account/notification" }
  buttons: [
    { title: "安全设置", url: "/authorize/account/security" },
    { title: "基本设置", url: "/authorize/account/profile" },
  ],
};

const original_captcha_url = "/authorize/auth/captcha?reset=1&height=30";

class Account extends Basic_Component {
  formRef = React.createRef();
  area = [];
  /**
   * 构造
   */
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }

  /**
   * init_state 初始化状态 2=init
   * @return obj
   */

  __init_state_after() {
    // if (this.area.length === 0) {
    //     this.get_area();
    // }
    this.__breadcrumb();
    return {
      ucdata: this.props.ucdata || {},
      data: {},
      area: [],
    };
  }

  /*----------------------1 other start----------------------*/

  async get_area(reset = false) {
    var area = this.area || [];
    if (reset || area.length === 0) {
      var res = await webapi.request.get("server/area");
      if (res.code === 10000) {
        this.area = area = res.lists;
      }
    }
    return area;
  }
  //wait scan
  get_oauth_state = async (type, id, modal) => {
    var res = await webapi.request.get("authorize/account/oauth", {
      u_action: "state",
      type,
      id,
    });
    if (res.code === 10000) {
      this.clearinterval();
      modal && modal.destroy();
      webapi.modal.success({
        title: "提示",
        content: res.message,
        keyboard: false,
        onOk: () => {
          this.__handle_init();
        },
      });
    }
  };
  clearinterval() {
    this.interval && window.clearInterval(this.interval);
  }

  settnterval_Test() {
    const { countDown } = this.props;
    let count = countDown || 59;
    this.setState({ count });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({
        valicode_text: "重新获取(" + count + ")",
        auth_btn_disabled: false,
        captcha_btn_disabled: true,
      });
      if (count === 0) {
        this.setState({
          valicode_text: "重新获取",
          captcha_btn_disabled: false,
        });
        clearInterval(this.interval);
      }
    }, 1000);
  }
  /**
   * 刷新验证码
   **/
  handle_chang_captcha_mobile() {
    if (this.state.captcha_btn_disabled) {
      return false;
    }
    this.setState({
      captcha_url: original_captcha_url + "&r=" + Math.random(),
    });
  }
  /**
   * 通知开关
   **/
  handle_notification_switch = (checked) => {};
  /*----------------------1 other end----------------------*/

  /*----------------------2 init start----------------------*/
  __init_settings() {
    this.__init_profile();
  }
  async __init_profile() {
    this.get_area().then((area) => {
      this.setState({ area });
    });
    var res = await webapi.request.get("authorize/account/profile");
    if (res.code === 10000) {
      const ucdata = res.data;
      this.setState({ ucdata });
      this.formRef.current && this.formRef.current.setFieldsValue(ucdata);
    }
  }
  async __init_security() {
    var res = await webapi.request.get("authorize/account/security");
    if (res.code === 10000) {
      const ucdata = res.data;
      this.setState({ ucdata: { ...this.state.ucdata, ...ucdata } });
      this.formRef.current && this.formRef.current.setFieldsValue(ucdata);
    }
  }

  async __init_password() {
    var res = await webapi.request.get("authorize/account/password");
    if (res.code === 10000) {
      const ucdata = res.data;
      this.setState({ ucdata, captcha_url: original_captcha_url });
      this.formRef.current && this.formRef.current.setFieldsValue(ucdata);
    }
  }
  async __init_mobile() {
    var res = await webapi.request.get("authorize/account/password");
    if (res.code === 10000) {
      const ucdata = res.data;
      this.setState({ ucdata, captcha_url: original_captcha_url });
      this.formRef.current && this.formRef.current.setFieldsValue(ucdata);
    }
  }
  async __init_email() {
    var res = await webapi.request.get("authorize/account/profile");
    if (res.code === 10000) {
      const ucdata = res.data;
      this.setState({ ucdata, captcha_url: original_captcha_url });
      this.formRef.current && this.formRef.current.setFieldsValue(ucdata);
    }
  }
  async __init_oauth() {
    var res = await webapi.request.get("authorize/account/oauth");
    if (res.code === 10000) {
      this.setState({ ucdata: { ...this.state.ucdata, ...res.data } });
    }
  }

  /*----------------------2 init end----------------------*/

  /*----------------------3 handle start----------------------*/

  /**
   * 更新
   */
  async handle_update_submit(values) {
    const data = new FormData();
    data.append("field_name", "avatar");
    data.append("nickname", values.nickname || "");
    data.append("address", values.address || "");
    data.append("intro", values.intro || "");
    data.append("area_id", this.state.area_id || "");
    data.append("idcard", this.state.idcard || "");
    data.append("userrealname", values.userrealname || "");
    data.append("pseudonym", values.pseudonym || "");
    this.state.file && data.append("avatar", this.state.file);
    var res = await webapi.request.post(
      "authorize/account/profile",
      data,
      null,
      null,
      null,
      true
    );
    if (res.code === 10000) {
      this.setState({ file: null });
      webapi.message.success(res.message);
      webapi.server();
    } else {
      webapi.message.error(res.message);
    }
  }
  /**
   * 业务 密码输入框
   */
  handle_change_input(v, event) {
    let val = "";
    if (v === "mobile") {
      val = event.target.value.replace(/[^\d]/g, "");
      if (val.length > 11) {
        return false;
      }
      return this.setState({
        data: { ...this.state.data, mobile: val },
      });
    }
    if (v === "email") {
      val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
      return this.setState({
        data: { ...this.state.data, email: val },
      });
    }

    if (v === "captcha_number") {
      val = event.target.value.replace(/[^\d]/g, "");
      if (val.length > 4) {
        return false;
      }
      return this.setState({
        data: { ...this.state.data, captcha_number: val },
      });
    }
    if (v === "captcha_mobile") {
      val = event.target.value.replace(/[^\d]/g, "");
      if (val.length > 6) {
        return false;
      }
      return this.setState({
        data: { ...this.state.data, captcha_mobile: val },
      });
    }
    if (v === "password") {
      val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
      this.setState({
        data: { ...this.state.data, password: val },
      });
    }
  }
  /**
   * 业务 密码更新
   */
  handle_password_update = async (u_action) => {
    this.state.data.u_action = u_action;
    if (u_action === "captcha") {
      if (!this.state.data.captcha_number) {
        return webapi.modal.error({ content: "请输入图形验证码" });
      }
      if (this.state.captcha_btn_disabled) {
        return false;
      }
    }
    if (u_action === "activate") {
      if (!this.state.data.user_id) {
        return webapi.message.error({ content: "请获取验证码" });
      }
      if (!this.state.data.captcha_mobile) {
        return webapi.message.error({ content: "请输入短信验证码" });
      }
      if (!this.state.data.password) {
        return webapi.message.error({ content: "请输入密码" });
      }
    }
    var data = await webapi.request.post(
      "authorize/account/password",
      this.state.data
    );
    if (data.status === "failure") {
      if (u_action === "captcha") {
        this.handle_chang_captcha_mobile();
      }
      return webapi.message.error({ content: data.message });
    }
    if (u_action === "captcha") {
      this.settnterval();
      this.setState({
        data: { ...this.state.data, user_id: data.data.user_id },
      });
    }
    if (u_action === "activate") {
      webapi.message.success({ content: data.message });
      // window.location.replace("/authorize/auth/login");
    }
  };

  /**
   * 业务 手机绑定
   */
  handle_mobile_bind = async (u_action) => {
    this.state.data.u_action = u_action;
    if (u_action === "captcha") {
      if (!this.state.data.mobile) {
        return webapi.modal.error({ content: "请输入手机号码" });
      }
      if (!this.state.data.captcha_number) {
        return webapi.modal.error({ content: "请输入图形验证码" });
      }
      if (this.state.captcha_btn_disabled) {
        return false;
      }
    }
    if (u_action === "activate") {
      if (!this.state.data.user_id) {
        return webapi.message.error({ content: "请获取验证码" });
      }
      if (!this.state.data.captcha_mobile) {
        return webapi.message.error({ content: "请输入短信验证码" });
      }
    }
    var data = await webapi.request.post(
      "authorize/account/mobile",
      this.state.data
    );
    if (data.status === "failure") {
      if (u_action === "captcha") {
        this.handle_chang_captcha_mobile();
      }
      return webapi.message.error({ content: data.message });
    }
    if (u_action === "captcha") {
      this.settnterval();
      this.setState({
        data: { ...this.state.data, user_id: data.data.user_id },
      });
    }
    if (u_action === "activate") {
      webapi.message.success({ content: data.message });
      this.props.history.push("/authorize/account/profile");
    }
  };
  /**
   * 业务 email 绑定
   */
  handle_email_bind = async (u_action) => {
    this.state.data.u_action = u_action;
    if (u_action === "captcha") {
      if (!this.state.data.email) {
        return webapi.modal.error({ content: "请输入电子邮件" });
      }
      if (!this.state.data.captcha_number) {
        return webapi.modal.error({ content: "请输入图形验证码" });
      }
      if (this.state.captcha_btn_disabled) {
        return false;
      }
    }
    if (u_action === "activate") {
      if (!this.state.data.user_id) {
        return webapi.message.error({ content: "请获取验证码" });
      }
      if (!this.state.data.captcha_mobile) {
        return webapi.message.error({
          content: "请输入电子邮件验证码",
        });
      }
    }
    var data = await webapi.request.post(
      "authorize/account/email",
      this.state.data
    );
    if (data.status === "failure") {
      if (u_action === "captcha") {
        this.handle_chang_captcha_mobile();
      }
      return webapi.message.error({ content: data.message });
    }
    if (u_action === "captcha") {
      this.settnterval();
      this.setState({
        data: { ...this.state.data, user_id: data.data.user_id },
      });
    }
    if (u_action === "activate") {
      webapi.message.success({ content: data.message });
      this.props.history.push("/authorize/account/profile");
    }
  };

  /**
   *
   **/

  handle_oauth = async (type, id) => {
    this.clearinterval();
    var data = await webapi.request.get("authorize/account/oauth", {
      u_action: "qrcode",
      type,
      id,
    });
    if (data.code === 10000) {
      const content = (
        <div style={{ position: "relative" }}>
          <img src={data.data.url} width="300" alt="加载中" />
        </div>
      );
      const modal = webapi.modal.warning({
        title: data.message,
        content: content,
        keyboard: false,
        onOk: () => {
          this.clearinterval();
        },
      });

      this.setinterval(
        200,
        () => {
          this.get_oauth_state(type, id, modal);
        },
        2000,
        () => {
          const content_update = (
            <div style={{ position: "relative" }}>
              <img src={data.data.url} width="300" alt="加载中" />
              <div
                className={styles.alt}
                onClick={() => {
                  modal && modal.destroy();
                  this.handle_oauth(type, id);
                }}
              >
                >
                <div className="void">
                  <i className="fa fa-refresh"></i>
                  <p className="txt">二维码失效，点击刷新</p>
                </div>
                <div className="mask"></div>
              </div>
            </div>
          );

          modal.update({
            content: content_update,
          });
        }
      );
    }
  };
  handle_profile_area_id = (value) => {
    var area_id = value[value.length - 1];
    if (area_id !== this.state.area_id) {
      this.setState({
        area_id: area_id,
      });
    }
  };
  handle_blur_idcard = async (event) => {
    if (this.state.idcard) {
      var data = await webapi.request.post("authorize/account/idcard", {
        idcard: this.state.idcard,
      });
      if (data.code === 10000) {
        this.setState({
          ucdata: {
            ...this.state.ucdata,
            idcard_model: data.idcard_model,
          },
        });
      }
    }
  };
  handle_change_idcard = (event) => {
    var val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
    if (val !== "") {
      this.setState({
        idcard: val,
      });
    }
  };
  handle_upload_before = (options, file, base64Data) => {
    this.setState({
      file: file,
      ucdata: {
        ...this.state.ucdata,
        avatar: base64Data,
      },
    });
  };

  /*----------------------3 handle end----------------------*/

  /*----------------------4 render start----------------------*/
  /**
   * 更改手机
   **/
  __render_mobile() {
    const state = this.state;
    const { data } = state;

    return (
      <Form {...this.__form_item_layout()}>
        <Form.Item label="手机号码">
          <Input
            type={"number"}
            placeholder="请输入手机号码"
            value={data.mobile}
            onChange={(t) => {
              this.handle_change_input("mobile", t);
            }}
          />
        </Form.Item>

        <Form.Item label="图形验证码">
          <Form.Item
            noStyle
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input
              type={"number"}
              maxLength={4}
              placeholder="请输入验证码"
              value={data.captcha_number}
              onChange={(t) => {
                this.handle_change_input("captcha_number", t);
              }}
              addonAfter={
                <img
                  alt=""
                  src={state.captcha_url}
                  onClick={this.handle_chang_captcha_mobile.bind(this)}
                />
              }
            />
          </Form.Item>
          <a
            href="#!"
            style={{ margin: "0 8px" }}
            onClick={() => {
              this.handle_mobile_bind("captcha");
            }}
          >
            {state.valicode_text || "获取验证码"}
          </a>
        </Form.Item>
        <Form.Item label="短信验证码">
          <Input
            type={"number"}
            maxLength={6}
            placeholder="请输入验证码"
            value={data.captcha_mobile}
            onChange={(t) => {
              this.handle_change_input("captcha_mobile", t);
            }}
          />
        </Form.Item>

        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            onClick={() => {
              this.handle_mobile_bind("activate");
            }}
          >
            绑定手机
          </Button>
        </Form.Item>
      </Form>
    );
  }
  /**
   * 更改email
   **/
  __render_email() {
    const state = this.state;
    const { data } = state;
    return (
      <Form {...this.__form_item_layout()}>
        <Form.Item label="电子邮件">
          <Input
            placeholder="请输入电子邮件"
            value={data.email}
            onChange={(t) => {
              this.handle_change_input("email", t);
            }}
          />
        </Form.Item>

        <Form.Item label="图形验证码">
          <Form.Item
            noStyle
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input
              type={"number"}
              maxLength={4}
              placeholder="请输入验证码"
              value={data.captcha_number}
              onChange={(t) => {
                this.handle_change_input("captcha_number", t);
              }}
              addonAfter={
                <img
                  alt=""
                  src={state.captcha_url}
                  onClick={this.handle_chang_captcha_mobile.bind(this)}
                />
              }
            />
          </Form.Item>
          <a
            href="#!"
            style={{ margin: "0 8px" }}
            onClick={() => {
              this.handle_email_bind("captcha");
            }}
          >
            {state.valicode_text || "获取验证码"}
          </a>
        </Form.Item>
        <Form.Item label="邮件验证码">
          <Input
            type={"number"}
            maxLength={6}
            placeholder="请输入电子邮件验证码"
            value={data.captcha_email}
            onChange={(t) => {
              this.handle_change_input("captcha_email", t);
            }}
          />
        </Form.Item>

        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            onClick={() => {
              this.handle_email_bind("activate");
            }}
          >
            绑定电子邮件
          </Button>
        </Form.Item>
      </Form>
    );
  }
  /**
   * 更改 password_protected
   **/
  __render_password_protected() {
    const state = this.state;
    const { data } = state;
    return (
      <Form {...this.__form_item_layout()}>
        <Form.Item label="图形验证码">
          <Input.Group compact>
            <Select defaultValue="Sign Up">
              <Select.Option value="Sign Up">
                图形验证码图形验证码图形验证码图形验证码
              </Select.Option>
              <Select.Option value="Sign In">Sign In</Select.Option>
            </Select>
            <Input
              placeholder="请输入电子邮件"
              value={data.email}
              onChange={(t) => {
                this.handle_change_input("email", t);
              }}
            />
          </Input.Group>
        </Form.Item>
        <Form.Item label="图形验证码">
          <Form.Item
            noStyle
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input
              type={"number"}
              maxLength={4}
              placeholder="请输入验证码"
              value={data.captcha_number}
              onChange={(t) => {
                this.handle_change_input("captcha_number", t);
              }}
              addonAfter={
                <img
                  alt=""
                  src={state.captcha_url}
                  onClick={this.handle_chang_captcha_mobile.bind(this)}
                />
              }
            />
          </Form.Item>
          <a
            href="#!"
            style={{ margin: "0 8px" }}
            onClick={() => {
              this.handle_email_bind("captcha");
            }}
          >
            {state.valicode_text || "获取验证码"}
          </a>
        </Form.Item>
        <Form.Item label="邮件验证码">
          <Input
            type={"number"}
            maxLength={6}
            placeholder="请输入电子邮件验证码"
            value={data.captcha_email}
            onChange={(t) => {
              this.handle_change_input("captcha_email", t);
            }}
          />
        </Form.Item>

        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            onClick={() => {
              this.handle_email_bind("activate");
            }}
          >
            绑定电子邮件
          </Button>
        </Form.Item>
      </Form>
    );
  }

  /**
   * 更改密码
   **/
  __render_password() {
    const state = this.state;
    const { data, ucdata } = state;
    var label = null;
    var label_val = null;
    if (ucdata.password === 10001 || ucdata.password === 20001) {
      label = "电子邮件";
      label_val = ucdata.email;
    }
    if (ucdata.password === 10002 || ucdata.password === 20002) {
      label = "手机号码";
      label_val = ucdata.mobile;
    }
    return (
      <Form {...this.__form_item_layout()}>
        <Form.Item label={label}>
          <div>{label_val}</div>
        </Form.Item>
        <Form.Item label="图形验证码">
          <Form.Item
            noStyle
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input
              type={"number"}
              style={{ width: 160 }}
              maxLength={4}
              placeholder="请输入验证码"
              value={data.captcha_number}
              onChange={(t) => {
                this.handle_change_input("captcha_number", t);
              }}
            />
            <img
              alt=""
              src={state.captcha_url}
              onClick={this.handle_chang_captcha_mobile.bind(this)}
            />
          </Form.Item>
          <a
            href="#!"
            style={{ margin: "0 8px" }}
            onClick={() => {
              this.handle_password_update("captcha");
            }}
          >
            {state.valicode_text || "获取验证码"}
          </a>
        </Form.Item>
        <Form.Item label="短信验证码">
          <Input
            type={"number"}
            maxLength={6}
            placeholder="请输入验证码"
            value={data.captcha_mobile}
            onChange={(t) => {
              this.handle_change_input("captcha_mobile", t);
            }}
          />
        </Form.Item>
        <Form.Item
          label="密码"
          rules={[{ required: true, message: "请输入密码!" }]}
          tooltip="请输入6-20位密码"
        >
          <Input.Password
            value={data.password}
            onChange={(t) => {
              this.handle_change_input("password", t);
            }}
          />
        </Form.Item>
        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            onClick={() => {
              this.handle_password_update("activate");
            }}
          >
            更改密码
          </Button>
        </Form.Item>
      </Form>
    );
  }
  __render_settings() {
    return this.__render_profile();
  }
  /**
   * 个人资料 基本设置
   **/
  __render_profile() {
    // console.log(this.state.ucdata);
    const ucdata = this.state.ucdata;
    var suffix = <span />;
    if (ucdata.idcard_model) {
      if (ucdata.idcard_model.gender === 1) {
        suffix = (
          <icons.ManOutlined
            style={{
              fontSize: 16,
              color: "#1890ff",
            }}
          />
        );
      }
      if (ucdata.idcard_model.gender === 2) {
        suffix = (
          <icons.WomanOutlined
            style={{
              fontSize: 16,
              color: "#FFC0CB",
            }}
          />
        );
      }
    }

    return (
      <div>
        <div>
          <Form
            {...this.__form_item_layout()}
            ref={this.formRef}
            onFinish={this.handle_update_submit.bind(this)}
          >
            <Form.Item label="头像">
              <ImgCrop rotate>
                <Upload
                  {...this.__upload_single_props({
                    success: this.handle_upload_before,
                  })}
                >
                  <Space align="center" size="middle">
                    <Avatar
                      size={64}
                      src={ucdata.avatar}
                      onError={<icons.UserOutlined />}
                    />

                    <Button icon={<icons.UploadOutlined />}>更换头像</Button>
                  </Space>
                </Upload>
              </ImgCrop>
            </Form.Item>
            <Form.Item name="nickname" label="昵称">
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
              <Button
                htmlType="submit"
                type="primary"
                loading={this.props.loading}
              >
                更新
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
  /**
   * 个人资料
   **/

  /**
   * 安全设置
   **/
  __render_security() {
    const ucdata = this.state.ucdata;
    const data = [
      {
        title: "账户密码",
        description:
          ucdata.password === 1
            ? "定期更改密码可增强安全性"
            : "未设置密码,请设置密码",
        actions: [<Link to="/authorize/account/password">设置</Link>],
      },
      {
        title: "手机号码",
        description: ucdata.mobile
          ? "已绑定手机:" + ucdata.mobile
          : "请绑定手机",
        actions: [
          <Link to="/authorize/account/mobile">
            {ucdata.mobile ? "更改" : "绑定"}
          </Link>,
        ],
      },

      {
        title: "备用邮箱",
        description: ucdata.email
          ? "已绑定邮箱:" + ucdata.email
          : "未设置邮箱，邮箱在忘记手机号和密码时可找回密码",
        actions: [
          <Link to="/authorize/account/email">
            {ucdata.email ? "更改" : "设置"}
          </Link>,
        ],
      },
      {
        title: "密保问题",
        description: ucdata.question
          ? "密保问题已设置，可有效保护账户安全"
          : "未设置密保问题，密保可有效保护账户安全",
        actions: [
          <Link to="/authorize/account/password_protected">
            {ucdata.question ? "更改" : "设置"}
          </Link>,
        ],
      },
    ];
    return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    );
  }
  /**
   * 账号绑定
   **/
  __render_oauth() {
    const oauth = this.state.ucdata.oauth || {};
    const data = Object.keys(oauth).map((key) => {
      var I = icons[oauth[key].icon];
      return {
        title: oauth[key].name,
        description:
          oauth[key].bind > 0 ? oauth[key].info.nickname : oauth[key].intro,
        avatar: <I className={oauth[key].classname} />,
        actions: [
          <a
            href="#!"
            onClick={() => {
              this.handle_oauth(key, oauth[key].info.id);
            }}
          >
            {oauth[key].bind > 0 ? "解绑" : "绑定"}
          </a>,
        ],
      };
    });
    return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    );
  }
  /**
   * 消息通知
   **/
  __render_notification() {
    // const ucdata = this.state.ucdata;
    const notification = this.state.ucdata.notification || {};
    const data = Object.keys(notification).map((key) => {
      var I = icons[notification[key].icon];
      return {
        title: notification[key].name,
        description: notification[key].intro,
        avatar: <I className={notification[key].classname} />,
        actions: [
          <Switch
            checkedChildren={"接收"}
            unCheckedChildren={"谢绝"}
            defaultChecked
            onChange={this.handle_notification_switch}
          />,
        ],
      };
    });

    return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    );
  }

  /*----------------------4 render end----------------------*/
}

export default connect((store) => ({ ...store }))(Account);
