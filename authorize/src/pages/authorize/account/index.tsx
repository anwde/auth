import React from "react"; 
import { connect } from "react-redux";
import Basic_Component from "../../../components/base/component";
import { Menu } from "antd";
import { GridContent } from "@ant-design/pro-layout";
import styles from "./style.module.less";
import { Link } from "react-router-dom";
import Base from "./base";
import Security from "./security";
import Binding from "./binding";
import Notification from "./notification";

type State = Server.State & {
  mode: "inline" | "horizontal";
} ;
class Account extends Basic_Component {
  menuMap: Record<string, React.ReactNode> = {
    index: "基本设置",
    security: "安全设置",
    binding: "账号绑定",
    notification: "新消息通知",
  };
  constructor(props: any) {
    super(props);
    this.state = this.__init_state();
  }
  __init_state_before(): {} {
    return {
      mode: "inline",
    };
  }
  __init_index=()=>{
    console.log('state=>',this.state);
  }
  __init_security=()=>{
    console.log('state=>',this.state);
  }
  
  __render_index() {
    return (
      <>
        <Base />
      </>
    );
  }
  __render_security() {
    return (
      <>
        <Security />
      </>
    );
  }
  __render_binding(){
    return (
        <>
          <Binding />
        </>
      );
  }
  __render_notification(){
    return (
        <>
          <Notification />
        </>
      );
  }
  render() {
    const state = this.state as unknown as State;
    const menus = this.menuMap;
   
    return (
      <GridContent>
        <div className={styles.main}>
          <div className={styles.leftMenu}>
            <Menu mode={state.mode} selectedKeys={[state.method]}>
              {Object.keys(menus).map((item) => (
                <Link to={`/authorize/account/${item}`} key={item}>
                  <Menu.Item eventKey={item}>{menus[item]}</Menu.Item>
                </Link>
              ))}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{menus[state.method]}</div>
            {this.__method("render")}
          </div>
        </div>
      </GridContent>
    );
  }
}
export default connect((store) => ({ ...store }))((Account));
