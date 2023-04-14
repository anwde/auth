// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../../utils/webapi";
import Base_Chapters from "../base/chapter";

import {
  Form,
  Input,
  Pagination,
  Dropdown,
  Button,
  Badge,
  Select,
  Divider,
  Radio,
  DatePicker, Space
} from "antd";
import {
  PlusOutlined, DeleteOutlined, EditOutlined, UnorderedListOutlined, SettingFilled
} from "@ant-design/icons";

import type { Chapters as TypesChapters } from '../../books';
import moment from "moment";
const BREADCRUMB = {
  title: "章节管理",
  lists: [],
  buttons: [],
};
type State = Server.State & {
  book_id: number;
  data?: TypesChapters;
  u_action?: string;
  drawer_visible?: boolean;
  icon_visible?: boolean;
  selectedRowKeys?: [],
  checked_ids?: [],
  time_related_id?: any,
  published_u_action?: string,
  item?: { name?: string, id?: number },
  published_drawer_visible?: boolean,
  popover_visible?: boolean,
  modal_visible?: boolean,
};
class Chapters extends Base_Chapters {
  formRef = React.createRef();
  base_url = 'books/customer/';
  constructor(props) {
    super(props);
  }

  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }



  /*----------------------1 other start  ----------------------*/
  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/

  init_lists = async (
    // 第一个参数 params 查询表单和 params 参数的结合
    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
    params: T & {
      pageSize: number;
      current: number;
    },
    sort,
    filter,
  ) => {
    return await this.init_lists_p(params, sort, filter, 'customer');
  }

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  //显示内容
  handle_content = (id) => {
    this.__handle_content(id, 'customer')
  }
  //批量操作 rowSelection
  __handle_tablepro_row_selection = () => {
    //不需要显示
    return false;
  }
  //更新章节内容素材-子类需实现-构建提交数据
  __handle_material_build_data = (data) => {
    data.customer_chapters_id = this.state.data.id;
    data.customer_books_id = this.state.book_id;
    return data;
  }
  //章节-构建提交数据
  handle_chapter_submit_build_data = (data) => {
    data.customer_books_id = this.state.book_id;
    return data;
  };
  //分卷-构建提交数据
  handle_volume_dopost_build_data = (data) => {
    data.customer_books_id = this.state.book_id;
    return data;
  };

  handle_table_select_change = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  /**
   *   批量退稿
   */

  handle_revert_batch = (chapter_ids = []) => {
    this.batch_action({
      content: "退稿后，作者可以对章、卷进行操作?",
      url: "books/chapters/published",
      data: {
        ids: chapter_ids.length > 0 ? chapter_ids : this.state.selectedRowKeys,
        state: 5,
      },
    });
  };

  /**
   *   批量上线
   */
  handle_published_batch = (chapter_ids = [], state = 1) => {
    this.batch_action({
      content: "确认上线章节操作?",
      url: "books/chapters/published",
      data: {
        ids: chapter_ids.length > 0 ? chapter_ids : this.state.selectedRowKeys,
        state: state,
      },
    });
  };




  handle_filters_sort(field) {
    // const filters=this.state.filters||{};
    // filters[field]=filters[field]==='desc'?'asc':'desc';
    this.setState(
      {
        order_field: field,
        order_value: this.state.order_value === "desc" ? "asc" : "desc",
      },
      () => {
        this.__init_index();
      }
    );
  }

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/

  __render_index() {
    return this.__render_index_proxy('customer');
  }

  render_table_alert_option = (selectedRowKeys, selectedRows, onCleanSelected) => {
    return <></>
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Chapters);
