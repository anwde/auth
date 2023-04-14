import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux"; 
import webapi from "../../utils/webapi";
import Basic_Chapter from "./basic_chapter";
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
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
// 引入编辑器组件
import BraftEditor from "braft-editor";
// 引入编辑器样式
import "braft-editor/dist/index.css";

import moment from "moment";
const BREADCRUMB = {
  title: "作品管理",
  lists: [{ title: "作品管理", url: "/novel/books" }],
  buttons: [],
};
class Chapter extends Basic_Chapter {
  formRef = React.createRef();

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
    // 创建一个空的editorState作为初始值
    return {
      volume: {},
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
  async __init_index() {
    let book = await this.get_book();
    let lists = [
      { title: "作品管理", url: "/novel/books" },
      { title: book.name, url: "/novel/books/edit/" + book.id },
    ];
    let buttons = [];
    if (book.end_of_serial == 1) {
      buttons.push({
        title: "创建新章节",
        url: "/novel/chapter/add/" + this.state.book_id,
      });
    }
    this.__breadcrumb({ buttons, lists });
    const volume = await this.get_volume({ data_source: "dict" });
    let d = {};
    d.filters = this.state.filters;
    d.q = this.state.q;
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    d.book_id = this.state.book_id;
    d.state_delete = [1, 3];
    const res = await webapi.request.get("novel/chapter/lists", d);
    if (res.code === 10000) {
      this.setState(
        {
          data: book,
          volume,
          lists: res.lists,
          pagination: {
            ...this.state.pagination,
            total: res.num_rows,
          },
        },
        () => {
          this.__handle_scroll_top();
        }
      );
    }
  }

  async __init_add_edit(u_action) {
    this.get_book().then((book) => {
      var lists = [
        { title: "作品管理", url: "/novel/books" },
        { title: book.name, url: "/novel/books/edit/" + book.id },
        {
          title: "章节管理",
          url: "/novel/chapter/index/" + this.state.book_id,
        },
      ];
      var buttons = [];
      if (u_action === "edit") {
        if (book.end_of_serial == 1) {
          buttons.push({
            title: "创建新章节",
            url: "/novel/chapter/add/" + this.state.book_id,
          });
        }
      }

      this.__breadcrumb({ buttons, lists });
    });

    let data = {};
    if (this.state.id) {
      var res = await webapi.request.get("novel/chapter/get", {
        chapter_id: this.state.id,
      });
      if (res.code === 10000) {
        data = res.data;
      }
    }
    var query = webapi.utils.query();
    if (query.volume_id) {
      data.volume_id = query.volume_id;
    }
    data.time_related_type = 1;
    if (data.state_published == 6) {
      data.time_related_type = 2;
    }
    // console.log("data=>", data);
    let volume = await this.get_volume({ data_source: "dict" }, true);
    this.setState({
      editorState: BraftEditor.createEditorState(data.content),
      volume,
      data,
      redirect:
        "/novel/chapter/" +
        u_action +
        "/" +
        this.state.book_id +
        "/" +
        this.state.id,
    });
    this.formRef.current && this.formRef.current.setFieldsValue(data);
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  /**
   *   更换换卷
   */
  handle_volume_change = (v) => {
    if (v === "-1") {
      return this.props.history.replace(
        "/novel/volume/add/" +
          this.state.book_id +
          "?redirect=" +
          this.state.redirect || ""
      );
    }
  };
  handle_volume_ipt_change = (e) => {
    this.setState({
      volume_name: e.target.value,
    });
  };
  handle_volume_dopost = async (e) => {
    if (this.props.server.loading) {
      return false;
    }
    if (!(e.keyCode === 13 || e.type === "click")) {
      return false;
    }
    if (!this.state.volume_name) {
      return webapi.message.error("请填写分卷名");
    }
    var res = await webapi.request.post("novel/volume/dopost", {
      book_id: this.state.book_id,
      name: this.state.volume_name,
    });

    if (res.code === 10000) {
      webapi.message.success(res.message);
      let volume = await this.get_volume({ data_source: "dict" }, true);
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

  handle_submit = async (value) => {
    if (this.props.server.loading) {
      return false;
    }
    value.book_id = this.state.book_id;
    value.chapter_id = this.state.id;
    value.content = this.state.editorState.toText();
    var res = await webapi.request.post("novel/chapter/dopost", value);
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/novel/chapter/index/" + value.book_id);
    } else {
      webapi.message.error(res.message);
    }
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
      url: "novel/chapter/published",
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
      url: "novel/chapter/published",
      data: {
        ids: chapter_ids.length > 0 ? chapter_ids : this.state.selectedRowKeys,
        state: state,
      },
    });
  };
  /**
   *   批量删除
   */
  handle_delete_batch = (chapter_ids = []) => {
    this.batch_action({
      url: "novel/chapter/delete",
      data: {
        ids: chapter_ids.length > 0 ? chapter_ids : this.state.selectedRowKeys,
      },
    });
  };
  /**
   *   state_sale
   */
  handle_state_sale(id, state) {
    this.batch_action({
      content:
        "确认从本章开始设置为[" + (state == 1 ? "免费" : "收费") + "]操作?",
      url: "novel/chapter/state_sale",

      data: {
        state,
        chapter_id: id,
      },
    });
  }
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
    } catch (e) {}
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
  __render_index() {
    const book = this.state.data || {};
    const order_field = this.state.order_field;
    const order_value = this.state.order_value;
    const server_state = this.server_state || {};
    const book_sale = server_state.book ? server_state.book.sale : {};
    const book_published = server_state.published
      ? server_state.book.published
      : {};
    const book_delete = server_state.delete ? server_state.book.delete : {};
    const chapter_delete = server_state.chapter
      ? server_state.chapter.delete
      : {};
    const chapter_published = server_state.chapter
      ? server_state.chapter.published
      : {};
    const data = this.state.data;
    const volume = this.state.volume || {};
    const selectedRowKeys = this.state.selectedRowKeys || [];
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handle_table_select_change,
    };
    const filters = Object.keys(chapter_published).map((key) => {
      return { text: chapter_published[key].name, value: key };
    });
    const volume_filters = Object.keys(volume).map((key) => {
      return { text: volume[key].name, value: key };
    });

