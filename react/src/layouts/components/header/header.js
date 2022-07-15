import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import webapi from "@/utils/webapi.js";
import "@/assets/scss/style.scss";
// import * as data from "./Data";
import { setCustomizer_show } from "@/redux/settings/Action";
import { Modal, Row, Col } from "antd";

class Header extends React.Component {
  /*--------------------------------------------------------------------------------
          * 构造
    --------------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = this.init_state();
    // console.log("data=>", props);
  }
  init_state() {
    const params = webapi.utils.query();
    return {
      q_temp: "",
      q: params.q || "",
      navbarSupported: false,
      item_active: 0,
      server: { menus: [] },
      isOpen: false,
      ...this.props,
      app: this.props.app || {},
      messages: [],
      notifications: [],
    };
  }
  /*--------------------------------------------------------------------------------
        * 更新 state 
        --------------------------------------------------------------------------------*/
  UNSAFE_componentWillReceiveProps(props) {
    // console.log("data=>", props);
    this.props = props;
    this.setState({ ...props }, () => {
      // console.log("newProps=>",this.state)
    });
  }
  handle_auth_logout = () => {
    // this.props.auth_logout && this.props.auth_logout();
    webapi.modal.confirm({
      title: "提示消息",
      content: "确认退出登录吗",
      onOk: () =>
        new Promise((resolve) => {
          webapi.request.post("authorize/auth/logout", {}, function (data) {
            resolve(true);
            if (data.status === "success") {
              webapi.message.success(data.message);
              webapi.cache.set(
                "bak",
                window.location.pathname + window.location.search
              );
              var url = "/authorize/auth/login";
              window.location.assign(url);
            } else {
              webapi.message.error(data.message);
            }
          });
        }),
      text: { ok: "退出登录", cancel: "取消操作" },
    });
  };
  handel_search() {
    var val = this.state.q;
    const urlParams = new URL(window.location.href);
    const params = webapi.utils.query();
    params.q = val;
    const param = webapi.utils.http_build_query(params);
    var url = urlParams.pathname + "?" + param;
    this.props.history.replace(url);
  }
  handel_search_focus() {
    // var q = this.state.q;
    // var q_temp = this.state.q_temp;
    // if (q) {
    //     this.setState({
    //         q:'',
    //         q_temp: q
    //     });
    // }
  }
  handel_search_onblur = () => {
    // var q = this.state.q;
    // var q_temp = this.state.q_temp;
    // if (q_temp) {
    //     this.setState({
    //         q: q_temp,
    //         q_temp:''
    //     });
    // }
  };
  handel_search_keyup = (e) => {
    if (e.keyCode === 13) {
      this.handel_search();
    }
  };
  handel_search_change = (event) => {
    var val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
    this.setState({
      q: val + "",
    });
  };
  handle_apps = () => {
    this.setState({
      visible: true,
    });
  };
  handle_apps_change = (application_id, customer_id) => {
    webapi.utils.setcookie("customerid", customer_id);
    webapi.utils.setcookie("customerappid", application_id);
    this.setState({
      visible: false,
    });
  };
  handle_apps_ok = () => {
    this.setState({
      visible: false,
    });
  };

  handle_apps_cancel = () => {
    this.setState({
      visible: false,
    });
  };
  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  showMobilemenu = () => {
    document.getElementById("main-wrapper").classList.toggle("show-sidebar");
  };

