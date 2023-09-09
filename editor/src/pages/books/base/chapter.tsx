// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import {
  Modal,
  Tag,
  Popover,
  Space,
  Button,
  Dropdown,
  Menu,
  Drawer,
  Form,
  Input,
  DatePicker,
  Select,
  Divider,
  Radio
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SettingFilled, ArrowRightOutlined, ArrowLeftOutlined, UnorderedListOutlined } from "@ant-design/icons";

import moment from "moment";

import Basic from "./basic";
import webapi from "../../../utils/webapi";
// 引入编辑器组件
import BraftEditor from "braft-editor";
// 引入编辑器样式
import "braft-editor/dist/index.css";
const BREADCRUMB = {
  title: "",
  lists: [],
  buttons: [],
};
export default class Base_Chapters<P = {}, S = {}, SS = any> extends Basic {
  formRef = React.createRef();
  constructor(props) {
    super(props);
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
  /**
   * handle_init_after
   */
  __handle_init_after() {
    this.get_book().then((book) => {
      BREADCRUMB.lists = [
        { title: "作品管理", url: "/novel/books" },
        {
          title: book.name,
          url: "/novel/books/edit/" + this.state.book_id,
        },
      ];
    });
  }

  /*----------------------1 other start  ----------------------*/
  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/
  init_lists_p = async (
    // 第一个参数 params 查询表单和 params 参数的结合
    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
    params: T & {
      pageSize: number;
      current: number;
    },
    sort,
    filter,
    page
  ) => {
    const state = this.state;
    let d = params;
    d.filters = state.filters;
    d.q = state.q;
    d.order_field = state.order_field;
    d.order_value = state.order_value;
    d.row_count = state.pagination.pageSize;
    d.offset = state.pagination.current;
    d.book_id = state.book_id;
    d.state_delete = 1;
    const res = await webapi.request.get(page === 'customer' ? "books/customer/chapters/lists" : 'books/chapters/lists', { data: d });
    if (res.code === 10000) {
      this.setState(
        {
          lists: res.lists,
          pagination: {
            ...state.pagination,
            total: res.num_rows,
          },
        });
      return {
        data: res.lists,
        // success 请返回 true，
        // 不然 table 会停止解析数据，即使有数据
        success: true,
        // 不传会使用 data 的长度，如果是分页一定要传
        total: res.num_rows,
      };
    }

  }
  //初始化
  async __init_index() {
    const state = this.state as unknown as State;
    const book = await this.get_book(state.book_id);
    const volume = await this.get_volume_dict(state.book_id);
    const lists = [
      { title: "作品管理", url: `/${this.base_url}home` },
      { title: book.name, url: null },
    ];
    const buttons = [
      {
        title: "分卷管理",
        url: `/${this.base_url}volumes/index?book_id=${state.book_id}`,
      }
    ];
    if (book.end_of_serial == 1) {
      buttons.push({
        title: "创建新章节",
        url: `/${this.base_url}chapters/add?book_id=${state.book_id}`,
      });
    }
    this.__breadcrumb({ buttons, lists });
    this.setState(
      {
        book,
        volume,
      });
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/

  //批量操作 rowSelection
  __handle_tablepro_row_selection = () => {
    return false;
  }

  //批量操作
  batch_action(data = {}) {
    webapi.confirm({
      content: data.content,
      url: data.url,
      data: {
        ...data.data,
        u_action: "batch",
        book_id: this.state.book_id,
      },
      success: (res) => {
        if (res.code === 10000) {
          webapi.message.success(res.message);
          data.data.success ? data.data.success(res) : this.__init_index();
        } else {
          webapi.message.error(res.message);
        }
      },
    });
  }

  //批量退稿
  handle_revert_batch = (chapter_ids = []) => {
    this.batch_action({
      content: "退稿后，作者可以对章、卷进行操作?",
      url: "novel/chapter/published",
      data: {
        ids: chapter_ids.length > 0 ? chapter_ids : this.state.selectedRowKeys,
        state: 5,
      },
    });
  };

  //批量上线
  handle_published_batch = (chapter_ids = [], state = 1) => {
    this.batch_action({
      content: "确认上线章节操作?",
      url: "novel/chapter/published",
      data: {
        ids: chapter_ids.length > 0 ? chapter_ids : this.state.selectedRowKeys,
        state: state,
      },
    });
  };
  //批量删除
  handle_delete_batch = (chapter_ids = []) => {
    this.batch_action({
      url: `${this.base_url}chapters/delete`,
      data: {
        ids: chapter_ids.length > 0 ? chapter_ids : this.state.selectedRowKeys,
      },
    });
  };


  handle_checked_revert = () => {
    this.handle_checked_sale(5);
  };

  handle_checked_pass_successfully = (data = {}) => {

    if (Object.keys(this.state.checked_ids).length == 0) {
      return false;
    }
    this.batch_action({
      content: '对先审后发和先发后审的章节给予审核通过的操作?',
      url: "novel/chapter/pass_successfully",
      data: {
        ...data,
        ids: this.state.checked_ids,
        u_action: "batch",
        book_id: this.state.book_id,
      },
    });
  };
  handle_checked_sale = (state, data = {}) => {
    if (Object.keys(this.state.checked_ids).length == 0) {
      return false;
    }
    let content = "";
    if (state === 1) {
      content = "确认上线章节操作?";
    }
    if (state === 5) {
      content = "退稿后，作者可以对章、卷进行操作?";
    }
    if (state === 6) {
      content = "确认预发章节操作?";
    }
    this.batch_action({
      content: content,
      url: "novel/chapter/published",
      data: {
        ...data,
        ids: this.state.checked_ids,
        state,
        u_action: "batch",
        book_id: this.state.book_id,
      },
    });
  };




  //state_sale 状态
  handle_state_sale(id, state) {
    this.batch_action({
      content:
        "确认从本章开始设置为[" + (state == 1 ? "免费" : "收费") + "]操作?",
      url: `${this.base_url}chapters/state_sale`,

      data: {
        state,
        chapter_id: id,
      },
    });
  }
  //初始化-添加|编辑
  async __init_add_edit(u_action) {
    const state = this.state as unknown as State;
    const book = await this.get_book(state.book_id);
    let data = state.data;
    if (this.state.id) {
      const res = await webapi.request.get(`${this.base_url}chapters/get`, {
        data: {
          chapter_id: state.id
        }
      });
      if (res.code === 10000) {
        data = res.data;
      }
    }


    const query = webapi.utils.query();
    if (query.volume_id) {
      data.volume_id = query.volume_id;
    }
    data.time_related_type = 1;
    if (data.state_published == 6) {
      data.time_related_type = 2;
    }
    const volume = await this.get_volume_dict(state.book_id);
    this.setState({
      editorState: BraftEditor.createEditorState(data.content),
      volume,
      data,
      redirect: `/${this.base_url}chapters/${u_action}/${state.id}?book_id=${state.book_id}`
    });
    const lists = [
      { title: "作品管理", url: "/books/home" },
      {
        title: "章节管理",
        url: `/${this.base_url}chapters?book_id=${state.book_id}`,
      },
    ];
    const buttons = [{
      title: "返回章节管理",
      url: `/${this.base_url}chapters?book_id=${state.book_id}`,
    }];

    if (u_action === "edit") {
      if (book.end_of_serial == 1) {
        buttons.push({
          title: "创建新章节",
          url: `/${this.base_url}chapters/add?book_id=${state.book_id}`,
        });
      }
    }
    this.__breadcrumb({ buttons, lists, title: `${BREADCRUMB.title}-` + (u_action == "add" ? "添加" : "修改") });

    this.formRef.current && this.formRef.current.setFieldsValue(data);
  }
  //卷- 更换
  handle_volume_change = (v) => {
    if (v === "-1") {
      return this.props.history.replace(
        `/${this.base_url}/volumes/add?book_id=${this.state.book_id}?redirect=` + (this.state.redirect || "")

      );
    }
  };
  //卷- 输入框
  handle_volume_ipt_change = (e) => {
    this.setState({
      volume_name: e.target.value,
    });
  };
  //分卷-提交
  handle_volume_dopost = async (e) => {
    const state = this.state;
    if (this.props.server.loading) {
      return false;
    }
    if (!(e.keyCode === 13 || e.type === "click")) {
      return false;
    }
    if (!state.volume_name) {
      return webapi.message.error("请填写分卷名");
    }
    const res = await webapi.request.post(`${this.base_url}volumes/dopost`, {
      data: this.handle_volume_dopost_build_data({ name: state.volume_name })
    });

    if (res.code === 10000) {
      webapi.message.success(res.message);
      const volume = await this.get_volume_dict(state.book_id, true);
      this.setState({
        data: { ...this.state.data, volume_id: res.data.id },
        volume,
        volume_name: null,
      });
    } else {
      webapi.message.error(res.message);
    }

    // console.log(e);
  };
  //分卷-构建提交数据
  handle_volume_dopost_build_data = (data) => {
    return data;
  };
  handle_volume_select_close = () => {
    // this.setState({
    //   volume_select_open: false,
    // });
  };
  handle_volume_select_open = () => {
    // this.setState({
    //   volume_select_open: true,
    // });
  };
  //章节-提交
  handle_chapter_submit = async (data) => {
    const state = this.state;
    if (this.props.server.loading) {
      return false;
    }
    data.id = state.id;
    data.content = state.editorState.toText();
    const res = await webapi.request.post(`${this.base_url}chapters/dopost`, { data: this.handle_chapter_submit_build_data(data) });
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace(`/${this.base_url}chapters/index?book_id=${state.book_id}`);
    } else {
      webapi.message.error(res.message);
    }
  };
  //章节-构建提交数据
  handle_chapter_submit_build_data = (data) => {
    return data;
  };
  submitContent = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
  };
  characters_length(str) {
    let sLen = 0;
    try {
      //先将回车换行符做特殊处理
      str = str.replace(/(\r\n+|\s+|　+)/g, "龘");
      //处理英文字符数字，连续字母、数字、英文符号视为一个单词
      str = str.replace(/[\x00-\xff]/g, "m");
      //合并字符m，连续字母、数字、英文符号视为一个单词
      str = str.replace(/m+/g, "*");
      //去掉回车换行符
      str = str.replace(/龘+/g, "");
      //返回字数
      sLen = str.length;
    } catch (e) { }
    return sLen;
  }
  handleEditorChange = (editorState) => {
    this.setState({
      editorState,
      data: {
        ...this.state.data,
        words: this.characters_length(editorState.toText()),
      },
    });
  };
  handle_time_related_type_radio_change = (e) => {
    const time_related_type = e.target.value;
    if (this.formRef.current) {
      const data = this.formRef.current.getFieldsValue();
      data.time_related_type = time_related_type;
      this.formRef.current && this.formRef.current.setFieldsValue(data);
    }
    this.setState({
      data: { ...this.state.data, time_related_type: time_related_type },
    });
  };

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/

