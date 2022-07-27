import React from "react";
import { Link } from "react-router-dom";
import qs from "qs";
import { parse } from "querystring";
import styles from "@/assets/styles/skin2.less";
// const styles={};
const query = () => parse(window.location.search.split("?")[1]);
const build_url = (uri) => {
  return uri + "?" + qs.stringify(query());
};
console.log(styles);
var account = function (props = {}) {
  return (
    <div className={styles.li}>
      <div className={styles.text}>{props.text || "账号"}:</div>
      <div className={styles.inputbox}>
        <i className={styles.icon}>
          <svg
            className={styles.svg}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M924.4 337.8c-22.5-53.3-54.8-101.2-95.9-142.3-41.1-41.1-89-73.4-142.3-95.9C631 76.3 572.4 64.4 512 64.4c-60.4 0-119 11.8-174.2 35.2-53.3 22.5-101.2 54.8-142.3 95.9-41.1 41.1-73.4 89-95.9 142.3C76.3 393 64.4 451.6 64.4 512c0 60.4 11.8 119 35.2 174.2 22.5 53.3 54.8 101.2 95.9 142.3 41.1 41.1 89 73.4 142.3 95.9 55.2 23.3 113.8 35.2 174.2 35.2 60.4 0 119-11.8 174.2-35.2 53.3-22.5 101.2-54.8 142.3-95.9 41.1-41.1 73.4-89 95.9-142.3 23.3-55.2 35.2-113.8 35.2-174.2 0-60.4-11.9-119-35.2-174.2zM512 879.6c-89.4 0-171.4-32.1-235.1-85.3 3-103.3 105.9-186.6 231.9-186.6h6c126.2 0 229.1 83.5 231.9 187-63.7 53-145.6 84.9-234.7 84.9z m0.9-375.3c-46.8 0-84.9-38.1-84.9-84.9 0-46.8 38.1-84.9 84.9-84.9s84.9 38.1 84.9 84.9c-0.1 46.8-38.1 84.9-84.9 84.9z m301 217.2c-3.5-10.3-7.7-20.4-12.7-30.4-16.2-32.4-39.1-61.4-68.2-86.1-32.4-27.5-70.5-48.2-112-61.2 34.7-30.2 56.7-74.8 56.7-124.4 0-90.9-74-164.9-164.9-164.9S348 328.5 348 419.4c0 49.3 21.8 93.6 56.2 123.8-42.1 13-80.8 33.8-113.6 61.7-29.1 24.8-52.1 53.8-68.2 86.2-4.9 9.8-9 19.8-12.5 29.9-41.2-59.4-65.4-131.5-65.4-209.1 0-202.7 164.9-367.6 367.6-367.6 202.7 0 367.6 164.9 367.6 367.6-0.1 77.9-24.4 150.2-65.8 209.6z"></path>
          </svg>
        </i>
        <label className={styles.label}>
          <input
            type={props.type || "text"}
            name={props.name || "account"}
            className={[styles.input, styles["so-input"]].join(" ")}
            id={props.id || "account"}
            placeholder={props.placeholder || "请输入邮箱/账号/手机号"}
            onChange={props.onChange}
            value={props.value || ""}
            onKeyUp={props.onKeyUp}
            autoComplete={props.autocomplete ? "on" : "off"}
            disabled={props.disabled}
          />
        </label>
      </div>
      <div className={styles.clear} />
    </div>
  );
};
var password = function (props = {}) {
  return (
    <div className={styles.li}>
      <div className={styles.text}>{props.text || "密码"}:</div>
      <div className={styles.inputbox} style={{ position: "relative" }}>
        <i className={styles.icon}>
          <svg
            className={styles.svg}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M512 85.333333a256 256 0 0 1 256 256v85.333334h42.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v341.333333a85.333333 85.333333 0 0 1-85.333333 85.333334H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333334v-341.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667V341.333333a256 256 0 0 1 256-256z m256 426.666667H256a42.666667 42.666667 0 0 0-42.368 37.674667L213.333333 554.666667v256a42.666667 42.666667 0 0 0 37.674667 42.368L256 853.333333h512a42.666667 42.666667 0 0 0 42.368-37.674666L810.666667 810.666667v-256a42.666667 42.666667 0 0 0-42.666667-42.666667z m-256-341.333333a170.666667 170.666667 0 0 0-170.453333 162.133333L341.333333 341.333333v85.333334h341.333334V341.333333a170.666667 170.666667 0 0 0-170.666667-170.666666z"></path>
            <path d="M469.333333 597.333333m42.666667 0l0 0q42.666667 0 42.666667 42.666667l0 85.333333q0 42.666667-42.666667 42.666667l0 0q-42.666667 0-42.666667-42.666667l0-85.333333q0-42.666667 42.666667-42.666667Z"></path>
          </svg>
        </i>
        <label className={styles.label}>
          <input
            type={props.eyes_state ? "text" : "password"}
            name={props.name || "password"}
            className={styles.input}
            id={props.id || "password"}
            placeholder={props.placeholder || "请输入密码"}
            onChange={props.onChange}
            value={props.value || ""}
            onKeyUp={props.onKeyUp}
            autoComplete="password"
          />
        </label>
        {props.eyes_icon ? (
          <img
            alt=""
            className={styles.eyes}
            src={props.eyes_icon}
            onClick={props.handle_change_eye_state}
          />
        ) : (
          " "
        )}
      </div>
      <div className={styles.clear} />
    </div>
  );
};
var captcha_number = function (props = {}) {
  return (
    <div className={styles.li}>
      <div className={styles.text}>验证码:</div>
      <div className={styles.inputbox} style={{ position: "relative" }}>
        <i className={styles.icon}>
          <svg
            className={styles.svg}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M512 64l384 192-64 448-320 256-320-256-64-448 384-192z m0 71.552L197.888 292.608l53.888 377.216L512 878.08l260.224-208.128 53.888-377.28L512 135.552z"></path>
            <path d="M698.944 327.744l45.248 45.248-271.488 271.552-181.056-180.992 45.248-45.248 135.808 135.68z"></path>
          </svg>
        </i>
        <label className={styles.label}>
          <input
            type="number"
            name="captcha"
            maxLength="4"
            className={[styles.input, styles.inputcaptcha].join(" ")}
            placeholder={props.placeholder || "请输入验证码"}
            onChange={props.onChange}
            value={props.value || ""}
            autoComplete={props.autocomplete ? "on" : "off"}
            disabled={props.disabled}
            onKeyUp={props.onKeyUp}
          />
        </label>
        <div className={styles.captcha}>
          <img
            src={props.captcha_url}
            onClick={props.chang_captcha}
            onLoad={props.load}
            alt="点击刷新"
            title="点击刷新"
          />
        </div>
      </div>
      <div className={styles.clear} />
    </div>
  );
};
var agreement = (props) => {
  return (
    <div className={styles.agree}>
      <div
        className={[
          styles.icon,
          props.is_agree_value ? styles["icon-checked"] : styles["icon-check"],
        ].join(" ")}
      >
        <div
          className={styles["icon-container"]}
          onClick={props.is_agree_checkbox}
        >
          <i
            className={[styles["icon-font"], styles["icon-checked"]].join(" ")}
          ></i>{" "}
          <i className="md-icon icon-font md-icon-check check md"></i>
        </div>
      </div>
      <div className={styles.content}>
        理解并同意
        <a onClick={props.user_agreement} href="#!">
          《使用协议》
        </a>
        ,{" "}
        <a onClick={props.privacy_statement} href="#!">
          《隐私声明》
        </a>
      </div>
    </div>
  );
};
var bottom = (props) => {
  const link = {
    login: { text: "登录账号" },
    // register: { text: "注册账号" },
    mobile: { text: "验证码登录" },
    forgot_password: { text: "忘记密码" },
    scan: { text: "扫码登录" },
  };
  const { button = {}, links = {} } = props;
  return (
    <div className={styles.li}>
      {button.text ? (
        <div className={styles.btm_left}>
          <button
            onClick={props.loading ? () => {} : button.click}
            className={[
              styles.button,
              styles.btns,
              button.auth_btn_disabled ? styles.disabled : styles.primary,
            ].join(" ")}
          >
            {button.text}
          </button>
        </div>
      ) : (
        ""
      )}
      <div className={styles.btm_right}>
        {Object.keys(links || {}).map((key) => {
          return link[key] ? (
            <Link
              key={key}
              to={build_url(`/auth/${key}`)}
              onClick={props.loading ? () => {} : links[key].onClick}
            >
              {link[key]["text"]}
            </Link>
          ) : (
            <div  key={key}></div>
          );
        })}
      </div>
      {props.wechat ? (
        <div className={styles.btm_bottom}>
          <ul className={styles.list}>
            <li className={styles.dict}>
              <a href="#!">
                <img
                  alt=""
                  src={require("@/assets/images/auth/login_wechat.png").default}
                />
              </a>
            </li>
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
var captcha_mobile = (props) => {
  return (
    <div className={styles.li}>
      <div className={styles.text}>{props.text || "验证码"}:</div>
      <div className={styles.inputbox}>
        <i className={styles.icon}>
          <svg
            className={styles.svg}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M512 64l384 192-64 448-320 256-320-256-64-448 384-192z m0 71.552L197.888 292.608l53.888 377.216L512 878.08l260.224-208.128 53.888-377.28L512 135.552z"></path>
            <path d="M698.944 327.744l45.248 45.248-271.488 271.552-181.056-180.992 45.248-45.248 135.808 135.68z"></path>
          </svg>
        </i>
        <label className={styles.label}>
          <input
            type="number"
            name="captcha"
            maxLength="6"
            className={[styles.input, styles.inputcaptcha].join(" ")}
            placeholder={props.placeholder || "请输入验证码"}
            onChange={props.input_change > 0 ? props.onChange : () => {}}
            value={props.value || ""}
            autoComplete={props.autocomplete ? "on" : "off"}
          />
        </label>
        <a
          onClick={props.captcha_btn_disabled ? () => {} : props.onClick}
          href="#!"
          className={[
            styles.button,
            props.captcha_btn_disabled ? styles.disabled : styles.primary,
          ].join(" ")}
        >
          {props.valicode_text}
        </a>
      </div>
      <div className={styles.clear} />
    </div>
  );
};
var captcha_account = (props) => {
  return (
    <div className={styles.li}>
      <div className={styles.text}>登录账号:</div>
      <div className={styles.lable}>
        12389238432
        <a onClick={props.onClick} className={styles.button} href="#!">
          {props.valicode_text}
        </a>
      </div>
      <div className={styles.clear} />
    </div>
  );
};
var invite_person = (props) => {
  return (
    <>
      {props.input_disabled ? (
        <div className={styles.li}>
          <div className={styles.text}>{props.text || "邀请人"}:</div>
          <div className={styles.inputbox}>
            <input
              type={props.type || "text"}
              name={props.name || "invite_person"}
              className={styles.input}
              id={props.id || "invite_person"}
              placeholder={props.placeholder || "邀请人手机号或UID（选填）"}
              onChange={props.onChange}
              value={props.value}
              onKeyUp={props.onKeyUp}
              autoComplete={props.autocomplete ? "on" : "off"}
              disabled={props.disabled}
            />
          </div>
          <div className={styles.clear} />
        </div>
      ) : (
        <div className={styles.reference}>
          <div className={styles.title} onClick={props.on_click_reference}>
            <img src={props.icon} alt="" />
            邀请人账号
          </div>
        </div>
      )}
    </>
  );
};
var content = (props) => {
  return (
    <>
      <header className={styles.header}>{props.title}</header>
      <article className={styles.ul}>{props.children}</article>
    </>
  );
};
const component = {
  captcha_number,
  password,
  account,
  bottom,
  captcha_mobile,
  captcha_account,
  invite_person,
  content,
  agreement,
};
export default component;
