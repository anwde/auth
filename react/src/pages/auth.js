import React from "react";
import {
  connect
} from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import styles from "@/assets/auth/skin2.less";
import item from "@/components/auth/items.js";
import Eyes_open from "@/assets/images/auth/eyes_open.png";
import Eyes_close from "@/assets/images/auth/eyes_close.png";
import Invite_person from "@/assets/images/auth/invite_person.png";
import {
  Drawer
} from "antd";
import {
  SlideFixed
} from "@/components/captcha/index.js";
const original_captcha_url = "/auth/captcha?u_action=graph&reset=1&height=30";

let customizer_styles = {};
// console.log("data=>", styles);
class Auth extends Basic_Component {
  /**
   * 构造
   */
  constructor(props) {
    super(props);
    this.state = this.__init_state();
    customizer_styles = require("@/assets/auth/skin2-313.less");
    console.log(customizer_styles, styles);
  }

  __init_state_after() {
    return {
      valicode_text: "",
      input_disabled: false, //邀请人输入框
      captcha_btn_disabled: false,
      auth_btn_disabled: true,
      eyes_state: false,
      data: {
        captcha_code: "", //验证码
        captcha_type: "slide", //验证码证方式 graph slide
        password: "", //密码
        account: "", //账号
      },
      captcha_mobile: true,
      captcha: true,
      captcha_url: original_captcha_url,
      u_action: null,
      drawer_visible: false,
      drawer_data: {},
      is_agree: false,
      is_captcha_show: false,
      loading: false,
    };
  }
  __handle_init_before = () => {
    this.__clearinterval();
    this.setState({
      is_agree: false
    });
  };

