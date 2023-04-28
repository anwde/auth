// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../utils/webapi";
import Base_Chapters from "./base/chapter";

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
// 引入编辑器组件
import BraftEditor from "braft-editor";
// 引入编辑器样式
import "braft-editor/dist/index.css";
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
  base_url = 'books/';
  constructor(props) {
    super(props);
  }

  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  __init_state_after() {
    const query = webapi.utils.query() as { book_id: 0 };
    return {
      book_id: query.book_id,
      volume: {},
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null),
      drawer_visible: false,
      order_field: "idx",
      order_value: "asc",
      item: {},
      time_related_type: 1,
      time_related_id: null,
    };
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
    return await this.init_lists_p(params, sort, filter, 'books');
  }

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  //显示内容
  handle_content = (id) => {
    this.__handle_content(id, 'books')
  }

  //批量操作 rowSelection
  __handle_tablepro_row_selection = () => {
    return {
      onChange: (selectedRowKeys, selectedRows, info) => {
        // console.log(selectedRowKeys, selectedRows, info);
      },
    };
  }
  //更新章节内容素材-子类需实现-构建提交数据
  __handle_materials_build_data = (data) => {
    data.chapter_id = this.state.data.id;
    data.book_id = this.state.book_id;
    return data;
  }

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/

  __render_index() {
    return this.__render_index_proxy('books');
  }

  //自定义批量操作工具栏右侧选项区域
  render_table_alert_option = (selectedRowKeys, selectedRows, onCleanSelected) => {
    return (
      <Space size={16}>
        <Button
          type="primary"
          htmlType="submit"
          shape="round"
          onClick={() => {
            this.handle_checkbox_ids({}, () => {
              onCleanSelected();
            });
          }}
          danger
        >
          取消选择
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          shape="round"
          onClick={(e) => {
            e.preventDefault();
            this.handle_checkbox_ids(selectedRowKeys, () => {
              this.handle_checked_revert();
            });
          }}
        >
          退稿
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          shape="round"
          onClick={(e) => {
            e.preventDefault();
            this.handle_checkbox_ids(selectedRowKeys, () => {
              this.handle_checked_pass_successfully();
            });
          }}
        >
          审核通过
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          shape="round"
          onClick={(e) => {
            e.preventDefault();
            this.handle_checkbox_ids(selectedRowKeys, () => {
              this.handle_checked_sale(1);
            });
          }}
        >
          上线
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          shape="round"
          onClick={(e) => {
            e.preventDefault();
            this.handle_checkbox_ids(selectedRowKeys, () => {
              this.__handle_chapter_published_drawer_open({}, "batch");
            });
          }}
        >
          预发
        </Button>




        <a></a>

      </Space>
    );
  }
  //章节-构建提交数据
  handle_chapter_submit_build_data = (data) => {
    data.book_id = this.state.book_id;
    return data;
  };
  //分卷-构建提交数据
  handle_volume_dopost_build_data = (data) => {
    data.book_id = this.state.book_id;
    return data;
  };

  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Chapters);
