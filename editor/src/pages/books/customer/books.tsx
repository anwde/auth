// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from '../../../utils/webapi';
import Basic_Books from '../base/books';
import { Menu, Dropdown, Button, Pagination, Avatar, Tag, Form, Input, Space, Image, Divider } from "antd";
import { LikeOutlined, MessageOutlined, StarOutlined, UploadOutlined, CloseOutlined, UnorderedListOutlined, FontSizeOutlined, OrderedListOutlined, AreaChartOutlined } from "@ant-design/icons";
import { ProList } from '@ant-design/pro-components';
import Books_Components from '../components/books';
import moment from "moment";

const BREADCRUMB = {
  title: "作品管理",
  lists: [
    {
      title: "作品管理",
      url: "/novel/books",
    },
  ],
  buttons: [

  ],
};

class Books extends Basic_Books {
  base_url = 'books/customer/';
  formRef = React.createRef();

  /**
   * 构造
   */
  constructor(props) {
    super(props);
  }

  /*----------------------1 other start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/


  dopost = async (data) => {
    return await webapi.request.post("books/customer/books/dopost", { data, file: true });
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  __handle_page_changes = (page, page_size) => {
    const urlParams = new URL(window.location.href);
    const params = webapi.utils.query();
    params.page = page;
    const param = webapi.utils.http_build_query(params);
    var url = urlParams.pathname + "?" + param;
    this.props.history.replace(url);
    // super.__handle_page_change(page, page_size);
  };

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/

  __render_index() {
    const state = this.state;
    const customer = this.props.server.customer || {};
    const applications = this.props.server.applications || {};
    const category_dict = state.category_dict || {};
    const server_state = state.server_state || {};
    const state_sale = server_state.book ? server_state.book.sale : {};
    const sign = server_state.book
      ? server_state.book.sign
        ? server_state.book.sign
        : {}
      : {};
    const sign_type = sign.type ? sign.type : {};
    const sign_sale = sign.sale ? sign.sale : {};
    const state_sale_filters = Object.keys(state_sale).map((key) => {
      return {
        text: state_sale[key].name,
        value: key,
      };
    });
    const category_filters = Object.keys(category_dict).map((key) => {
      return {
        text: category_dict[key].name,
        value: key,
      };
    });
    //  console.log(state_sale);
    let c = "";
    if (state.u_action == "sign") {
      c = this.__render_index_sign();
    }
    if (this.state.u_action == "duty") {
      c = this.__render_index_duty();
    }
    if (state.u_action == "edit" || state.u_action == "add") {
      c = this.__render_index_add_edit(state.u_action);
    }
    const filters = this.state.filters || {};
    const dutys = this.dutys || [];
    // console.log('filters=>',this.state.filters);
    let children = (
      <>
        <Form.Item label="责编" name="duty">
          <div
            style={{
              lineHeight: "32px",
              transition: "all 0.3s",
              userSelect: "none",
            }}
          >
            {dutys.map((val) => {
              return this.__render_drawer_tag_children(
                filters,
                "duty_user_id",
                val.user_id,
                val.nickname
              );
            })}
          </div>
        </Form.Item>
        <Form.Item label="排序" name="">
          <div
            style={{
              lineHeight: "32px",
              transition: "all 0.3s",
              userSelect: "none",
            }}
          >
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "words",
              "字数"
            )}
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "last_chapter_update_time",
              "更新时间"
            )}
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "chapter_10_read_num",
              "10章完读"
            )}
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "chapter_50_read_num",
              "50章完读"
            )}
            {this.__render_drawer_tag_children(
              filters,
              "order",
              "chapter_100_read_num",
              "100章完读"
            )}
          </div>
        </Form.Item>
      </>
    );
    return (
      <>
        <Books_Components
          handleGenerateCoverImage={this.__handleGenerateCoverImage}
          page='customer'
          request_handle={async (params = {}, sorts, filter) => {
            return await this.__handle_tablepro_request(params, sorts, filter, 'books/customer/home/lists');
          }}
          dataSource={state.lists}
          pagination={state.pagination}
          metas={{
            title: {
              click: (item) => this.handle_edit(item.id, item),
            },
            subTitle: {},
            description: {

            },
            actions: {

            },
            avatar: {

            },
            content: {

            },
            extra: {}

          }
          }
        />


        {c}
        {this.__render_drawer(children)}
      </>
    );
  }

  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Books);
