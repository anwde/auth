import React from "react";
import Basic_Component from "../../components/base/component";
import webapi from "../../utils/webapi";
type D_data = {
  [key: number]: { id: number; name: string };
};
export default class Basic_Authorize<P = {}, S = {}, SS = any> extends Basic_Component {
  customer: D_data = {};
  applications: D_data = {};
  constructor(props: any) {
    super(props);
  }
  /*----------------------0 parent start----------------------*/
  async get_customer(reset = false) {
    let customer = this.customer;
    if (reset || Object.keys(customer).length === 0) {
      const res = await webapi.request.get("server/customer");
      if (res.code === 10000) {
        customer = res.data;
      }
    }
    this.customer = customer;
    return this.customer;
  }
  async get_applications(reset = false) {
    let applications = this.applications;
    if (reset || Object.keys(applications).length === 0) {
      const res = await webapi.request.get("server/applications");
      if (res.code === 10000) {
        applications = res.data;
      }
    }
    this.applications = applications;
    return this.applications;
  }
  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  /**
   *  列表数据
   */
   async __init_lists(url: string, d: Server.Query = {}, b = {}) {
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    d.q = this.state.q;
    var data = await webapi.request.get(url, {data:d});
    var lists = [];
    if (data.code === 10000 && data.num_rows > 0) {
      lists = data.lists;
    }
    this.setState({
      lists: lists,
      pagination: { ...this.state.pagination, total: data.num_rows },
    }); 
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
    /**
   *  业务初始化前 子类可重写
   * @return obj
   */
     __handle_init_before(){
       this.get_customer();
       this.get_applications();
     };
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/

  /*----------------------4 render end  ----------------------*/
}