    return (
      <>
        <div className="main-header">
          <div className="row">
            <div className="title">
              <h2>章节管理</h2>
              <span>（共{this.state.pagination.total}章）</span>
            </div>
            <div className="col-right">
              <div className="searchBox">
                <input
                  className="input"
                  type="text"
                  onChange={(o) => {
                    this.__handle_search_change(o);
                  }}
                  onKeyUp={(o) => {
                    this.__handle_search_keyup(o);
                  }}
                  placeholder="搜索章节"
                />
                <button
                  type="button"
                  className="btn fill-secondary"
                  onClick={this.__handle_search}
                >
                  <i className="icon icon-search"></i>
                </button>
              </div>
              <div className="btn-group">
                <Link className="btn w-8 round" to="/novel/books">
                  <i className="icon icon-home mr-1"></i> 作品管理
                </Link>
                <Link
                  className="btn w-8 round"
                  to={"/novel/volume/index/" + this.state.book_id}
                >
                  <i className="icon icon-pile mr-1"></i> 分卷管理
                </Link>
                <Link
                  className="btn w-8 round"
                  to={"/novel/chapter/add/" + this.state.book_id}
                >
                  <i className="icon icon-collection mr-1"></i>添加章节
                </Link>
              </div>
            </div>
          </div>

          <div className="row list-control">
            <div className="col-left">
              <label
                className={
                  "feed-label checkbox " +
                  (this.state.checkbox_all ? "checked" : "")
                }
                onClick={this.handle_checkbox_all}
              >
                <span>全选/反选</span>
              </label>
            </div>
            {Object.keys(this.state.checked_ids).length ? (
              <div className="col-right">
                <a
                  className="text-stress mr-4"
                  title="删除"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handle_checked_revert();
                  }}
                >
                  <i className="icon icon-rejection mr-1"></i>
                  <b>退稿</b>
                </a>
                <a
                  className="text-green mr-4"
                  title="审核通过"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handle_checked_pass_successfully();
                  }}
                >
                  <i className="icon icon-publish mr-1"></i>
                  <b>审核通过</b>
                </a>
                <a
                  className="text-primary mr-4"
                  title="上线"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handle_checked_sale(1);
                  }}
                >
                  <i className="icon icon-success mr-1"></i>
                  <b>上线</b>
                </a>

                <a
                  className="text-mint"
                  title="预发"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handle_published_drawer_open({}, "batch");
                  }}
                >
                  <i className="icon icon-time mr-1"></i>
                  <b>预发</b>
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="main-content">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      this.handle_filters_sort("id");
                    }}
                  >
                    ID
                    <i
                      className={
                        "icon icon-" +
                        (order_field === "id" ? order_value + "end" : "sort")
                      }
                    ></i>
                  </a>
                </th>
                <th>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      this.handle_filters_sort("name");
                    }}
                  >
                    章节
                    <i
                      className={
                        "icon icon-" +
                        (order_field === "name" ? order_value + "end" : "sort")
                      }
                    ></i>
                  </a>
                </th>
                <th>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      this.handle_filters_sort("state_sale");
                    }}
                  >
                    收费
                    <i
                      className={
                        "icon icon-" +
                        (order_field === "state_sale"
                          ? order_value + "end"
                          : "sort")
                      }
                    ></i>
                  </a>
                </th>
                <th>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      this.handle_filters_sort("volume_id");
                    }}
                  >
                    分卷
                    <i
                      className={
                        "icon icon-" +
                        (order_field === "volume_id"
                          ? order_value + "end"
                          : "sort")
                      }
                    ></i>
                  </a>
                </th>

                <th className="dropdown">
                  <a>
                    状态<i className="icon icon-bottom"></i>
                  </a>

                  <div className="dropdown-menu">
                    <div className="icon dm-arrow"></div>
                    <ul className="dm-content">
                      <li>
                        <a href="">
                          <span>言情</span>
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <span>穿越</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </th>
                <th>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      this.handle_filters_sort("words");
                    }}
                  >
                    字数
                    <i
                      className={
                        "icon icon-" +
                        (order_field === "words" ? order_value + "end" : "sort")
                      }
                    ></i>
                  </a>
                </th>
                <th>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      this.handle_filters_sort("idx");
                    }}
                  >
                    序号
                    <i
                      className={
                        "icon icon-" +
                        (order_field === "idx" ? order_value + "end" : "sort")
                      }
                    ></i>
                  </a>
                </th>
                <th>阅读 | 追读 |完读率</th>
                <th>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      this.handle_filters_sort("published_time");
                    }}
                  >
                    发布时间
                    <i
                      className={
                        "icon icon-" +
                        (order_field === "published_time"
                          ? order_value + "end"
                          : "sort")
                      }
                    ></i>
                  </a>
                </th>
                <th>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      this.handle_filters_sort("create_time");
                    }}
                  >
                    创建时间
                    <i
                      className={
                        "icon icon-" +
                        (order_field === "create_time"
                          ? order_value + "end"
                          : "sort")
                      }
                    ></i>
                  </a>
                </th>
                <th>
                  <a>操作</a>
                </th>
              </tr>
            </thead>

            <tbody>
              {this.state.lists.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="check-box">
                      <label
                        className={
                          "feed-label checkbox " +
                          (this.state.checked_ids[item.id] ? "checked" : "")
                        }
                        onClick={() => {
                          this.handle_checkbox(item.id);
                        }}
                      >
                        <span></span>
                      </label>
                    </td>
                    <td>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          this.handle_content(item.id);
                        }}
                      >
                        {item.id}
                      </a>
                    </td>
                    <td>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          this.handle_content(item.id);
                        }}
                      >
                        {item.name}
                      </a>
                    </td>
                    <td>
                      <i
                        className={
                          "icon icon-" +
                          (item.state_sale == 1 ? "mian" : "money")
                        }
                        style={{
                          color:
                            "#" + (item.state_sale == 1 ? "8bc34a" : "ffc800"),
                        }}
                      ></i>
                    </td>
                    <td>
                      <Link
                        to={
                          "/novel/chapter/index/" +
                          item.book_id +
                          "?volume_id=" +
                          item.volume_id
                        }
                      >
                        {volume[item.volume_id]
                          ? volume[item.volume_id].name
                          : "--"}
                      </Link>
                    </td>
                    <td>
                      <Badge
                        color={
                          chapter_published[item.state_published] &&
                          chapter_published[item.state_published].color
                        }
                        text={
                          chapter_published[item.state_published] &&
                          chapter_published[item.state_published].name
                        }
                      />
                    </td>

                    <td>{item.words}</td>
                    <td>{item.idx}</td>
                    <td>
                      {item.follow ? item.follow.read_num || 0 : 0} |{" "}
                      {item.follow ? item.follow.persist_read_num || 0 : 0} |{" "}
                      {item.follow && item.follow.complete_percent > 0
                        ? (item.follow.complete_percent * 100).toFixed() + "%"
                        : "  0"}
                    </td>
                    <td>
                      {item.published_time > 0
                        ? moment(item.published_time * 1000).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        : "--"}
                    </td>
                    <td>
                      {item.create_time > 0
                        ? moment(item.create_time * 1000).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )
                        : ""}
                    </td>
                    <td>
                      <a
                        className="btn btn-outline-info btn-circle btn-lg btn-circle"
                        title="删除"
                        onClick={() => {
                          this.handle_delete_batch([item.id]);
                        }}
                      >
                        <i className="icon icon-del-thin"></i>
                      </a>
                      <Link
                        to={
                          "/novel/chapter/edit/" + item.book_id + "/" + item.id
                        }
                        className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                      >
                        <i className="icon icon-edit"></i>
                      </Link>
                      <Dropdown
                        overlay={this.__render_chapter_dropdown_menus_action(
                          item
                        )}
                      >
                        <a
                          onClick={(e) => e.preventDefault()}
                          className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
                        >
                          <i className="icon icon-moremenu" />
                        </a>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination fill lg">
            <Pagination
              {...this.state.pagination}
              onChange={this.__handle_page_change}
            />
          </div>
          <div className="pagination_fill_placeholder"> </div>
        </div>
        {this.__render_action_modal()}
      </>
    );
  }

  __render_add_edit(u_action) {
    const controls = ["undo", "redo"];
    const state = this.state || {};
    const data = state.data || {};
    // console.log("data=>", data);
    return (
      <>
        <div className="main-header">
          <div className="row">
            <div className="title">
              <h2>章节管理-{u_action == "add" ? "添加" : "修改"}</h2>
              <span>（共{data.words || 0}字）</span>
            </div>
            <div className="col-right">
              <div className="btn-group">
                <Link
                  className="btn w-10 round"
                  to={"/novel/chapter/index/" + state.book_id}
                >
                  <i className="icon icon-list mr-1"></i>返回章节管理
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Form ref={this.formRef} onFinish={this.handle_submit}>
          <Form.Item name="volume_id">
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
              <Select.Option value={"0"} key={"0"}>
                暂不分卷
              </Select.Option>
              {Object.keys(state.volume).map((key) => {
                return (
                  <Select.Option value={key} key={key}>
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
                  data.published_time>0
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
          </Form.Item>

          <Form.Item name="time_related_id" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item label="">
            <Button
              type="primary"
              htmlType="submit"
              loading={this.props.server.loading}
              style={{ marginRight: "8px" }}
              shape="round"
            >
              提交保存
            </Button>
            <Link
              className="button"
              to={"/novel/chapter/index/" + state.book_id}
            >
              返回
            </Link>
          </Form.Item>
        </Form>
      </>
    );
  }

  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Chapter);