  /**
   * render 渲染  4=render
   * @return obj
   */
  render() {
    return (
      <>
        <Drawer
          title={this.state.drawer_data.title}
          width={"61.8%"}
          onClose={this.handle_draweron_close}
          visible={this.state.drawer_visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: this.state.drawer_data.content,
            }}
          ></div>
        </Drawer>
        {this.state.is_captcha_show &&
        this.state.data.captcha_type === "slide" ? (
          <SlideFixed
            show={this.state.is_captcha_show}
            success={this.handle_captcha_success}
            complete={this.handle_captcha_complete}
            error={this.handle_captcha_error}
            onclose={this.handle_captcha_close}
          />
        ) : (
          ""
        )}

        <div
          className={[styles.container, customizer_styles.container].join(" ")}
        >
          <div
            className={[styles.content, customizer_styles.content].join(" ")}
          >
            <div
              className={[styles.spread, customizer_styles.spread].join(" ")}
            ></div>
            <div
              className={[styles.render, customizer_styles.render].join(" ")}
            >
              <div className={[styles.auth, customizer_styles.auth].join(" ")}>
                {this.__method("render")}
              </div>
            </div>
          </div>
          <footer>
            <span>版权所有：华语数媒（北京）科技有限公司 </span>
          </footer>
        </div>
      </>
    );
  }
  /*----------------------1 other start----------------------*/
  close_window() {
    webapi.utils.close_window();
  }
  /**
   * 对话框
   * @param content 对话框内容
   * @return void
   **/
  modal(message) {
    // alert(message);
    webapi.message.error(message);
  }
  redirect(data) {
    const method = data.method || "";
    if (method !== "" && method in this) {
      return this[method](data);
    }
    webapi.utils.redirect(data);
  }
  settnterval(t = 59) {
    this.__setinterval(
      t,
      (count) => {
        this.setState({
          valicode_text: "重新获取(" + count + ")",
          captcha_btn_disabled: true,
        });
      },
      1000,
      () => {
        this.setState({
          valicode_text: "重新获取",
          captcha_btn_disabled: false,
        });
      }
    );
  }
  is_mobile_available(mobile) {
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!reg.test(mobile)) {
      return false;
    } else {
      return true;
    }
  }
  check = async (res = {}) => {
    const data = await webapi.request.get("auth/check", {
      data: {
        u_action: this.state.method,
      },
    });
    this.setState({
      data: {
        ...this.state.data,
        ...data.data,
        ...res
      },
    });
    if (data.code === 10000 || data.code === 11003) {
      this.redirect(data);
    }
  };
  /**
   * 手机号 处理
   **/
  _do_mobile = async (u_action = "captcha", action) => {
    if (this.props.server.loading) {
      return {};
    }
    if (!this.state.data.mobile) {
      this.modal("请输入手机号");
      return {};
    }
    if (!this.is_mobile_available(this.state.data.mobile)) {
      this.modal("请输入手机号");
      return {};
    }
    if (u_action === "captcha") {
      if (!this.state.is_agree) {
        // return this.modal("请先同意《使用协议》和《隐私声明》");
      }
      if (!this.state.data.captcha_code) {
        this.handle_captcha_show();
        return {};
      }
    }
    console.log(this.state.data);
    if (u_action === "activate") {
      if (!this.state.data.user_id) {
        this.handle_captcha_show();
        return {};
      }
      if (!this.state.data.captcha_mobile) {
        this.modal("请输入短信验证码");
        return {};
      }
    }
    this.state.data.u_action = u_action;
    const data = await webapi.request.post(`auth/${action}`, {
      data: this.state.data,
    });
    if (data.status === "failure") {
      this.setState({
        data: {
          ...this.state.data,
          captcha_code: null
        },
      });
      this.modal(data.message);
      return data;
    }
    if (u_action === "captcha") {
      this.settnterval();
      this.setState({
        bottom_btn_disabled: false,
        data: {
          ...this.state.data,
          user_id: data.data.user_id
        },
      });
      return data;
    }
    this.redirect(data);
  };
  /**
   * 账号 处理
   **/
  _do_account = async (u_action = "captcha", action) => {
    const data = this.state.data;
    if (this.props.server.loading) {
      return {};
    }
    if (!data.mobile) {
      this.modal("请输入手机号");
      return {};
    }
    if (!data.password) {
      this.modal("请输入密码");
      return {};
    }
    if (data.captcha_type === "slide") {
      if (!data.captcha_code) {
        this.handle_captcha_show();
        return {};
      }
    }
    if (data.captcha_type === "graph") {
      if (!data.captcha_code) {
        this.modal("请输入验证码");
        return {};
      }
    }
    if (!this.state.is_agree) {
      // return this.modal("请先同意《使用协议》和《隐私声明》");
    }
    data.u_action = u_action;
    const res = await webapi.request.post(`auth/${action}`, {
      data,
    });
    if (res.status === "failure") {
      if (u_action === "captcha") {
        data.captcha_code = null;
      }
      if (u_action === "activate") {
        data.password = null;
        data.captcha_code = null;
      }
      this.setState({
        data,
      });
      this.handle_chang_captcha_mobile();
      this.modal(res.message);
      if (res.code === 11034) {
        this.handle_captcha_close();
      }
      return res;
    }
    if (u_action === "captcha") {
      const handle = `handle_${action}`;
      this[handle]("activate");
      return res;
    }
    this.redirect(res);
  };
  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/

  __init_index() {
    this.__init_login();
  }
  __init_login() {
    this.check({
      captcha_type: "slide"
    });
  }
  __init_mobile() {
    this.check();
  }
  __init_unbind() {
    this.check();
  }

  __init_forgot_password() {
    this.setState({
      u_action: "exist",
      data: {
        ...this.state.data,
        u_action: "captcha"
      },
    });
  }
  __init_scan() {
    this.setState({
      time_out: false,
      scan_url: "/auth/qrcode?r=" + Math.random(),
    });
    setTimeout(() => {
      this.handle_qrcode_setInterval();
    }, 1000);
  }
  __init_qrcode_check_test() {
    window.WeixinJSBridge &&
      window.WeixinJSBridge.invoke("closeWindow", {}, function(res) {});
    window.WeixinJSBridge && window.WeixinJSBridge.call("closeWindow");
    window.location.href = "about:blank";
  }
  async __init_bind() {
    this.check();
    const data = await webapi.request.post("auth/bind?u_action=state");
    if (data.status === "success") {
      this.setState({
        data: {
          ...this.state.data,
          ...data.data
        },
      });
    }
  }
  __init_bind_mobile() {
    this.__init_bind();
  }
  __init_again() {
    this.check();
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  handle_qrcode_setInterval() {
    this.__setinterval(
      100,
      (count) => {
        this.handle_qrcode_check();
      },
      2000,
      () => {
        this.setState({
          time_out: true
        });
      }
    );
  }
  async handle_qrcode_check() {
    let data = await webapi.request.get("auth/scan_check");
    if (data.code === 10000 || data.code === 11003) {
      this.redirect(data);
    }
  }
  handle_captcha__complete_forgot_password = async (data) => {
    const res = await webapi.request.post("auth/forgot_password", {
      data
    });
    if (res.status === "success") {
      this.settnterval();
      this.setState({
        data: {
          ...this.state.data,
          user_id: data.data.user_id,
        },
      });
    } else {
      this.settnterval();
      this.setState({
        data: {
          ...this.state.data,
          captcha_code: "",
        },
      });
      if (res.code === 11002) {
        this.redirect(res);
      }
      this.setState({
        data: {
          ...this.state.data,
          captcha_code: "",
        },
      });
    }
    return res;
  };

  handle_captcha_complete = async (captcha) => {
    let method = "handle_" + this.state.method;
    console.log(method);
    this.setState({
      data: {
        ...this.state.data,
        captcha_code: captcha,
        captcha_type: "slide",
      },
    });
    if (method in this) {
      return await this[method]("captcha");
    } else {
      return {};
    }
  };

  handle_captcha_close = () => {
    if (!this.props.server.loading) {
      //data:{...this.state.data,captcha_code:""},
      this.setState({
        is_captcha_show: false,
        captcha_btn_disabled: false
      });
    }
  };
  handle_captcha_show = () => {
    if (this.state.captcha_btn_disabled) {
      return false;
    }
    this.setState({
      is_captcha_show: true,
      captcha_btn_disabled: true
    });
  };
  handle_captcha = (u_action) => {
    const method = "handle_captcha" + this.__get_method("verify");
    console.log(method);
    if (method in this) {
      return this[method]();
    } else {
      this.handle_captcha_show();
    }
  };
  handle_captcha__verify_mobile = () => {
    this.handle_mobile("captcha");
  };
  handle_captcha__verify_bind_mobile = () => {
    this.handle_bind_mobile("captcha");
  };
  handle_captcha__verify_forgot_password = () => {
    if (!this.state.data.account) {
      this.modal("请输入邮箱/账号/手机号");
      return {};
    }
    this.handle_captcha_show();
  };
  handle_captcha_load = () => {
    this.setState({
      loading: false
    });
  };
  handle_is_agree_checkbox = () => {
    this.setState({
      is_agree: !this.state.is_agree
    });
  };
  handle_draweron_close = () => {
    this.setState({
      drawer_visible: false,
      drawer_data: {}
    });
  };
  handle_agreement = async (type) => {
    if (this.props.server.loading) {
      return false;
    }
    const data = await webapi.request.post("server/agreement", {
      data: {
        type,
      },
    });
    if (data.status === "success") {
      this.setState({
        drawer_visible: true,
        drawer_data: data.data
      });
    }
  };
  handle_forgot_password = async (u_action) => {
    this.state.data.u_action = u_action;

    if (u_action === "exist") {
      if (!this.state.data.mobile) {
        return this.modal("请输入手机号");
      }
    }
    if (u_action === "captcha") {
      if (!this.state.data.user_id) {
        return this.modal("请输入手机号");
      }
      if (this.state.captcha_btn_disabled) {
        return false;
      }
    }

    if (!this.state.data.captcha_code) {
      return this.handle_captcha_show();
    }

    if (!this.state.data.user_id) {
      return this.handle_captcha_show();
    }

    let data = await webapi.request.post("auth/forgot_password", {
      data: this.state.data,
    });
    if (data.status === "failure") {
      this.setState({
        data: {
          ...this.state.data,
          password: "",
          captcha_code: ""
        },
      });
      this.handle_chang_captcha_mobile();
      return this.modal(data.message);
    }
    if (u_action === "exist") {
      this.setState({
        u_action: "captcha",
        data: {
          ...this.state.data,
          user_id: data.data.user_id,
          u_action: "captcha",
          captcha_code: "",
        },
      });
      this.handle_chang_captcha_mobile();
    }
    if (u_action === "captcha") {
      this.settnterval();
      this.setState({
        u_action: "captcha",
        data: {
          ...this.state.data,
          user_id: data.data.user_id
        },
      });
    }
    if (u_action === "activate") {
      this.redirect(data);
    }
  };
  /**
   * 注册处理
   **/
  handle_register = async (u_action) => {
    this.state.data.u_action = u_action;
    this.state.data.account_type = "mobile";
    if (!this.state.data.mobile) {
      return this.modal("请输入手机号");
    }
    if (!this.is_mobile_available(this.state.data.mobile)) {
      return this.modal("请输入手机号");
    }
    if (u_action === "captcha") {
      if (!this.state.data.captcha_code) {
        return this.modal("请输入图片验证码");
      }
      if (this.state.captcha_btn_disabled) {
        return false;
      }
    }
    if (u_action === "activate") {
      if (!this.state.data.user_id) {
        return this.modal("请获取验证码");
      }
      if (!this.state.data.captcha_mobile) {
        return this.modal("请输入短信验证码");
      }
    }
    let data = await webapi.request.post("auth/register", {
      data: this.state.data,
    });
    if (data.status === "failure") {
      if (u_action === "captcha") {
        this.handle_chang_captcha_mobile();
        this.setState({
          data: {
            ...this.state.data,
            captcha_code: ""
          },
        });
      }
      if (u_action === "activate") {
        this.setState({
          data: {
            ...this.state.data,
            captcha_code: ""
          },
        });
      }
      return this.modal(data.message);
    }
    if (u_action === "captcha") {
      this.settnterval();
      this.setState({
        data: {
          ...this.state.data,
          user_id: Math.random()
        },
      });
    }
    if (u_action === "activate") {
      this.redirect(data);
    }
  };
  /**
   * 刷新验证码
   **/
  handle_chang_captcha_mobile = () => {
    if (this.state.captcha_btn_disabled) {
      return false;
    }
    this.setState({
      loading: true,
      captcha_url: original_captcha_url + "&r=" + Math.random(),
    });
  };
  /**
   * 账号输入框处理
   **/
  handle_change_account = (event) => {
    let val = event.target.value;
    if (val.length > 50) {
      return false;
    }
    this.setState({
      data: {
        ...this.state.data,
        account: val
      },
    });
  };
  /**
   * 手机号输入框处理
   **/
  handle_change_mobile = (event) => {
    const val = event.target.value.replace(/[^\d]/g, "");
    if (val.length > 11) {
      return false;
    }
    this.setState({
      data: {
        ...this.state.data,
        mobile: val
      },
    });
  };

  /**
   * 密码输入框处理
   **/
  handle_change_password = (event) => {
    const val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
    if (val.length > 20) {
      return false;
    }
    this.setState({
      data: {
        ...this.state.data,
        password: val
      },
    });
  };
  /**
   * confirm 密码输入框处理
   **/
  handle_change_confirm_password = (event) => {
    const val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
    if (val.length > 20) {
      return false;
    }
    this.setState({
      data: {
        ...this.state.data,
        confirm_password: val
      },
    });
  };
  /**
   * 验证码输入框处理
   **/
  handle_change_captcha_code = (event) => {
    const val = event.target.value.replace(/[^\d]/g, "");
    if (val.length > 4) {
      return false;
    }
    this.setState({
      data: {
        ...this.state.data,
        captcha_code: val
      },
    });
  };
  /**
   * 验证码输入框处理
   **/
  handle_change_captcha_mobile = (event) => {
    const val = event.target.value.replace(/[^\d]/g, "");
    if (val.length > 6) {
      return false;
    }
    this.setState({
      data: {
        ...this.state.data,
        captcha_mobile: val
      },
    });
  };
  handle_keyup = (e, v) => {
    if (e.keyCode === 13) {
      if (v === "login") {
        return this.handle_login("activate");
      }
      if (v === "again") {
        return this.handle_again("activate");
      }
      if (v === "mobile") {
        return this.handle_mobile("activate");
      }
      if (v === "bind") {
        return this.handle_bind("activate");
      }
      if (v === "bind_mobile") {
        return this.handle_bind_mobile("activate");
      }
    }
  };
  /**
   *更改眼睛状态
   **/
  handle_change_eye_state = () => {
    this.setState({
      eyes_state: !this.state.eyes_state,
    });
  };
  /**
   *退出登录
   **/

  handle_logout = async () => {
    const data = await webapi.request.post("auth/logout");
    if (data.code === 10000) {}
  };
  /**
   * 登录处理
   **/
  handle_login = async (u_action = "captcha") => {
    return await this._do_account(u_action, "login");
  };
  /**
   * 绑定处理
   **/
  handle_bind = async (u_action = "captcha") => {
    return await this._do_account(u_action, "bind");
  };
  /**
   * 登录处理
   **/
  handle_mobile = async (u_action = "captcha") => {
    return await this._do_mobile(u_action, "mobile");
  };
  /**
   * 绑定处理
   **/
  handle_bind_mobile = async (u_action = "captcha") => {
    return await this._do_mobile(u_action, "bind_mobile");
  };

  /**
   * again 处理
   **/
  handle_again = async (u_action = "captcha") => {
    if (this.props.server.loading) {
      return {};
    }
    if (u_action === "activate" && !this.state.data.captcha_code) {
      return {};
    }
    let data = this.state.data;
    data.u_action = u_action;
    let res = await webapi.request.post("auth/again", {
      data
    });
    if (data.u_action === "captcha") {
      if (res.code === 11002) {
        this.redirect(res);
        return res;
      }
      if (res.status === "success") {
        this.settnterval(120);
        return res;
      }
      this.__clearinterval();
      this.setState({
        auth_btn_disabled: false,
        u_action: "captcha",
        data: {
          ...this.state.data,
          captcha_mobile: ""
        },
      });
      this.modal(res.message);
      return res;
    }
    if (data.u_action === "activate") {
      if (res.status === "success" || res.code === 11002) {
        this.redirect(res);
        return res;
      }
    }
  };
  /**
   * unbind 处理
   **/
  handle_unbind = async (u_action) => {
    if (this.state.captcha_mobile && !this.state.data.captcha_code) {
      return this.modal("请输入图片验证码");
    }
    let d = [];
    if (u_action === "captcha") {
      if (this.state.captcha_btn_disabled) {
        return false;
      }
      d.captcha_number = "";
    }

    if (u_action === "activate") {
      if (!this.state.data.captcha_mobile) {
        return this.modal("请输入短信验证码");
      }
      if (!this.state.data.user_id) {
        return this.modal("请获取验证码");
      }
      d.captcha_mobile = "";
    }
    this.setState({
      captcha_btn_disabled: true,
    });
    this.state.data.u_action = u_action;
    let data = await webapi.request.post("auth/unbind", {
      data: {
        ...webapi.utils.query(),
        ...this.state.data,
      },
    });
    this.setState({
      captcha_btn_disabled: false,
    });
    if (data.code === 11002) {
      return this.redirect(data);
    }
    if (data.status === "failure") {
      this.setState({
        data: {
          ...this.state.data,
          ...d
        },
      });
      this.handle_chang_captcha_mobile();
      return this.modal(data.message);
    }
    if (u_action === "captcha") {
      this.settnterval();
      this.setState({
        data: {
          ...this.state.data,
          user_id: data.data.user_id
        },
      });
    }
    if (u_action === "activate") {
      this.redirect(data);
    }
  };

  /**
   * 邀请人输入框
   */
  handle_reference = () => {
    this.setState({
      input_disabled: true
    });
  };
  /**
   * 输入邀请人账号
   */
  handle_change_invite_uid = (event) => {
    let val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
    if (val.length === 0) {
      return false;
    }
    this.setState({
      data: {
        ...this.state.data,
        invite_uid: val
      },
    });
  };

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/
  /**
   * render 渲染  index
   * @return obj
   */
  __render_index() {
    return this.__render_login();
  }

  /**
   * render 渲染  登录
   * @return obj
   */
  __render_login() {
    return (
      <item.content title="账号登录">
        <item.account
          onChange={this.handle_change_mobile}
          value={this.state.data.mobile}
          onKeyUp={(o) => {
            this.handle_keyup(o, "login");
          }}
          placeholder="请输入手机号/邮箱/用户名"
          autocomplete
        />

        <item.password
          onChange={this.handle_change_password}
          value={this.state.data.password}
          onKeyUp={(o) => {
            this.handle_keyup(o, "login");
          }}
          eyes_state={this.state.eyes_state}
          eyes_icon={this.state.eyes_state ? Eyes_open : Eyes_close}
          handle_change_eye_state={this.handle_change_eye_state}
        />
        {this.state.data.captcha_type === "graph" ? (
          <item.captcha_number
            onChange={this.handle_change_captcha_code}
            captcha_url={this.state.captcha_url}
            value={this.state.data.captcha_code}
            chang_captcha={this.handle_chang_captcha_mobile}
            disabled={this.state.captcha_btn_disabled}
            load={this.handle_captcha_load}
          />
        ) : (
          ""
        )}

        <item.bottom
          loading={this.props.server.loading}
          links={[
            {
              text: "验证码登录",
              href: "/auth/mobile",
            },
            {
              text: "扫码登录",
              href: "/auth/scan",
            },
            {
              text: "忘记密码",
              href: "/auth/forgot_password",
            },
            {
              text: "注册账号",
              href: "/auth/register",
            },
          ]}
          button={{
            text: this.props.server.loading ? "登录" : "登录",
            click: () => {
              this.handle_login("activate");
            },
          }}
        />
      </item.content>
    );
  }
  /**
   * render 渲染  手机号登录账号
   * @return obj
   */
  __render_mobile() {
    return (
      <item.content title="账号登录">
        <item.account
          type="number"
          text="手机号"
          placeholder="请输入手机号"
          onChange={this.handle_change_mobile}
          value={this.state.data.mobile}
          autocomplete
          disabled={this.state.captcha_btn_disabled}
        />
        <item.captcha_mobile
          valicode_text={this.state.valicode_text || "获取验证码"}
          onChange={this.handle_change_captcha_mobile}
          value={this.state.data.captcha_mobile}
          onKeyUp={this.handle_captcha}
          onClick={this.handle_captcha}
          captcha_btn_disabled={this.state.captcha_btn_disabled}
        />

        <item.bottom
          links={[
            { text: "账号登录", href: "/auth/login" },
            {
              text: "扫码登录",
              href: "/auth/scan",
            },
            {
              text: "忘记密码",
              href: "/auth/forgot_password",
            },
            {
              text: "注册账号",
              href: "/auth/register",
            },
          ]}
          bottom={{ wechat: 1 }}
          button={{
            text: "登录",
            click: () => {
              this.handle_mobile("activate");
            },
          }}
        />
      </item.content>
    );
  }
  /**
   * render 渲染  绑定账号
   * @return obj
   */
  __render_bind() {
    return (
      <item.content title="绑定账号">
        <item.account
          onChange={this.handle_change_mobile}
          value={this.state.data.mobile}
          onKeyUp={(o) => {
            this.handle_keyup(o, "bind");
          }}
          placeholder="请输入手机号/邮箱/用户名"
          autocomplete
        />

        <item.password
          onChange={this.handle_change_password}
          value={this.state.data.password}
          onKeyUp={(o) => {
            this.handle_keyup(o, "bind");
          }}
          eyes_state={this.state.eyes_state}
          eyes_icon={this.state.eyes_state ? Eyes_open : Eyes_close}
          handle_change_eye_state={this.handle_change_eye_state}
        />
        {this.state.data.captcha_type === "graph" ? (
          <item.captcha_number
            onChange={this.handle_change_captcha_code}
            captcha_url={this.state.captcha_url}
            value={this.state.data.captcha_code}
            chang_captcha={this.handle_chang_captcha_mobile}
            disabled={this.state.captcha_btn_disabled}
            load={this.handle_captcha_load}
          />
        ) : (
          ""
        )}

        <item.bottom
          loading={this.props.server.loading}
          links={[
            {
              text: "验证码方式绑定",
              href: "/auth/bind_mobile",
            },
          ]}
          button={{
            text: this.props.server.loading ? "绑定" : "绑定",
            click: () => {
              this.handle_bind("activate");
            },
          }}
        />
      </item.content>
    );
  }

  /**
   * render 渲染  绑定手机号
   * @return obj
   */
  __render_bind_mobile() {
    return (
      <item.content title="绑定手机号">
        <item.account
          type="number"
          text="手机号"
          placeholder="请输入手机号"
          onChange={this.handle_change_mobile}
          value={this.state.data.mobile}
          autocomplete
          disabled={this.state.captcha_btn_disabled}
        />
        <item.captcha_mobile
          valicode_text={this.state.valicode_text || "获取验证码"}
          onChange={this.handle_change_captcha_mobile}
          value={this.state.data.captcha_mobile}
          onKeyUp={this.handle_captcha}
          onClick={this.handle_captcha}
          captcha_btn_disabled={this.state.captcha_btn_disabled}
        />

        <item.bottom
          links={[{ text: "密码方式绑定", href: "/auth/bind" }]}
          bottom={{ wechat: 1 }}
          button={{
            text: "绑定",
            click: () => {
              this.handle_bind_mobile("activate");
            },
          }}
        />
      </item.content>
    );
  }
  /**
   * render 渲染  忘记密码
   * @return obj
   */
  __render_forgot_password() {
    return (
      <>
        {this.state.data.user_id ? (
          <item.content title="更新密码">
            <item.password
              onChange={this.handle_change_password}
              value={this.state.data.password}
            />

            <item.bottom
              links={[]}
              button={{
                text: "重置",
                click: () => {
                  this.handle_forgot_password("activate");
                },
              }}
            />
          </item.content>
        ) : (
          <item.content title="找回密码">
            <item.account
              text="账号"
              placeholder="请输入邮箱/账号/手机号"
              onChange={this.handle_change_account}
              value={this.state.data.account}
              autocomplete
            />
            <item.captcha_mobile
              valicode_text={this.state.valicode_text || "获取验证码"}
              onChange={this.handle_change_captcha_mobile}
              value={this.state.data.captcha_mobile}
              onKeyUp={this.handle_captcha}
              onClick={this.handle_captcha}
              captcha_btn_disabled={this.state.captcha_btn_disabled}
            />
            <item.bottom
              links={[
                {
                  text: "登录账号",
                  href: "/auth/login",
                },
                {
                  text: "注册账号",
                  href: "/auth/register",
                },
              ]}
              button={{
                text: "下一步",
                click: () => {
                  this.handle_forgot_password("exist");
                },
              }}
            />
          </item.content>
        )}
      </>
    );
  }
  /**
   * 注册账号
   **/
  __render_register() {
    return (
      <item.content title="账号注册">
        <item.account
          type="number"
          text="手机号"
          placeholder="请输入手机号"
          onChange={this.handle_change_mobile}
          value={this.state.data.mobile}
        />
        <item.captcha_number
          onChange={this.handle_change_captcha_code}
          captcha_url={this.state.captcha_url}
          value={this.state.data.captcha_code}
          chang_captcha={this.handle_chang_captcha_mobile}
        />
        <item.captcha_mobile
          valicode_text={this.state.valicode_text || "获取验证码"}
          onChange={this.handle_change_captcha_mobile}
          value={this.state.data.captcha_mobile}
          onKeyUp={(o) => {
            this.handle_keyup(o, "register");
          }}
          onClick={() => {
            this.handle_register("captcha");
          }}
          captcha_btn_disabled={this.state.captcha_btn_disabled}
        />
        <item.invite_person
          icon={Invite_person}
          input_disabled={this.state.input_disabled}
          on_click_reference={this.handle_reference}
          value={this.state.data.invite_uid}
          onKeyUp={() => {
            this.handle_keyup("register");
          }}
          onChange={this.handle_change_invite_uid}
        />
        <item.bottom
          links={[
            {
              text: "忘记密码",
              href: "/auth/forgot_password",
            },
            { text: "登录账号", href: "/auth/login" },
          ]}
          button={{
            text: "注册",
            click: () => {
              this.handle_register("activate");
            },
          }}
        />
      </item.content>
    );
  }
  /**
   * 验证账号
   **/
  __render_again() {
    // console.log(this.state);
    return (
      <item.content title="验证账号">
        <item.captcha_mobile
          valicode_text={this.state.valicode_text || "获取验证码"}
          onChange={this.handle_change_captcha_mobile}
          value={this.state.data.captcha_mobile}
          onKeyUp={(o) => {
            this.handle_keyup(o, "again");
          }}
          onClick={() => {
            this.handle_again("captcha");
          }}
          captcha_btn_disabled={this.state.captcha_btn_disabled}
        />

        <item.bottom
          links={[
            {
              text: "切换账号",
              href: "/auth/login",
              onClick: () => {
                this.handle_logout();
              },
            },
          ]}
          bottom={{ wechat: 1 }}
          button={{
            auth_btn_disabled:
              this.state.auth_btn_disabled && !this.state.data.captcha_mobile
                ? true
                : false,
            text: "验证",
            click: () => {
              this.handle_again("activate");
            },
          }}
        />
      </item.content>
    );
  }
  /**
   * 解除绑定账号
   **/
  __render_unbind() {
    return (
      <item.content title="解除绑定">
        <item.captcha_number
          onChange={this.handle_change_captcha_code}
          captcha_url={this.state.captcha_url}
          value={this.state.data.captcha_code}
          chang_captcha={this.handle_chang_captcha_mobile}
        />
        <item.captcha_mobile
          valicode_text={this.state.valicode_text || "获取验证码"}
          onChange={this.handle_change_captcha_mobile}
          value={this.state.data.captcha_mobile}
          onKeyUp={(o) => {
            this.handle_keyup(o, "unbind");
          }}
          onClick={() => {
            this.handle_unbind("captcha");
          }}
          captcha_btn_disabled={this.state.captcha_btn_disabled}
        />
        <item.bottom
          bottom={{ wechat: 0 }}
          button={{
            text: "解除绑定",
            click: () => {
              this.handle_unbind("activate");
            },
          }}
        />
      </item.content>
    );
  }
  /**
   * render 渲染  scan
   * @return obj
   */
  __render_scan() {
    return (
      <item.content title="扫码登录">
        <div className={styles.qrcode}>
          <img src={this.state.scan_url} height="150" alt="加载中" />
          {this.state.time_out ? (
            <div
              className={styles.alt}
              onClick={() => {
                this.__init_scan();
              }}
            >
              <div className={styles.void}>
                <i
                  className={["fa fa-refresh", styles["fa-refresh"]].join(" ")}
                ></i>
                <p className={styles.txt}>二维码失效，点击刷新</p>
              </div>
              <div className={styles.mask}></div>
            </div>
          ) : (
            ""
          )}
        </div>
        <item.bottom
          links={[
            { text: "账号登录", href: "/auth/login" },
            {
              text: "验证码登录",
              href: "/auth/mobile",
            },
            {
              text: "忘记密码",
              href: "/auth/forgot_password",
            },
            {
              text: "注册账号",
              href: "/auth/register",
            },
          ]}
          bottom={{ wechat: 1 }}
        />
      </item.content>
    );
  }
  __render_qrcode_check() {
    return (
      <div
        className={styles.qrcode_check}
        onClick={() => {
          this.__init_qrcode_check();
        }}
      >
        <div
          className={styles.text}
          style={{
            color: " #fff",
            zIndex: 9999,
            position: "absolute",
            margin: "auto",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: "300px",
            height: "200px",
          }}
        >
          页面即将关闭,若不能自动关闭,手动关闭即可
        </div>
        <div
          className={styles.mask}
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            background: "#000",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: "0.7",
          }}
        ></div>
      </div>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({
  ...store
}))(Auth);