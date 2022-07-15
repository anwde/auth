import webapi from "@/utils/webapi.js";
import classnames from "classnames";
import React  from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Collapse, Nav } from "reactstrap";
class Sidebar extends React.Component {
  /*--------------------------------------------------------------------------------
          * 构造
    --------------------------------------------------------------------------------*/
  constructor(props) {
    super(props);
    this.state = this.init_state();
  }
  init_state() {
    const params = webapi.utils.query();
    return {
      q: params.q || "",
      expand_active: {},
      selected_active: "",
      isOpen: false,
      ...this.props,
    };
  }
  setStates = (state) => {
    this.setState({ ...this.state, state });
  };
  NSAFE_componentWillMount() {
    this.handle_init();
  }
  /*--------------------------------------------------------------------------------
    * 更新 state 
  --------------------------------------------------------------------------------*/
  NSAFE_componentWillReceiveProps(props) {
    // console.log("data=>", props);
    this.props = props;
    this.setState({ ...props }, () => {
      this.handle_init();
      // console.log("newProps=>",this.state)
    });
  }
  /*--------------------------------------------------------------------------------*/
  /*To Expand SITE_LOGO With Sidebar-Menu on Hover                                  */
  /*--------------------------------------------------------------------------------*/
  expandLogo = () => {
    document.getElementById("logobg").classList.toggle("expand-logo");
  };
  scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  handle_open_change(item) {
    const state = { expand_active: this.state.expand_active };
    if (item.children) {
      state.expand_active[item.id] = !this.state.expand_active[item.id];
    } else {
      state.selected_active = item.id;
    }

    this.setState(state);
  }
  handle_selected_active = (items = []) => {
    const url = window.location.href || ""; 
    items.map((item) => { 
      if (item.url && url.indexOf(item.url)>0) {  
        const expand_active=this.state.expand_active;
        if(item.parent_id>0){ 
          for (let idx = 0; idx < item.parent_ids.length; idx++) {
            expand_active[item.parent_ids[idx]]=true; 
          }
        }else{
          expand_active[item.id]=true;
        } 
        this.setState({
          selected_active: item.id,
          expand_active 
        });
      }
      item.children && this.handle_selected_active(item.children);
      return {};
    });
  };
  handle_init() {
    this.handle_selected_active(this.props.server.columns || []); 
  }
  get_selected_active(ids = [], id = 0){
    if(webapi.utils.in_array(this.state.selected_active, ids)){
      return true;
    }
    if (this.state.selected_active===id) {
      return true;
    }
    return false;
  }
  get_expand_active(ids = [], id = 0) {
    var expand_active = this.state.expand_active || {};
    for (let i = 0; i < ids.length; i++) {
      if (expand_active[ids[i]]) {
        return true;
      }
    }
    if (expand_active[id]) {
      return true;
    }
    return false;
  }
  get_children(data) {
    return (
      <Collapse isOpen={this.state.expand_active[data.id]}>
        <ul className="first-level">{this.get_columns(data.children)}</ul>
      </Collapse>
    );
  }
  get_columns_item(item = {}) {
    const c = (
      <>
        <i className={classnames("fa", "fa-" + item.icon)} />
        <span className="hide-menu"> {item.name} </span>
      </>
    );
    const expanded = {
      className: classnames(
        "sidebar-link",
        this.get_selected_active(item.children_ids,item.id)
          ? "active"
          : "",
        item.children ? "has-arrow" : ""
      ),
      "aria-expanded": item.children
        ? this.get_expand_active(item.children_ids, item.id)
        : false,
      "data-toggle": item.children ? "collapse" : "",
      "data-id": item.id,
    };
    
    return (
      <>
        {item.target === 1 ? (
          <a href={item.url} target="_blank"  rel="noreferrer" {...expanded}>
            {c}
          </a>
        ) : (
          <Link
            to={item.url ? item.url :"#!" }
            onClick={() => {
              this.handle_open_change(item);
            }}
            {...expanded}
          >
            {c}
          </Link>
        )}
        {item.children ? this.get_children(item) : ""}
      </>
    );
  }
  get_columns(columns = []) {
    return columns.map((item, i) => {
      return (
        <li
          className={classnames(
            "sidebar-item",
            item.children ? "children_1" : "children_0",
            this.get_selected_active(item.children_ids,item.id)
              ? "selected"
              : ""
          )}
          key={i}
          onClick={() => (item.children ? "" : this.scrollTop())}
        >
          {this.get_columns_item(item)}
        </li>
      );
    });
  }
  showMobilemenu = () => {
    if (window.innerWidth < 800) {
      document.getElementById("main-wrapper").classList.toggle("show-sidebar");
    }
  };
  render() {
    // const state = this.state;
    // const cstate = state.extrapages;
    const settings = this.props.settings;
    const server = this.props.server;
    const columns = server.columns || [];
    // console.log("data=>", this.state);
    return (
      <aside
        className="left-sidebar"
        id="sidebarbg"
        data-sidebarbg={settings.activeSidebarBg}
        onMouseEnter={this.expandLogo}
        onMouseLeave={this.expandLogo}
      >
        <div className="scroll-sidebar">
          <PerfectScrollbar className="sidebar-nav">
            <Nav id="sidebarnav">{this.get_columns(columns)}</Nav>
          </PerfectScrollbar>
        </div>
      </aside>
    );
  }
}
export default connect((store) => ({ ...store }))(Sidebar);