  sidebarHandler = () => {
    const settings = this.props.settings;
    let element = document.getElementById("main-wrapper");
    switch (settings.activeSidebarType) {
      case "full":
      case "iconbar":
        element.classList.toggle("mini-sidebar");
        if (element.classList.contains("mini-sidebar")) {
          element.setAttribute("data-sidebartype", "mini-sidebar");
        } else {
          element.setAttribute("data-sidebartype", settings.activeSidebarType);
        }
        break;

      case "overlay":
      case "mini-sidebar":
        element.classList.toggle("full");
        if (element.classList.contains("full")) {
          element.setAttribute("data-sidebartype", "full");
        } else {
          element.setAttribute("data-sidebartype", settings.activeSidebarType);
        }
        break;
      default:
    }
  };
  menus_items = (menus = []) => {
    return menus.map((item, i) => {
      var style = {};
      if (menus.length === i + 1) {
        style = { borderBottom: "none" };
      }
      return (
        <Link className="message-item" to={item.url} key={i} style={style}>
          <span className={"btn btn-circle  btn-" + item.style}>
            <i className={"fa fa-" + item.icon} />
          </span>
          <div className="mail-contnet">
            <h5 className="message-title">{item.name}</h5>
            <span className="mail-desc">{item.intro}</span>
            <span className="time">{item.time}</span>
          </div>
        </Link>
      );
    });
  };

