import React from "react";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import { Pagination } from "antd";
import moment from "moment";
class Comment extends Basic_Component {
  constructor(props) {
    super(props);
  }
  __init_state_after() {
    return {
      checked_all: false,
      checkeds: {},
      checked_ids:{},
    };
  }
  /*----------------------1 other start----------------------*/

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  /**
   * index  列表数据
   */
  async __init_index(d = {}) {
    d.filters = this.state.filters;
    d.q = this.state.q;
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    var data = await webapi.request.get("novel/comment/lists", d);
    var lists = [];
    if (data.code === 10000 && data.num_rows > 0) {
      lists = data.lists;
    }
    this.setState(
      {
        lists: lists,
        pagination: { ...this.state.pagination, total: data.num_rows },
      },
      () => {
        this.__handle_scroll_top();
      }
    );
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
  handle_checkbox_all = () => {
    const checked_all = !this.state.checked_all;
    const checkeds = {};
    const checked_ids={};
    this.state.lists.map((item, key) => {
      checkeds[item.id] = !this.state.checkeds[item.id];
      if(checkeds[item.id]){
        checked_ids[item.id]=item.id; 
      }else{
        delete checked_ids[item.id];
      }
    });
    // console.log(checkeds);
    this.setState({ checked_all, checkeds,checked_ids });
  };
  handle_checkbox = (id) => { 
    const checkeds = this.state.checkeds;
    const checked_ids=this.state.checked_ids;
    checkeds[id] = !this.state.checkeds[id];
    if(checkeds[id]){
      checked_ids[id]=id; 
    }else{
      delete checked_ids[id];
    } 
    this.setState({  checkeds,checked_ids });
  };
  handle_delete=(id)=>{
    // alert(id)
  }
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  __render_index() {
    return (
      <>
        <div className="main-header">
          <div className="row">
            <div className="title">
              <h2>评论管理</h2>
              <span>（共{this.state.pagination.total}条）</span>
            </div>
            <div className="col-right">
              <div className="searchBox">
                <input
                  className="input"
                  type="text"
                  placeholder="搜索"
                  onChange={(o) => {
                    this.handle_search_change(o);
                  }}
                  onKeyUp={(o) => {
                    this.handle_search_keyup(o);
                  }}
                />
                <button
                  type="button"
                  className="btn fill-secondary"
                  onClick={this.handle_search}
                >
                  <i className="icon icon-search"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="row list-control">
            <div className="col-left">
              <label
                className={
                  "feed-label checkbox " +
                  (this.state.checked_all ? "checked" : "")
                }
              >
                <input
                  type="checkbox"
                  name="a"
                  value=""
                  checked={this.state.checked_all}
                  onChange={this.handle_checkbox_all}
                />
                <span>全选</span>
              </label>
            </div>
            <div className="col-right">
              {Object.keys(this.state.checked_ids).length?(
              <>
              <a href="#" className="text-stress mr-4" title="删除">
                <i className="icon icon-failure mr-1"></i>
                <b>删除</b>
              </a>
              <a href="#" className="text-primary" title="通过审核">
                <i className="icon icon-success mr-1"></i>
                <b>通过审核</b>
              </a>
              </>
              ):('')}
            </div>
          </div>
        </div>
        <div className="main-content">
          <div className="comments-list">
            {this.state.lists.map((item, key) => {
              return (
                <div className="feed" key={key}>
                  <label className={
                  "feed-label checkbox " +
                  (this.state.checkeds[item.id] ? "checked" : "")
                }>
                    <input type="checkbox" name="a" value="" checked={this.state.checkeds[item.id]}   onChange={()=>{this.handle_checkbox(item.id)}} />
                    <span></span>
                  </label>
                  <div className="feed-avatar">
                    <a href="#" className="avatar">
                      <img src={item.avatar} alt="..." />
                    </a>
                  </div>
                  <div className="feed-body ">
                    <p className="comment">
                      <strong>{item.nickname}：</strong>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.content }}
                        className="content"
                      ></div>
                    </p>
                    <p className="time">
                      <i className="icon icon-time"></i>
                      {item.create_time > 0 &&
                        moment(item.create_time * 1000).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                    </p>
                  </div>
                  <div className="feed-control">
                    <div className="btn-group">
                      <a href="#" className="btn sm" title="删除" onClick={()=>this.handle_delete(item.id)}>
                        <i className="icon icon-failure mr-1"></i>删除
                      </a>
                      <a
                        href="#"
                        className={'btn w-7 sm '+(item.is_pass==1?'disabled':'')}
                        title="审核"
                      >
                        {item.is_pass==1?'已通过':'通过审核'}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pagination fill lg">
            <Pagination
              {...this.state.pagination}
              onChange={this.__handle_page_change}
            />
          </div>
          <div className="pagination_fill_placeholder"></div>
        </div>
      </>
    );
  }
  /*----------------------4 render end  ----------------------*/
}

export default connect((store) => ({ ...store }))(Comment);
