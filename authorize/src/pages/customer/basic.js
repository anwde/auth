import React from "react";
import Basic_Component from "../../components/base/component";
import webapi from "../../utils/webapi";
export default class Basic_Customer extends Basic_Component {
  customer = {};
  app = {};
  channels = {};
  pages_type = {};
  server_state = { channels: {}, pages_type: {} };
  formRef = React.createRef();

  /*----------------------0 parent start----------------------*/

  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/
  async get_server_state(reset = false) {
    let server_state = this.server_state && {
      channels: {},
      pages_type: {},
    };
    if (reset || Object.keys(server_state.channels).length === 0) {
      let res = await webapi.request.get("customer/server_state");
      if (res.code === 10000) {
        server_state = res.data;
      }
    }
    this.server_state = server_state;
    return server_state;
  }
  async get_app(id, reset = false) {
    let app = this.app ? (this.app[id] ? this.app[id] : {}) : {};
    if (reset || Object.keys(app).length === 0) {
      let res = await webapi.request.get(
        "customer/applications/home/get",
        {
          data: {
            id,
          }
        }
      );
      if (res.code === 10000) {
        app = res.data;
      }
    }
    this.app[id] = app;
    return app;
  }
  async get_customer(id, reset = false) {
    let customer = this.customer
      ? this.customer[id]
        ? this.customer[id]
        : {}
      : {};
    if (reset || Object.keys(customer).length === 0) {
      let res = await webapi.request.get("customer/home/get", {
        data: {
          id
        }
      });
      if (res.code === 10000) {
        customer = res.data;
      }
    }
    this.customer[id] = customer;
    return customer;
  }

  get_applications_extend_type = async (reset = false) => {
    let applications_extend_type = this.applications_extend_type || {};
    if (reset || Object.keys(applications_extend_type).length === 0) {
      applications_extend_type = webapi.cache.get("applications_extend_type");
      if (!applications_extend_type) {
        let res = await webapi.request.get(
          "customer/applications_extend/type"
        );
        if (res.code === 10000) {
          applications_extend_type = res.data;
          webapi.cache.set(
            "applications_extend_type",
            applications_extend_type,
            60 * 60 * 5
          );
        }
      }
      this.applications_extend_type = applications_extend_type;
    }
    return applications_extend_type;
  };

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  __init_state_before() {
    return {
      customer_id: this.props.match.params.customer_id || 0,
      extend_id: this.props.match.params.extend_id || 0,
      applications_id: this.props.match.params.applications_id || 0,
    };
  }
  /**
   *  列表数据
   */
  async init_lists(url, o = {}, b = {}, state = {}) {
    const data = { ...webapi.utils.query(), ...o };
    data.filters = this.state.filters;
    data.order_field = this.state.order_field;
    data.order_value = this.state.order_value;
    data.row_count = this.state.pagination.pageSize;
    data.offset = this.state.pagination.current;
    data.q = this.state.q;
    const res = await webapi.request.get(url, { data });
    let lists = [];
    if (res.code === 10000 && res.num_rows > 0) {
      lists = res.lists;
    }
    this.setState({
      ...state,
      lists: lists,
      pagination: { ...this.state.pagination, total: res.num_rows },
    });
    this.__breadcrumb(b);
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
  __handle_init_before = () => {
    // this.get_server_state();
  };
  /**
   * 集中 删除
   **/
  handle_do_delete(url, id) {
    this.__handle_delete({
      url: `${url}/delete`,
      data: { id },
    });
  }
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/

  /*----------------------4 render end  ----------------------*/
}