  //列表页
  __render_index_proxy(page) {
    const state = this.state as unknown as State;
    const volume = state.volume || {};
    const columns: ProColumns<TypesChapters>[] = [
      {
        title: "ID",
        sorter: true,
        fixed: "left",
        dataIndex: "id",
        align: "center",
        width: 100,
        render: (_, row) => {
          return <a
            onClick={(e) => {
              e.preventDefault();
              this.__handle_chapter_content({ book_id: row.book_id, chapter_id: row.id });
            }}
          >
            {row.id}
          </a>;
        },
      },
      {
        title: "序号",
        sorter: true,
        fixed: "left",
        dataIndex: "idx",
        align: "center",
        width: 100,
        render: (_, row) => {
          return <a
            onClick={(e) => {
              e.preventDefault();
              this.__handle_chapter_content({ book_id: row.book_id, chapter_id: row.id });
            }}
          >
            {row.idx}
          </a>;
        },
      },
      {
        title: "名称",
        sorter: true,
        dataIndex: "name",
        align: "center",
        render: (_, row) => {
          return <a
            onClick={(e) => {
              e.preventDefault();
              this.__handle_chapter_content({ book_id: row.book_id, chapter_id: row.id });
            }}
          >
            {row.name}
          </a>;
        },
      },

      {
        title: "分卷",
        sorter: true,
        dataIndex: "volume_id",
        align: "center",
        render: (_, row) => {
          return volume[row.volume_id] && volume[row.volume_id].name;
        },
      },
      {
        title: "状态",
        sorter: true,
        dataIndex: "model_id",
        align: "center",
        hideInSearch: true,
      },
      {
        title: "字数",
        sorter: true,
        dataIndex: "words",
        align: "center",
        hideInSearch: true,
      },


      {
        title: "发布时间",
        sorter: true,
        hideInSearch: true,
        dataIndex: "published_time",
        align: "center",
        width: 200,
        render: (_, row) => {
          return row.published_time > 0 ? moment((row.published_time as number) * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          ) : '-';
        },
      },
      {
        title: "创建时间",
        sorter: true,
        hideInSearch: true,
        dataIndex: "create_time",
        align: "center",
        width: 200,
        render: (_, row) => {
          return moment((row.create_time as number) * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        },
      },


      {
        title: "操作",
        align: "center",
        fixed: "right",
        valueType: "option",
        filters: [],
        // onFilterDropdownVisibleChange: this.handle_filterDropdownVisibleChange,
        filterIcon: (filtered: any) => (
          <SettingFilled style={{ color: filtered ? "#1890ff" : "" }} />
        ),
        filterDropdownVisible: false,
        render: (_, row) => {
          return (
            <Space>
              <Button
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                title="删除"
                onClick={() => {
                  this.handle_delete_batch([row.id], page);
                }}
              />

              <Link to={`/${this.base_url}chapters/edit/${row.id}?book_id=${state.book_id}`}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
              </Link>
              <Dropdown
                menu={{ items: this.__render_chapter_dropdown_menus_action(row, page) }}
                type="primary"
                shape="round"
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={<UnorderedListOutlined />}
                />
              </Dropdown>
            </Space>
          );
        },
      },
    ];
    return (
      <>
        <ProTable
          headerTitle={
            <>
              章节列表(<span style={{ fontSize: '11px', fontWeight: 'none' }}>共{this.state.pagination.total}章</span>)</>
          }
          rowKey={"id"}
          columns={columns}
          pagination={this.state.pagination}
          request={this.init_lists}
          onChange={this.__handle_table_change}
          scroll={{ x: 1500, y: "calc(100vh - 290px)" }}
          toolBarRender={() => {
            return [
              <Input.Search
                placeholder="搜索..."
                allowClear
                size="middle"
                enterButton
                onSearch={this.__handle_search}
                onChange={(o) => {
                  this.__handle_search_change(o);
                }}
              />
            ];
          }}
          tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
            return this.render_table_alert_option(selectedRowKeys, selectedRows, onCleanSelected);
          }}
          search={false}
          rowSelection={this.__handle_tablepro_row_selection()}
          form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              console.log(values, type);
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              values.book_id = state.book_id;
              return values;
            },
          }}
        />

        {this.__render_chapter_action_drawer_modal({ prev_id: true, next_id: true }, page)}
      </>
    );
  }
  //渲染-添加|编辑
  __render_add_edit(u_action) {
    const state = this.state as unknown as State;
    const controls = ["undo", "redo"];
    const data = state.data || {};
    // console.log("data=>", data);
    return (
      <>

        <Form ref={this.formRef} onFinish={this.handle_chapter_submit}>
          <Form.Item name='volume_id'>
            <Select
              placeholder="请选择卷或新增卷"
              onChange={this.handle_volume_change}
              bordered={false}
              style={{ borderBottom: "1px solid #d9d9d9" }}
              dropdownRender={(menus) => (
                <>
                  {menus}
                  <Divider style={{ margin: "4px 0" }} />
                  <div
                    style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                  >
                    <Input
                      style={{ flex: "auto" }}
                      onChange={this.handle_volume_ipt_change}
                      onKeyUp={(o) => {
                        this.handle_volume_dopost(o);
                      }}
                      value={this.state.volume_name || ""}
                    />
                    <a
                      style={{
                        flex: "none",
                        padding: "8px",
                        display: "block",
                        cursor: "pointer",
                      }}
                      onClick={(o) => {
                        this.handle_volume_dopost(o);
                      }}
                    >
                      <PlusOutlined /> 添加新分卷
                    </a>
                  </div>
                </>
              )}
            >
              <Select.Option value={0} key={0}>
                暂不分卷
              </Select.Option>
              {Object.keys(state.volume).map((key) => {
                return (
                  <Select.Option value={key * 1} key={key}>
                    {state.volume[key] && state.volume[key].name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item name="name">
            <Input
              placeholder="输入章节名，例如：“第五章 全球追杀令”"
              bordered={false}
              style={{ borderBottom: "1px solid #d9d9d9" }}
            />
          </Form.Item>

          <Form.Item>
            <BraftEditor
              controlsDDD={controls}
              value={state.editorState}
              onChange={this.handleEditorChange}
              onSave={this.submitContent}
              placeholder="请在这里输入章节内容"
            />
          </Form.Item>

          <Form.Item name="time_related_type">
            <div>
              <Radio.Group
                value={data.time_related_type}
                onChange={this.handle_time_related_type_radio_change}
              >
                <Radio value={1}>直发</Radio>
                <Radio value={2}>预发</Radio>
              </Radio.Group>

              {data.time_related_type == 2 ? (
                <DatePicker
                  showNow={false}
                  showTime
                  defaultValue={moment(
                    data.published_time > 0
                      ? moment(data.published_time * 1000).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                      : moment().add(1, 'days').format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                  )}
                  onChange={this.handle_published_datepicker_onChange}
                  disabledDate={this.handle_published_datepicker_disabledDate}
                  onOk={this.handle_published_datepicker_onOk}
                />
              ) : (
                ""
              )}
            </div>
          </Form.Item>

          <Form.Item name="time_related_id" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item label="">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.props.server.loading}
                shape="round"
              >
                提交保存
              </Button>
              <Link
                to={`/${this.base_url}chapters/index?book_id=${state.book_id}`}
              >
                返回
              </Link>
            </Space>
          </Form.Item>
        </Form>
      </>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
