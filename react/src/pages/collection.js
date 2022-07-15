import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import Basic_Component from "@/components/base/basic_component.js";
import moment from "moment";
import {
  Form,
  Input,
  Radio,
  Select,
  Table,
  Button,
  Cascader,
  Tabs,
} from "antd";

const BREADCRUMB = {
  title: "采集管理",
  lists: [
    {
      title: "主页",
      url: "/",
    },
    {
      title: "采集管理",
      url: "/collection",
    },
  ],
  buttons: [
    {
      title: "添加",
      url: "/collection/add",
    },
  ],
};
class Collection extends Basic_Component {
  formRef = React.createRef();
  type = {};
  /*----------------------0 parent start----------------------*/
  __init_state_after() {
    return {
      data: {url:{},thumb:{},intro:{},title:{},author:{},tags:{}},
      type: {},
    };
  } 
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({
      ...BREADCRUMB,
      ...data,
    });
  }

  __handle_init_after = () => {
    this.get_type().then((type) => {
      this.setState({
        type,
      });
    });
  };
  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/

  async get_type(reset = false) {
    var column_id = this.state.column_id;
    var type = this.type || {};
    if (reset || Object.keys(type).length === 0) {
      var res = await webapi.request.get("templates/type");
      if (res.code === 10000) {
        type = res.data;
      }
    }
    this.type = type;
    return type;
  }

  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/
  /**
   * index  列表数据
   */
  __init_index(d = {}) {
    this.init_lists("collection/lists", d);
  }

  /**
   *  列表数据
   */
  async init_lists(url, d = {}, b = {}) {
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    d.q = this.state.q;
    var data = await webapi.request.get(url, d);
    var lists = [];
    if (data.code === 10000 && data.num_rows > 0) {
      lists = data.lists;
    }
    this.setState({
      lists: lists,
      pagination: {
        ...this.state.pagination,
        total: data.num_rows,
      },
    });
    this.__breadcrumb(b);
  }
  /*----------------------2 init end  ----------------------*/

  async __init_add_edit(action) {
    var b = {};
    var data = {};
    if (action === "edit" && this.state.id) {
      var res = await webapi.request.get("collection/get", {
        id: this.state.id,
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = BREADCRUMB.title + "-" + data.name + "-编辑";
    } else {
      b.title = BREADCRUMB.title + "-" + "添加";
    }
    this.setState({
      data: data,
    });
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        ...data,
      });
    this.__breadcrumb(b);
  }

  /*----------------------3 handle start----------------------*/

  /**
   * 提交
   **/
  handle_submit = async (data = {}) => {
    data.id = this.state.id;
    data.parent_id = this.state.parent_id;
    var res = await webapi.request.post("collection/dopost", data);
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.push("/collection");
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 删除
   **/

  handle_delete(id) {
    webapi.confirm({
      url: "collection/delete",
      data: {
        id,
      },
      success: (data) => {
        if (data.status == "success") {
          webapi.message.success(data.message);
          this.__method("init");
        } else {
          webapi.message.error(data.message);
        }
      },
    });
  }

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/

  /**
   * 渲染 首页
   **/
  __render_index() {
    const type = this.state.type || {};
    const columns = [
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name",
        align: "center",
      },
      {
        title: "类型",
        sorter: true,
        fixed: "left",
        dataIndex: "type",
        align: "center",
        render: (field, data) => {
          return type[data.type] && type[data.type].name;
        },
      },

      {
        title: "更新时间",
        sorter: true,
        dataIndex: "update_time",

        align: "center",
        render: (field, data) => {
          return (
            data.update_time > 0 &&
            moment(data.update_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          );
        },
      },
      {
        title: "创建时间",
        sorter: true,
        dataIndex: "create_time",

        align: "center",
        render: (field, data) => {
          return moment(data.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
        },
      },
      {
        title: "操作",
        align: "center",
        render: (d, i) => {
          return (
            <div>
              <a
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                onClick={() => {
                  this.handle_delete(d.id);
                }}
              >
                <i className="ti-trash" />{" "}
              </a>
              <Link
                to={"/collection/edit/" + d.id}
                className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
              >
                <i className="ti-pencil-alt" />
              </Link>
            </div>
          );
        },
      },
    ];
    return (
      <div className="card">
        <Table
          rowKey={(res) => res.id}
          columns={columns}
          dataSource={this.state.lists}
          pagination={this.state.pagination}
          loading={this.props.loading}
          onChange={this.__handle_table_change}
        />
      </div>
    );
  }

  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit() {
    const data=this.state.data;
    return (
      <Form
        layout="horizontal"
        ref={this.formRef}
        onFinish={this.handle_submit}
        {...this.__form_item_layout()}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="基本选项" key="1">
            <Form.Item name="name" label="名称">
              <Input />
            </Form.Item>
            <Form.Item name="charset" label="编码">
              <Input />
            </Form.Item>
            <Form.Item name="type" label="类型">
              <Select>
                {Object.keys(this.state.type).map((val, key) => {
                  return (
                    <Select.Option key={key} value={this.state.type[val]["id"]}>
                      {this.state.type[val]["name"]}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item name="urlpage" label="网址">
              <Input />
            </Form.Item>
            <Form.Item name="page_base" label="Base">
              <Input />
            </Form.Item>
            <Form.Item label="页码">
              <Input />
            </Form.Item>
            <Form.Item label="开始页码">
              <Input />
            </Form.Item>
            <Form.Item label="每次增加">
              <Input />
            </Form.Item>
            <Form.Item name="url_contain" label="必须包含">
              <Input />
            </Form.Item>
            <Form.Item name="url_except" label="不得包含">
              <Input />
            </Form.Item>
            <Form.Item name="url_program" label="网址规则">
              <Input.TextArea rows={15} />
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="内容规则" key="2">

          <Form.Item name="url[selector]" label="网址匹配规则">
              <Input.TextArea rows={4} defaultValue={data.url.selector} />
            </Form.Item>
            <Form.Item name="url[filter]" label="网址过滤选项">
              <Input.TextArea rows={4} defaultValue={data.url.filter}  />
            </Form.Item>
            <Form.Item name="url[program]" label="网址运算程序">
              <Input.TextArea rows={4} defaultValue={data.url.program} />
            </Form.Item>

            
            <Form.Item name="title[selector]" label="标题匹配规则">
              <Input.TextArea rows={4} defaultValue={data.title.selector} />
            </Form.Item>
            <Form.Item name="title[filter]" label="标题过滤选项">
              <Input.TextArea rows={4} defaultValue={data.title.filter}  />
            </Form.Item>
            <Form.Item name="title[program]" label="标题运算程序">
              <Input.TextArea rows={4} defaultValue={data.title.program} />
            </Form.Item>

            <Form.Item name="thumb[selector]" label="缩略图匹配规则">
              <Input.TextArea rows={4} defaultValue={data.thumb.selector} />
            </Form.Item>
            <Form.Item name="thumb[filter]" label="缩略图过滤选项">
              <Input.TextArea rows={4} defaultValue={data.thumb.filter}  />
            </Form.Item>
            <Form.Item name="thumb[program]" label="缩略图运算程序">
              <Input.TextArea rows={4} defaultValue={data.thumb.program} />
            </Form.Item>


            <Form.Item name="author[selector]" label="作者匹配规则">
              <Input.TextArea rows={4} defaultValue={data.author.selector} />
            </Form.Item>
            <Form.Item name="author[filter]" label="作者过滤选项">
              <Input.TextArea rows={4} defaultValue={data.author.filter}  />
            </Form.Item>
            <Form.Item name="author[program]" label="作者运算程序">
              <Input.TextArea rows={4} defaultValue={data.author.program} />
            </Form.Item>

            <Form.Item name="tags[selector]" label="标签匹配规则">
              <Input.TextArea rows={4} defaultValue={data.tags.selector} />
            </Form.Item>
            <Form.Item name="tags[filter]" label="标签过滤选项">
              <Input.TextArea rows={4} defaultValue={data.tags.filter}  />
            </Form.Item>
            <Form.Item name="tags[program]" label="标签运算程序">
              <Input.TextArea rows={4} defaultValue={data.tags.program} />
            </Form.Item>

            


             

             
            <Form.Item name="author_rule" label="时间匹配规则">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="author_html_rule" label="时间过滤选项">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="author_program" label="时间运算程序">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="author_rule" label="简介匹配规则">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="author_html_rule" label="简介过滤选项">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="author_program" label="简介运算程序">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item name="intro[selector]" label="简介匹配规则">
              <Input.TextArea rows={4} defaultValue={data.intro.selector} />
            </Form.Item>
            <Form.Item name="intro[filter]" label="简介过滤选项">
              <Input.TextArea rows={4} defaultValue={data.intro.filter}  />
            </Form.Item>
            <Form.Item name="intro[program]" label="简介运算程序">
              <Input.TextArea rows={4} defaultValue={data.intro.program} />
            </Form.Item>



          </Tabs.TabPane>
        </Tabs>

        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginRight: "8px",
            }}
            loading={this.props.loading}
          >
            {this.props.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/collection"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }

  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({
  ...store,
}))(Collection);
