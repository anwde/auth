import React from "react"; 
import webapi from "../../utils/webapi";
import Basic_Novel from "./basic_novel";
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
} from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";
const BREADCRUMB = {
  title: "分类管理",
  lists: [{ title: "分类管理", url: "/novel/category" }],
  buttons: [],
};

export default class Basic_Chapter extends Basic_Novel {
  formRef = React.createRef();

  constructor(props) {
    super(props);
  }

  __init_state_after() {
    // 创建一个空的editorState作为初始值
    return {
      volume: {},
      drawer_visible: false,
      order_field: "idx",
      item: {},
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

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/
  handle_modal_close = () => {
    this.setState({ modal_visible: false });
  };
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

  handle_content = async (id) => {
    var res = await webapi.request.get("novel/chapter/content", {
      chapter_id: id,
      order_field: this.state.order_field,
      order_value: this.state.order_value,
    });
    if (res.code === 10000) {
      this.setState({ data: res.data, modal_visible: true });
    } else {
      webapi.message.error(res.message);
    }
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
  handle_popover_change_visible = (visible) => {
    this.setState({ popover_visible: visible });
  };

  handle_published_drawer_open = (item={},published_u_action) => {
    this.setState({ 
      item,
      published_u_action,
      modal_visible: false,
      base_drawer_visible: false,
      published_drawer_visible: true,
    });
  };
  handle_published_drawer_close = () => {
    this.setState({
      published_drawer_visible: false,
    });
  };
  handle_published_datepicker_onChange = () => {};
  handle_published_datepicker_onOk = (value) => {
    const time_related_id=moment(value).format("YYYY-MM-DD HH:mm:ss");
    this.setState({
      time_related_id
    });
    if(this.formRef.current){
      const data=this.formRef.current.getFieldsValue();
      data.time_related_id=time_related_id;
      console.log(data)
      this.formRef.current && this.formRef.current.setFieldsValue(data);
    } 
  };
  
  handle_published_datepicker_disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };
  /**
   *   提交
   */
  handle_published_drawer_submit = () => {
    if (this.props.server.loading || !this.state.time_related_id) {
      return false;
    }
    let checked_ids=this.state.checked_ids||{};
    if(this.state.published_u_action=='single'){ 
      checked_ids={ [this.state.item.id]: this.state.item.id };
    }
    this.setState(
      {
        checked_ids:checked_ids ,
      },
      () => {
        this.handle_checked_sale(6, {
          time_related_type: 2,
          time_related_id: this.state.time_related_id,
          success:()=>{
            this.handle_published_drawer_close();
            this.__init_index();
          }
        });
      }
    );
  };

  handle_base_drawer_open = (item) => {
    this.setState({
      item,
      modal_visible: false,
      base_drawer_visible: true,
    });
  };
  /**
   *   drawer关闭
   */
  handle_base_drawer_close = () => {
    this.setState({
      base_drawer_visible: false,
    });
  };
  /**
   *   提交
   */
  handle_base_drawer_submit = async () => {
    if (this.props.server.loading) {
      return false;
    }
    var data = this.state.item;
    data.chapter_id = this.state.item.id;
    var res = await webapi.request.post("novel/chapter/dopost", data);
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.handle_base_drawer_close();
      this.__init_index();
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   *
   */
  handle_base_input_change(v, event) {
    var val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
    this.setState({ item: { ...this.state.item, [v]: val } });
  }

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/
  __render_chapter_dropdown_menus_action = (data) => {
    return (
      <Menu>
        {webapi.utils.in_array(data.state_published, [
          "2",
          "3",
          "4",
          "5",
          "6",
        ]) ? (
          <Menu.Item key="1">
            <Button
              onClick={() => {
                this.handle_published_batch([data.id]);
              }}
              type="primary"
              shape="round"
              style={{ background: "#00c0ff", borderColor: "#00c0ff" }}
              icon={
                <i
                  className="icon icon-publish-fill"
                  style={{ paddingRight: "5px" }}
                ></i>
              }
            >
              设置上线
            </Button>
          </Menu.Item>
        ) : (
          ""
        )}
        {webapi.utils.in_array(data.state_published, ["1", "2", "3"]) ? (
          <Menu.Item key="2">
            <Button
              onClick={() => {
                this.handle_revert_batch([data.id]);
              }}
              type="primary"
              shape="round"
              style={{ background: "#f66c5e", borderColor: "#f66c5e" }}
              icon={
                <i
                  className="icon icon-rejection"
                  style={{ paddingRight: "5px" }}
                ></i>
              }
            >
              退稿
            </Button>
          </Menu.Item>
        ) : (
          ""
        )}
        <Menu.Item key="3">
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              this.handle_state_sale(data.id, data.state_sale == 1 ? 2 : 1);
            }}
          >
            从本章开始设置为
            {data.state_sale == 1 ? "收费" : "免费"}
          </Button>
        </Menu.Item>

        <Menu.Item key="4">
          <Button
            onClick={() => {
              this.handle_published_drawer_open(data,'single');
            }}
            type="primary"
            shape="round"
          >
            预发设置
          </Button>
        </Menu.Item>

        <Menu.Item key="5">
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              this.handle_base_drawer_open(data);
            }}
          >
            更改基本信息
          </Button>
        </Menu.Item>
      </Menu>
    );
  };

  __render_action_modal(o = { prev_id: true, next_id: true }) {
    const data = this.state.data || {};
    const content = (
      <div>
        <Space>
          <Button
            style={{ background: "#FFC800", borderColor: "#FFC800" }}
            onClick={(e) => {
              e.preventDefault();
              this.handle_state_sale(data.id, 2);
            }}
            type="primary"
            shape="round"
            icon={
              <i
                className="icon icon-money"
                style={{ paddingRight: "5px" }}
              ></i>
            }
          >
            收费
          </Button>
          <Button
            style={{ background: "#87d068", borderColor: "#87d068" }}
            onClick={(e) => {
              e.preventDefault();
              this.handle_state_sale(data.id, 1);
            }}
            type="primary"
            shape="round"
            icon={
              <i className="icon icon-mian" style={{ paddingRight: "5px" }}></i>
            }
          >
            免费
          </Button>
        </Space>
      </div>
    );
    const footer = (
      <div className="popup-footer double">
        <Space>
          {o.prev_id ? (
            <Button
              type="primary"
              shape="round"
              disabled={data.prev_id === 0}
              icon={<ArrowLeftOutlined />}
              onClick={
                data.prev_id > 0
                  ? () => {
                      this.handle_content(data.prev_id);
                    }
                  : ""
              }
            >
              上一章
            </Button>
          ) : (
            ""
          )}
          <Dropdown
            overlay={this.__render_chapter_dropdown_menus_action(data)}
            type="primary"
            shape="round"
            arrow={{ pointAtCenter: true }}
          >
            <Button
              type="primary"
              shape="round"
              icon={<i className="icon icon-moremenu" />}
            >
              更多操作
            </Button>
          </Dropdown>
          {o.next_id ? (
            <Button
              type="primary"
              shape="round"
              disabled={data.next_id === 0}
              onClick={
                data.next_id > 0
                  ? () => {
                      this.handle_content(data.next_id);
                    }
                  : ""
              }
            >
              下一章
              <ArrowRightOutlined />
            </Button>
          ) : (
            ""
          )}
        </Space>
      </div>
    );

    return (
      <>
        <Drawer
          title="章节预发信息管理"
          width={"61.8%"}
          forceRender={true}
          onClose={this.handle_published_drawer_close}
          visible={this.state.published_drawer_visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={this.handle_published_drawer_close}
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button
                onClick={this.handle_published_drawer_submit}
                loading={this.props.loading}
                type="primary"
              >
                提交
              </Button>
            </div>
          }
        >
          <Form layout="horizontal">
            <Form.Item label="时间">
              <DatePicker
              showNow={false}
                showTime
                onChange={this.handle_published_datepicker_onChange}
                disabledDate={this.handle_published_datepicker_disabledDate}
                onOk={this.handle_published_datepicker_onOk}
              />
            </Form.Item>
          </Form>
        </Drawer>
        <Drawer
          title="章节基本信息管理"
          width={"61.8%"}
          forceRender={true}
          onClose={this.handle_base_drawer_close}
          visible={this.state.base_drawer_visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={this.handle_base_drawer_close}
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button
                onClick={this.handle_base_drawer_submit}
                loading={this.props.loading}
                type="primary"
              >
                提交
              </Button>
            </div>
          }
        >
          <Form layout="horizontal">
            <Form.Item label="名称">
              <Input
                value={this.state.item.name}
                placeholder="请输入名称"
                onChange={(o) => {
                  this.handle_base_input_change("name", o);
                }}
              />
            </Form.Item>
            <Form.Item label="序号">
              <Input
                value={this.state.item.idx}
                placeholder="请输入序号"
                onChange={(o) => {
                  this.handle_base_input_change("idx", o);
                }}
              />
            </Form.Item>
          </Form>
        </Drawer>
        <Modal
          title={
            <>
              <h4>{this.state.data.name}</h4>
              <Popover
                placement="bottomRight"
                title={<span>将内容设置为</span>}
                content={content}
                trigger="click"
                visible={this.state.popover_visible}
                onVisibleChange={this.handle_popover_change_visible}
              >
                {this.state.data.state_sale == 1 ? (
                  <Tag color="#87d068" style={{ marginLeft: "15px" }}>
                    免费
                  </Tag>
                ) : (
                  <Tag color="#FFC800" style={{ marginLeft: "15px" }}>
                    收费
                  </Tag>
                )}
              </Popover>
            </>
          }
          visible={this.state.modal_visible}
          closeIcon={
            <a
              className="closeBtn"
              style={{ top: 0 }}
              onClick={(e) => {
                e.preventDefault();
                this.handle_modal_close();
              }}
            >
              <i className="icon icon-close"></i>
            </a>
          }
          footer={footer}
          width="48.8vw"
        >
          <div
            className="content-article"
            style={{
              height: "calc(100vh - 340px)",
              overflowX: "hidden",
              overflowY: "scroll",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
          </div>
        </Modal>
      </>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
