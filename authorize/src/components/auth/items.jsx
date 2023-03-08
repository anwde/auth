import React from "react";
import { Link } from "react-router-dom";
import qs from "qs"; 
import { parse } from "../../utils/querystring";
import styles from "../../assets/auth/skin2.module.less";
// const styles={};
const query = () => parse(window.location.search.split("?")[1]);
const build_url = (uri) => {
  return uri + "?" + qs.stringify(query());
};
var account = function (props = {}) {
  return (
    <div className={styles.li}>
      <div className={styles.text}>{props.text || "账号"}:</div>
      <div className='{styles.inputbox}'>
        <input
          type={props.type || "text"}
          name={props.name || "account"}
          className={styles.input}
          id={props.id || "account"}
          placeholder={props.placeholder || "请输入邮箱/账号/手机号"}
          onChange={props.onChange}
          value={props.value || ""}
          onKeyUp={props.onKeyUp}
          autoComplete={props.autocomplete ? "on" : "off"}
          disabled={props.disabled}
        />
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
        <input
          type={props.eyes_state ? "text" : "password"}
          name={props.name || "password"}
          className={styles.input}
          id={props.id || "password"}
          placeholder={props.placeholder || "请输入密码"}
          onChange={props.onChange}
          value={props.value}
          onKeyUp={props.onKeyUp}
          autoComplete="password"
        />
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
      <div className={styles.text}>验&ensp;证&ensp;码:</div>
      <div className={styles.inputbox} style={{ position: "relative" }}>
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
  const { button = {}, links = [] } = props;
  return (
    <div className={styles.li}>
      {button.text ? (
        <div className={styles.btm_left}>
          <span
            onClick={props.loading ? () => {} : button.click}
            className={[
              styles.button,
              button.auth_btn_disabled ? styles.disabled : "",
            ].join(" ")}
          >
            {button.text}
          </span>
        </div>
      ) : (
        ""
      )}
      <div className={styles.btm_right}>
        {links.map((val, key) => {
          return (
            <Link
              key={key}
              to={build_url(val.href)}
              onClick={props.loading ? () => {} : val.onClick}
            >
              {val.text}
            </Link>
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
        <input
          type="number"
          name="captcha"
          maxLength="6"
          className={[styles.input, styles.inputcaptcha].join(" ")}
          placeholder={props.placeholder || "请输入验证码"}
          onChange={props.captcha_btn_disabled ? props.onChange : () => {} }
          value={props.value || ""}
          autoComplete={props.autocomplete ? "on" : "off"}
        />
        <a
          onClick={props.captcha_btn_disabled ? () => {} : props.onClick}
          href="#!"
          className={[
            styles.button,
            props.captcha_btn_disabled ? styles.disabled : "",
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
const component={
  captcha_number,
  password,
  account,
  bottom,
  captcha_mobile,
  captcha_account,
  invite_person,
  content,
  agreement,
}
export default component;
