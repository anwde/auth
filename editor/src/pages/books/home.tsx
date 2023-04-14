// @ts-nocheck
import React from 'react';
import Basic_Books from './base/books';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import webapi from '../../utils/webapi';
import { ProList } from '@ant-design/pro-components';
import {
  Drawer,
  DatePicker,
  Avatar, Button, Space, Tag, List, Radio, Dropdown, Modal, Form, Upload, Input, Cascader, Select, Checkbox, Row, Image
} from 'antd';
import ImgCrop from "antd-img-crop";
import moment from 'moment';
import { LikeOutlined, MessageOutlined, StarOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Books_Components from './components/books';
type State = Server.State & {
  drawer_visible: boolean;
  group: Server.data;
  category_dict: Server.data;
  server_state: Server.data;
  menus: [];
  columns: [];
  permission: [];
};
const BREADCRUMB = {
  title: '作品管理',
  lists: [
    {
      title: '作品管理',
      url: '/novel/books',
    },
  ],
  buttons: [

  ],
};
class Books extends Basic_Books<{}, State> {
  formRef = React.createRef();
  constructor(props: any) {
    super(props);
  }
  /*----------------------0 parent start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {

    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/


  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/


  dopost = async (data) => {
    return await webapi.request.post("books/home/dopost", { data, file: true });
  }


  handle_filter_drawer_show = () => {
    this.setState({
      drawer_visible: true,
    });
  };
  handle_filter_submit = () => {
    let filters = this.state.filters;
    // if (Object.keys(this.state.filters).length > 0) {
    this.setState(
      {
        drawer_visible: false,
        filters: {},
      },
      () => {
        const urlParams = new URL(window.location.href);
        const params = webapi.utils.query();
        params.filters = JSON.stringify(filters);
        const param = webapi.utils.http_build_query(params);
        var url = urlParams.pathname + "?" + param;
        this.props.history.replace(url);
        this.__init_index();
      }
    );
    // }
  };
  handle_filters_radio_change_values = (field, id, val) => {
    const filters = this.state.filters || {};
    filters[field] = {};
    if (val) {
      filters[field][id] = id;
    }
    this.setState({
      filters,
    });
  };
  handle_filters_checkbox_change_values = (field, id, check, val) => {
    // console.log(field, id, check, val);
    const filters = this.state.filters || {};
    if (!filters[field]) {
      filters[field] = {};
    }
    if (check) {
      filters[field][id] = val ? val : id;
    } else {
      delete filters[field][id];
    }
    this.setState({
      filters,
    });
  };
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  __render_index() {
    const state = this.state as unknown as State;
    const group = state.group || {};
    const category_dict = state.category_dict || {};
    const dutys = this.dutys || [];
    const filters = state.filters || {};
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
    let c = "";
    if (this.state.u_action == "sign") {
      c = this.__render_index_sign();
    }
    if (this.state.u_action == "duty") {
      c = this.__render_index_duty();
    }
    if (this.state.u_action == "edit" || this.state.u_action == "add") {
      c = this.__render_index_add_edit(this.state.u_action);
    }
    return (
      <>

        <Books_Components
          page='books'
          handleGenerateCoverImage={this.__handleGenerateCoverImage}
          dataSource={state.lists}
          pagination={state.pagination}
          request_handle={async (params = {}, sorts, filter) => {
            return await this.__handle_tablepro_request(params, sorts, filter, 'books/home/lists');
          }}
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
