// @ts-nocheck
import React from "react";
import webapi from "../utils/webapi";
import { connect } from "react-redux";
import Basic_Component from "../components/base/basic_component";
import styles from "../assets/styles/skin2.module.less";
import item from "../components/auth/items";
import Eyes_open from "../assets/images/auth/eyes_open.png";
import Eyes_close from "../assets/images/auth/eyes_close.png";
import Invite_person from "../assets/images/auth/invite_person.png";

const original_captcha_url =
  "/authorize/auth/captcha?u_action=graph&reset=1&height=30";
let customizer_styles = require("../assets/styles/skin2-313.module.less");
type State = Server.State & {
  data: {
    is_agree: boolean;
    eyes_state: boolean;
    captcha_code: string;
    captcha_type: string;
    password: string;
    account: string;
    user_id: number;
    verification_user_id: number;
  };
};
class Auth extends Basic_Component<{}, State> {
  /**
   * 构造
   */
  constructor(props: any) {
    super(props);
    this.state = this.__init_state();
    // customizer_styles = require("@/assets/auth/skin2-" +
    //   window.appid +
    //   ".less");
    // customizer_styles = require("../assets/styles/skin2-313.module.less");
    // console.log(customizer_styles, styles);
    console.log(styles);
  }

  /*----------------------0 parent start----------------------*/
  __init_state_after() {
    return {
      valicode_text: "",
      input_disabled: false, //邀请人输入框
      captcha_btn_disabled: false,
      auth_btn_disabled: true,
      data: {
        eyes_state: false, //眼睛状态
        captcha_code: "", //验证码
        captcha_type: "graph", //验证码证方式 graph slide
        password: "", //密码
        account: "", //账号
        user_id: 0,
        verification_user_id: 0,
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
    this.setState({ data: { ...this.state.data, is_agree: false } });
  };
    /**
   * render 渲染  4=render
   * @return obj
   */
  render() {
    return (
      <>
        
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
  /**
   * 对话框
   * @param content 对话框内容
   * @return void
   **/
  modal(message) {
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
    const data = await webapi.request.get("authorize/auth/check", {
      data: {
        u_action: this.state.method,
      },
    });
    this.setState({
      data: { ...this.state.data, ...data.data, ...res },
    });
    if (data.code === 10000 || data.code === 11003) {
      this.redirect(data);
    }
  };

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/

  __init_index() {
    this.__init_login();
  }
  __init_login() {
    this.check();
  }
  __init_mobile() {
    this.check();
  }
  __init_scan() {
    this.setState({
      timeout: false,
      scan_url: "/authorize/auth/qrcode?r=" + Math.random(),
    });
    setTimeout(() => {
      this.handle_qrcode_setInterval();
    }, 1000);
  }
  __init_forgot_password() {
    this.check();
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
        this.setState({ timeout: true });
      }
    );
  }
  async handle_qrcode_check() {
    let data = await webapi.request.get("authorize/auth/scan_check", {
      loading: false,
    });
    if (data.code === 10000 || data.code === 11003) {
      this.redirect(data);
    }
  }
  __init_qrcode_check() {
    window.WeixinJSBridge &&
      window.WeixinJSBridge.invoke("closeWindow", {}, function (res) {});
    window.WeixinJSBridge && window.WeixinJSBridge.call("closeWindow");
    window.location.href = "about:blank";
  }
  handle_captcha_load = () => {
    this.setState({ loading: false });
  };

  handle_draweron_close = () => {
    this.setState({ drawer_visible: false, drawer_data: {} });
  };

  /**
   * 刷新验证码
   **/
  handle_chang_captcha = () => {
    if (this.state.captcha_btn_disabled) {
      return false;
    }
    this.setState({
      loading: true,
      captcha_url: original_captcha_url + "&r=" + Math.random(),
    });
  };
  /**
   * 输入框处理
   * type
   **/
  handle_change_input = (type, val) => {
    // console.log(type, val);
    switch (type) {
      //手机号
      case "mobile":
        val = val.replace(/[^\d]/g, "");
        if (val.length > 11) {
          return false;
        }
        break;
      //密码
      case "password":
        val = val.replace(/(^\s*)|(\s*$)/g, "");
        if (val.length > 20) {
          return false;
        }
        break;
      //验证码
      case "captcha_code":
        val = val.replace(/[^\d]/g, "");
        if (val.length > 4) {
          return false;
        }
        break;
      //验证码
      case "captcha_mobile":
        val = val.replace(/[^\d]/g, "");
        if (val.length > 6) {
          return false;
        }
        break; 
      //账号
      case "account":
        val = val.replace(/(^\s*)|(\s*$)/g, "");
        if (val.length > 20) {
          return false;
        }
        break;
      //眼睛状态
      case "eyes_state":
        break;
      default:
    }

    const data = this.state.data;
    data[type] = val;
    this.setState({ data });
  };
  handle_proxy = (u_action = "activate") => {
    let method = this.__get_method("handle", "");
    //保护
    if (method in this) {
      return this[method](u_action);
    } else {
      return "";
    }
  };
  handle_keyup = (e, u_action = "activate") => {
    if (e.keyCode === 13) {
      this.handle_proxy(u_action);
    }
  };

  /**
   * 登录处理
   **/
  handle_login = async (u_action = "captcha") => {
    const data = this.state.data;
    if (this.props.server.loading) {
      return {};
    }
    if (!data.account) {
      this.modal("请输入手机号/邮箱/用户名");
      return {};
    }
    if (!data.password) {
      this.modal("请输入密码");
      return {};
    }
    if (!this.state.is_agree) {
      // return this.modal("请先同意《使用协议》和《隐私声明》");
    }
    if (!data.captcha_code) {
      if (data.captcha_type === "slide") {
        this.handle_captcha_show();
        return {};
      }
      if (data.captcha_type === "graph") {
        this.modal("请输入验证码");
        return {};
      }
    }
    data.u_action = u_action;
    const res = await webapi.request.post(`authorize/auth/login`, {
      data,
    });
    if (res.status === "failure") {
      if (u_action === "captcha") {
        data.captcha_code = null;
      }
      if (u_action === "activate") {
        data.captcha_code = null;
        if (res.code !== 11035) {
          data.password = null;
        }
      }
      this.setState({
        data,
      });
      this.handle_chang_captcha();
      this.modal(res.message);
      return res;
    }
    this.redirect(res);
  };
  /**
   * 手机号登录处理
   **/
  handle_mobile = async (u_action = "captcha") => {
    const state = this.state;
    const data = state.data;
    // console.log(data);
    if (this.props.server.loading) {
      return {};
    }
    if (data.mobile === "") {
      return this.modal("请输入手机号码");
    }
    if (!this.is_mobile_available(data.mobile)) {
      return this.modal("请输入正确的手机号码");
    }
    if (data.captcha_code === "") {
      return this.modal("请输入验证码");
    }
    if (u_action == "activate") {
      if (!data.user_id) {
        return this.modal("请获取验证码");
      }
      if (!data.captcha_mobile) {
        return this.modal("请输入验证码");
      }
    }
    if (u_action == "captcha") {
      if (state.captcha_btn_disabled) {
        return false;
      }
    }

    data.u_action = u_action;
    var res = await webapi.request.post("authorize/auth/mobile", { data });
    if (res.redirect) {
      return this.redirect(res);
    }
    if (res.status === "failure") {
      if (res.code === 11003) {
        return this.redirect(res);
      }
      if (res.code === 11036) {
        data.user_id = 0;
        data.captcha_code = "";
        data.captcha_mobile = "";
      }
      if (res.code === 11038) {
        data.mobile = "";
        data.captcha_code = "";
        data.captcha_mobile = "";
      }
      if (res.code === 11030) {
        data.captcha_code = "";
      }
      data.captcha_mobile = "";
      this.setState({ data });
      this.handle_chang_captcha();
      return this.modal(res.message);
    }
    if (u_action == "captcha") {
      this.settnterval();
      data.user_id = res.data.user_id;
      this.setState({
        data,
      });
    }
    if (u_action == "activate") {
      this.redirect(res);
    }
  };
  /**
   * 找回密码 处理
   **/
  handle_forgot_password = async (u_action = "captcha") => {
    const state = this.state;
    const data = state.data;
    // console.log(data);
    if (this.props.server.loading) {
      return false;
    }
    if (data.account === "") {
      return this.modal("请输入手机号/邮箱/用户名");
    }
    if (data.captcha_code === "") {
      return this.modal("请输入验证码");
    }
    if (u_action == "captcha") {
      if (state.captcha_btn_disabled) {
        return false;
      }
    }
    if (u_action == "verification") {
      if (data.user_id === 0) {
        return this.modal("请获取验证码");
      }
      if (data.captcha_mobile === "") {
        return this.modal("请输入验证码");
      }
    }
    if (u_action == "activate") {
      if (data.verification_user_id === 0) {
        return this.modal("请获取验证码");
      }
    }
    data.u_action = u_action;
    var res = await webapi.request.post("authorize/auth/forgot_password", {
      data,
    });
    if (res.redirect) {
      return this.redirect(res);
    }
    if (res.status === "failure") {
      if (res.code === 11003) {
        return this.redirect(res);
      }
      if (res.code === 11036) {
        data.user_id = 0;
        data.verification_user_id = 0;
        data.captcha_code = "";
        data.captcha_mobile = "";
      }
      if (res.code === 11038) {
        data.mobile = "";
        data.captcha_code = "";
        data.captcha_mobile = "";
      }
      if (res.code === 11030) {
        data.captcha_code = "";
      }
      this.setState({ data });
      this.handle_chang_captcha();
      return this.modal(res.message);
    }
    if (u_action == "captcha") {
      this.settnterval();
      data.user_id = res.data.user_id;
      this.setState({
        data,
      });
    }
    if (u_action == "verification") {
      data.verification_user_id = res.data.user_id;
      this.setState({
        data,
      });
    }
    if (u_action == "activate") {
      this.redirect(res);
    }
  };
  /**
   *退出登录
   **/

  handle_logout = async () => {
    const data = await webapi.request.post("authorize/auth/logout");
    if (data.code === 10000) {
    }
  };
  /**
   * again 处理
   **/
  handle_again = async (u_action = "captcha") => {
    if (this.props.server.loading) {
      return {};
    }
    const state = this.state;
    const data = state.data;
    if (data.captcha_code === "") {
      return this.modal("请输入验证码");
    }
    data.u_action = u_action;
    const res = await webapi.request.post("authorize/auth/again", { data });
    if (res.code === 11002) {
      this.redirect(res);
      return res;
    }

    if (res.status === "failure") {
      if (res.code === 11036) {
        data.captcha_code = "";
        data.captcha_mobile = "";
      }

      this.setState({
        data,
      });
      this.handle_chang_captcha();
      return this.modal(res.message);
    }
    if (data.u_action === "captcha") {
      this.settnterval(120);
      this.setState({
        auth_btn_disabled: false,
        data,
      });
      this.modal(res.message);
      return res;
    }
    if (data.u_action === "activate") {
      this.redirect(res);
      return res;
    }
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
    const state = this.state;
    const data = state.data;
    return (
      <item.content title="账号登录">
        {this.__render_component_account(
          "account",
          "login",
          "请输入手机号/邮箱/用户名"
        )}
        {this.__render_component_captcha_number("login")}
        {this.__render_component_password("login")}

        <item.bottom
          loading={this.props.server.loading}
          links={{ mobile: {}, scan: {}, forgot_password: {}, register: {} }}
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
    const state = this.state;
    const data = state.data;
    return (
      <item.content title="账号登录">
        {this.__render_component_account("mobile", "mobile", "请输入手机号")}
        {this.__render_component_captcha_number("mobile")}
        {this.__render_component_captcha_mobile("mobile")}

        <item.bottom
          links={{ login: {}, scan: {}, forgot_password: {}, register: {} }}
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
   * render 渲染  忘记密码
   * @return obj
   */
  __render_forgot_password() {
    const data = this.state.data;
    return (
      <>
        {this.state.data.user_id > 0 && data.verification_user_id > 0 ? (
          <item.content title="更新密码">
            {this.__render_component_password("login")}
            <item.bottom
              links={{}}
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
            {this.__render_component_account(
              "account",
              "forgot_password",
              "请输入手机号/邮箱/用户名"
            )}
            {this.__render_component_captcha_number("forgot_password")}
            {this.__render_component_captcha_mobile("forgot_password")}
            <item.bottom
              links={{ login: {}, register: {} }}
              button={{
                text: "下一步",
                click: () => {
                  this.handle_forgot_password("verification");
                },
              }}
            />
          </item.content>
        )}
      </>
    );
  }
  /**
   * render 渲染  scan
   * @return obj
   */
  __render_scan() {
    return (
      <item.content title="扫码登录">
        <div className={styles.qrcode} style={{ position: "relative" }}>
          <img src={this.state.scan_url} height="150" alt="加载中" />
          {this.state.timeout ? (
            <div
              className={styles.qrcode_check}
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
          links={{ login: {}, mobile: {}, forgot_password: {}, register: {} }}
          bottom={{ wechat: 1 }}
        />
      </item.content>
    );
  }
  /**
   * render 渲染  scan_check
   * @return obj
   */
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
          页面即将关闭,若不能自动关闭,请手动关闭即可
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
  /**
   * 验证账号
   **/
  __render_again() {
    return (
      <item.content title="验证账号">
        {this.__render_component_captcha_number("again")}
        {this.__render_component_captcha_mobile("again")}

        <item.bottom
          links={{
            login: {
              onClick: () => {
                this.handle_logout();
              },
            },
          }}
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
   * render 渲染  账号 组件
   * @return obj
   */
  __render_component_account(type, action, placeholder) {
    const data = this.state.data;
    return (
      <item.account
        onChange={(event) => {
          this.handle_change_input(type, event.target.value);
        }}
        value={data[type]}
        onKeyUp={(o) => {
          this.handle_keyup(o);
        }}
        placeholder={placeholder}
        autocomplete
      />
    );
  }
  /**
   * render 渲染  验证码 组件
   * @return obj
   */
  __render_component_captcha_number(type) {
    const state = this.state;
    return (
      <item.captcha_number
        onChange={(event) => {
          this.handle_change_input("captcha_code", event.target.value);
        }}
        captcha_type={state.data.captcha_type}
        captcha_url={state.captcha_url}
        value={state.data.captcha_code}
        chang_captcha={this.handle_chang_captcha}
        disabled={state.captcha_btn_disabled}
        load={this.handle_captcha_load}
        onKeyUp={(o) => {
          this.handle_keyup(o);
        }}
      />
    );
  }
  /**
   * render 渲染  验证码 组件
   * @return obj
   */
  __render_component_captcha_mobile(type) {
    const state = this.state;
    const data = state.data;
    return (
      <item.captcha_mobile
        onChange={(event) => {
          this.handle_change_input("captcha_mobile", event.target.value);
        }}
        input_change={data.user_id}
        valicode_text={state.valicode_text || "获取验证码"}
        value={data.captcha_mobile}
        onKeyUp={(o) => {
          this.handle_keyup(o, "captcha");
        }}
        onClick={(o) => {
          this.handle_proxy("captcha");
        }}
        captcha_btn_disabled={state.captcha_btn_disabled}
      />
    );
  }
  /**
   * render 渲染  密码 组件
   * @return obj
   */
  __render_component_password() {
    const data = this.state.data;
    return (
      <item.password
        onChange={(event) => {
          this.handle_change_input("password", event.target.value);
        }}
        value={data.password}
        onKeyUp={(o) => {
          this.handle_keyup(o);
        }}
        eyes_state={data.eyes_state}
        eyes_icon={data.eyes_state ? Eyes_open : Eyes_close}
        handle_change_eye_state={() => {
          this.handle_change_input("eyes_state", !data.eyes_state);
        }}
      />
    );
  }

  /*----------------------4 render end  ----------------------*/
} 
// export default Auth;
export default connect((store) => ({ ...(store as object) }))(Auth);