  menus = (menus = []) => {
    return menus.map((item, i) => {
      let children = "";
      if (item.children) {
        children = (
          <UncontrolledDropdown nav inNavbar key={i}>
            <DropdownToggle nav caret>
              <i className="mdi mdi-settings font-18" />
            </DropdownToggle>
            <DropdownMenu className="mailbox  animated bounceInDown">
              <div className="message-center notifications">
                {this.menus_items(item.children)}
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      }
      return children;
    });
  };
  handle_user_profile() {
    this.setState({
      user_profile_show: !this.state.user_profile_show,
      item_active: 0,
    });
  }

  handle_customizer() {
    const settings = this.props.settings || {};
    this.handle_user_profile();
    this.props.dispatch(setCustomizer_show(!settings.customizer_show));
  }
  render() {
    const isOpen = this.state.isOpen;
    const settings = this.props.settings;
    const server = this.props.server;
    const ucdata = server.ucdata || {};
    const menus = server.menus || [];
    // const customer = this.props.server.customer || {};
    const applications = this.props.server.applications || {};
    // console.log( this.props.server)
    return (
      <>
        <Modal
          title="请选择应用"
          visible={this.state.visible}
          onOk={this.handle_apps_ok}
          onCancel={this.handle_apps_cancel}
        >
          <Row>
            {Object.keys(applications).map((val, key) => {
              return (
                <Col key={key} span={6}>
                  <a
                    href="#!"
                    onClick={() => {
                      this.handle_apps_change(
                        val,
                        applications[val].customer_id
                      );
                    }}
                  >
                    {applications[val].name}({val})
                  </a>
                </Col>
              );
            })}
          </Row>
        </Modal>
        <header
          className="topbar navbarbg"
          data-navbarbg={settings.activeNavbarBg}
        >
          <Navbar
            className={
              "top-navbar " +
              (settings.activeNavbarBg === "skin6"
                ? "navbar-light"
                : "navbar-dark")
            }
            expand="md"
          >
            <div
              className="navbar-header"
              id="logobg"
              data-logobg={settings.activeLogoBg}
            >
              {/*--------------------------------------------------------------------------------*/}
              {/* Mobile View Toggler  [visible only after 768px screen]                         */}
              {/*--------------------------------------------------------------------------------*/}
              <span
                className="nav-toggler d-block d-md-none"
                onClick={() => {
                  this.showMobilemenu();
                }}
              >
                <i className="ti-menu ti-close" />
              </span>
              {/*--------------------------------------------------------------------------------*/}
              {/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
              {/*--------------------------------------------------------------------------------*/}

              <NavbarBrand href="/">
                <b className="logo-icon">
                  <img
                    src={window.logo_icon}
                    alt="homepage"
                    className="dark-logo"
                    width="50"
                    height="50"
                  />
                  <img
                    src={window.logo_icon}
                    alt="homepage"
                    className="light-logo"
                    width="50"
                    height="50"
                  />
                </b>
                <span className="logo-text">
                  <img
                    src={window.logo_text}
                    alt="homepage"
                    className="dark-logo"
                    width="90"
                    height="50"
                  />
                  <img
                    src={window.logo_text}
                    className="light-logo"
                    alt="homepage"
                    width="180"
                    height="50"
                  />
                </span>
              </NavbarBrand>
              {/*--------------------------------------------------------------------------------*/}
              {/* Mobile View Toggler  [visible only after 768px screen]                         */}
              {/*--------------------------------------------------------------------------------*/}
              <span
                className="topbartoggler d-block d-md-none"
                onClick={() => {
                  this.toggle();
                }}
              >
                <i className="mdi mdi-menu font-18" />
              </span>
            </div>
            <Collapse
              className="navbarbg"
              isOpen={isOpen}
              navbar
              data-navbarbg={settings.activeNavbarBg}
            >
              <Nav className="float-left" navbar>
                <NavItem>
                  <NavLink
                    href="#"
                    className="d-none d-md-block"
                    onClick={() => {
                      this.sidebarHandler();
                    }}
                  >
                    <i className="mdi mdi-menu font-18" />
                  </NavLink>
                </NavItem>
                {/*--------------------------------------------------------------------------------*/}
                {/* Start Messages Dropdown                                                        */}
                {/*--------------------------------------------------------------------------------*/}
                {ucdata.messages ? (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      <i className="font-18 mdi mdi-gmail" />
                      <div className="notify">
                        <span className="heartbit"></span>
                        <span className="point"></span>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className="mailbox animated bounceInDown">
                      <div className="drop-title border-bottom">
                        You have 4 new messanges
                      </div>
                      <div className="message-center message-body">
                        {/*<!-- Message -->*/}
                        {this.state.messages.map((message, index) => {
                          return (
                            <span href="" className="message-item" key={index}>
                              <span className="user-img">
                                <img
                                  src={message.image}
                                  alt="user"
                                  className="rounded-circle"
                                  width=""
                                />
                                <span
                                  className={
                                    "profile-status pull-right " +
                                    message.status
                                  }
                                ></span>
                              </span>
                              <div className="mail-contnet">
                                <h5 className="message-title">
                                  {message.title}
                                </h5>
                                <span className="mail-desc">
                                  {message.desc}
                                </span>
                                <span className="time">{message.time}</span>
                              </div>
                            </span>
                          );
                        })}
                      </div>
                      <span
                        className="nav-link text-center link text-dark"
                        href=""
                      >
                        <b>See all e-Mails</b>{" "}
                        <i className="fa fa-angle-right" />
                      </span>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                ) : (
                  ""
                )}
                {/*--------------------------------------------------------------------------------*/}
                {/* End Messages Dropdown                                                          */}
                {/*--------------------------------------------------------------------------------*/}
                {/*--------------------------------------------------------------------------------*/}
                {/* Start Notifications Dropdown                                                   */}
                {/*--------------------------------------------------------------------------------*/}
                {ucdata.notifications ? (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      <i className="mdi mdi-check-circle font-18" />
                      <div className="notify">
                        <span className="heartbit"></span>
                        <span className="point"></span>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className="mailbox animated bounceInDown">
                      <div className="drop-title border-bottom">
                        You have 3 new Tasks
                      </div>
                      <div className="message-center notifications">
                        {/*<!-- Message -->*/}
                        {this.state.notifications.map((notification, index) => {
                          return (
                            <span className="message-item" key={index}>
                              <span
                                className={
                                  "btn btn-circle btn-" + notification.iconbg
                                }
                              >
                                <i className={notification.iconclass} />
                              </span>
                              <div className="mail-contnet">
                                <h5 className="message-title">
                                  {notification.title}
                                </h5>
                                <span className="mail-desc">
                                  {notification.desc}
                                </span>
                                <span className="time">
                                  {notification.time}
                                </span>
                              </div>
                            </span>
                          );
                        })}
                      </div>
                      <a
                        className="nav-link text-center mb-1 text-dark"
                        href=";"
                      >
                        <strong>Check all notifications</strong>{" "}
                        <i className="fa fa-angle-right" />
                      </a>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                ) : (
                  ""
                )}
                {/*--------------------------------------------------------------------------------*/}
                {/* End Notifications Dropdown                                                     */}
                {/*--------------------------------------------------------------------------------*/}
                {/*--------------------------------------------------------------------------------*/}
                {/* Start Menus Dropdown                                                     */}
                {/*--------------------------------------------------------------------------------*/}
                {this.menus(menus)}
                {/*--------------------------------------------------------------------------------*/}
                {/* End Menus Dropdown                                                     */}
                {/*--------------------------------------------------------------------------------*/}
              </Nav>
              <Nav className="ml-auto float-right" navbar>
                <NavItem>
                  <NavLink
                    href="#"
                    className="d-none d-md-flex align-items-center nav-link"
                  >
                    <div className="app-search">
                      <Input
                        type="search"
                        placeholder="搜索"
                        onBlur={() => {
                          this.handel_search_onblur();
                        }}
                        onFocus={(o) => {
                          this.handel_search_focus(o);
                        }}
                        onKeyUp={(o) => {
                          this.handel_search_keyup(o);
                        }}
                        onChange={(o) => {
                          this.handel_search_change(o);
                        }}
                      />
                    </div>
                  </NavLink>
                </NavItem>
                {/*--------------------------------------------------------------------------------*/}
                {/* Start Profile Dropdown                                                         */}
                {/*--------------------------------------------------------------------------------*/}
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle
                    nav
                    caret
                    className="pro-pic d-flex align-items-center"
                  >
                    <img
                      src={ucdata.avatar}
                      alt={ucdata.nickname}
                      className="rounded-circle"
                      width="36"
                    />
                    <span className="d-none d-md-block ml-2 font-medium">
                      {ucdata.nickname}{" "}
                      <i className="fa fa-angle-down ml-2"></i>
                    </span>
                  </DropdownToggle>
                  <DropdownMenu right className="user-dd animated flipInY">
                    <div className="d-flex no-block align-items-start border-bottom p-3 mb-2">
                      <div className="">
                        <img
                          src={ucdata.avatar}
                          alt="user"
                          className="rounded-circle"
                          width="80"
                        />
                      </div>
                      <div className="ml-2">
                        <h4 className="mb-0">{ucdata.nickname}</h4>
                        <p className=" mb-0 text-muted">
                          {ucdata.mobile ? ucdata.mobile : ucdata.email}
                        </p>
                        <p className=" mb-0 text-muted">UID:{ucdata.user_id}</p>
                        <Link
                          to="/authorize/account/profile"
                          className="btn btn-sm btn-danger text-white mt-2 btn-rounded"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>

                    <Link
                      className="dropdown-item"
                      to="/authorize/account/profile"
                    >
                      <i className="ti-user mr-1 ml-1" /> 我的账号
                    </Link>

                    <DropdownItem>
                      <i className="ti-wallet mr-1 ml-1" />
                      我的
                    </DropdownItem>
                    <DropdownItem href="/authorize/account/inbox">
                      <i className="ti-email mr-1 ml-1" /> 收件箱
                    </DropdownItem>
                    <DropdownItem divider />

                    <Link
                      className="dropdown-item"
                      to="/authorize/account/settings"
                    >
                      <i className="ti-settings mr-1 ml-1" /> 账号设置
                    </Link>

                    <a
                      className="dropdown-item"
                      href="#!"
                      onClick={() => {
                        this.handle_customizer();
                      }}
                    >
                      <i className="fa fa-eye-slash mr-1 ml-1" />
                      更改样式
                    </a> 
                    <a
                      className="dropdown-item"
                      href="#!"
                      onClick={this.handle_apps}
                    >
                      <i className="fa fa-archive mr-1 ml-1" /> 更改应用
                    </a>

                    <DropdownItem divider />
                    <DropdownItem
                      onClick={() => {
                        this.handle_auth_logout();
                      }}
                    >
                      <i className="fa fa-power-off mr-1 ml-1" /> 退出登录
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                {/*--------------------------------------------------------------------------------*/}
                {/* End Profile Dropdown                                                           */}
                {/*--------------------------------------------------------------------------------*/}
              </Nav>
            </Collapse>
          </Navbar>
        </header>
      </>
    );
  }
}

export default connect((store) => ({ ...store }))(Header);
