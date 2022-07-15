import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import moment from "moment";
import {
  Form,
  Input,
  Radio,
  Select,
  Upload,
  Table,
  Button,
  Cascader,
  Tabs,
  Tree,
  Drawer,
} from "antd";
import { UploadOutlined, SettingFilled } from "@ant-design/icons";
import Basic_Component from "@/components/base/basic_component.js";

const BREADCRUMB = {
  title: "栏目组件",
  lists: [
    { title: "主页", url: "/" },
    { title: "栏目管理", url: "/columns" },
  ],
  buttons: [],
};

class Columns extends Basic_Component {
  formRef = React.createRef();
  columns_children = [];
  model = {};
  templates = {};
  type = {};
  /**
   * 构造
   */
  // constructor(props) {
  //   super(props);
  // }

  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  __init_state_before() {
    return {
      columns_children: [],
      module: { model: {}, templates: [], type: [] },
    };
  }
  __handle_init_before = () => {
    this.get_module();
    this.get_children();
  };

  /*----------------------1 other start----------------------*/

  /**
   * 获取栏目模块数据
   * @return obj
   */
  async get_module(reset = false) {
    let model = this.model || {};
    let templates = this.templates || {};
    let type = this.type || [];
    if (
      reset ||
      Object.keys(model).length === 0 ||
      Object.keys(templates).length === 0 ||
      type.length === 0
    ) {
      var data = await webapi.request.get("columns/module");
      if (data.code === 10000) {
        this.model = model = data.data.model;
        this.templates = templates = data.data.templates;
        this.type = type = data.data.type;
      }
    }
    return { model, templates, type };
  }

  /**
   * 获取栏目树
   * @return obj
   */
  async get_children(reset = false) {
    let columns_children = this.columns_children || [];
    if (reset || columns_children.length === 0) {
      var data = await webapi.request.get("columns/children", {
        data: {
          fieldnames: { name: "title", id: "key", parent_id: "parent_id" },
        },
      });
      if (data.code === 10000) {
        this.columns_children = columns_children = data.lists;
      }
    }
    return columns_children;
  }
  /**
   * 获取栏目
   * @return obj
   */
  async get_columns(reset = false, id) {
    let data = this.data || {};
    if (reset || Object.keys(data).length === 0) {
      const res = await webapi.request.get("columns/get", {
        data: {
          id,
        },
      });
      if (res.code === 10000) {
        this.data = data = res.data;
      }
    }
    return data;
  }
  /*----------------------1 other end  ----------------------*/

  /*----------------------2 init start----------------------*/

  /**
   * index  列表数据
   */
  async __init_index(data = {}) {
    const b = {
      buttons: [
        { title: "添加栏目", url: "/columns/add" },
        { title: "树结构", url: "/columns/children" },
      ],
    };
    const module = await this.get_module();
    data.order_field = this.state.order_field;
    data.order_value = this.state.order_value;
    data.row_count = this.state.pagination.pageSize;
    data.offset = this.state.pagination.current;
    data.q = this.state.q;
    const query = webapi.utils.query();
    if (!data.filters) {
      data.filters = {};
    }
    if (query.filters) {
      try {
        data.filters = JSON.parse(query.filters);
      } catch (err) {}
    }
    if (query.customerappid) {
      data.filters.client_id = query.customerappid;
    }
    var res = await webapi.request.get("columns/lists", { data });
    var lists = [];
    if (res.code === 10000 && res.num_rows > 0) {
      lists = res.lists;
    }
    this.setState({
      module,
      lists,
      pagination: { ...this.state.pagination, total: res.num_rows },
    });
    this.__breadcrumb(b);
  }

  /*----------------------2 init end  ----------------------*/

  async __init_add_edit(action) {
    this.handle_init_add_edit(action, this.state.id);
    let data = {};
    let b = { title: BREADCRUMB.title };
    if (action === "edit" && this.state.id) {
      data = await this.get_columns(1, this.state.id);
      b.title = `${BREADCRUMB.title}-${data.name}-编辑`;
    } else {
      b.title = `${BREADCRUMB.title}-添加`;
    }
    this.__breadcrumb(b);
  }
  async __init_children() {
    const columns_children = await this.get_children(true);
    const b = {
      buttons: [
        {
          title: "添加栏目",
          url: "#!",
          onClick: () => {
            this.handle_add();
          },
        },
      ],
    };
    const module = await this.get_module();

    this.setState({
      columns_children,
      module,
    });
    this.__breadcrumb(b);
  }

  /*----------------------3 handle start----------------------*/

  handle_parent_id = (value) => {
    if (value.length == 0) {
      return this.setState({
        parent_id: 0,
      });
    }
    const parent_id = value[value.length - 1];
    if (parent_id !== this.state.id) {
      this.setState({
        parent_id: parent_id,
      });
    }
  };

  /**
   * 提交
   **/
  handle_submit = async (data = {}) => {
    var url = "columns/dopost";
    var history = "/columns";
    data.id = this.state.id;
    data.parent_id = this.state.parent_id;
    data.image = this.state.data.image;
    var res = await webapi.request.post(url, { data });
    if (res.code === 10000) {
      this.get_children(true);
      webapi.message.success(res.message);
      this.props.history.replace(history);
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 集中 删除
   **/
  handle_do_delete(url, id) {
    webapi.confirm({
      url: "columns/" + url,
      data: { id },
      success: (data) => {
        if (data.status === "success") {
          webapi.message.success(data.message);
          this.__method("init");
        } else {
          webapi.message.error(data.message);
        }
      },
    });
  }
  /**
   * 删除
   **/
  handle_delete = (id) => {
    this.handle_do_delete("delete", id);
  };
  handle_columns_check = (selectedKeys, info) => {
    this.setState({ data: { ...this.state.data, ids: selectedKeys } });
  };
  handle_add = () => {
    this.setState({ drawer_visible: true, u_action: "add" });
  };
  handle_filterDropdownVisibleChange = (visible) => {
    console.log(visible);
  };
  handle_drawer_close = () => {
    this.formRef.current.resetFields();
    this.setState({
      drawer_visible: false,
    });
  };
  handle_drawer_submit = () => {
    this.formRef.current
      .validateFields()
      .then((data) => {
        this.handle_finish_dopost(data);
      })
      .catch((info) => {
        //console.log('Validate Failed:', info);
      });
  };
  handle_finish_dopost = async (data = {}) => {
    data.id = this.state.columns_id || 0;
    data.parent_id = this.state.parent_id || 0;
    const res = await webapi.request.post("columns/dopost", {
      data,
    });
    if (res.code === 10000) {
      this.setState({ parent_id: 0 });
      this.__init_children();
      this.handle_drawer_close();
      webapi.message.success(res.message);
    } else {
      webapi.message.error(res.message);
    }
  };
  handle_select = (selectedKeys, info) => {
    if (info.node.key > 0) {
      this.handle_init_add_edit("edit", info.node.key);
    }
  };
  handle_drag_end = (info) => {
    console.log(info);
  };
  handle_drop = async (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const res = await webapi.request.post("columns/dopost", {
      data: { id: dragKey, parent_id: dropKey },
    });
    if (res.code === 10000) {
      this.__init_children();
    }
  };
  handle_init_add_edit = async (action, id) => {
    const columns_children = await this.get_children();
    const module = await this.get_module();
    const data = await this.get_columns(1, id);
    this.setState({
      columns_children,
      module,
      data: data,
      u_action: action,
      drawer_visible: true,
      columns_id: id,
    });
    // console.log(data);
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
  };
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/

  /**
   * 渲染 首页
   **/
  __render_index() {
    const type = this.state.module["type"] || {};
    const model = this.state.module["model"] || {};
    const templates = this.state.module["templates"] || {};

    const columns = [
      {
        title: "ID",
        sorter: true,
        fixed: "left",
        dataIndex: "id",
        align: "center",
        width: 100,
      },
      {
        title: "名称",
        sorter: true,
        dataIndex: "name",
        align: "center",
        width: 100,
      },
      {
        title: "类型",
        sorter: true,
        dataIndex: "type",
        align: "center",
        render: (field, data) => {
          return type[data.type] && type[data.type]["name"];
        },
      },
      {
        title: "模型",
        sorter: true,
        dataIndex: "model_id",
        align: "center",
        render: (field, data) => {
          return model[data.model_id] && model[data.model_id]["name"];
        },
      },
      {
        title: "内容模板",
        sorter: true,
        dataIndex: "template_content",
        align: "center",
        render: (field, data) => {
          return (
            templates[data.template_content] &&
            templates[data.template_content]["name"]
          );
        },
      },
      {
        title: "列表模板",
        sorter: true,
        dataIndex: "template_list",
        align: "center",
        render: (field, data) => {
          return (
            templates[data.template_list] &&
            templates[data.template_list]["name"]
          );
        },
      },
      {
        title: "栏目模板",
        sorter: true,
        dataIndex: "template_category",
        align: "center",
        render: (field, data) => {
          return (
            templates[data.template_category] &&
            templates[data.template_category]["name"]
          );
        },
      },

      {
        title: "时间",
        sorter: true,
        dataIndex: "create_time",
        render: (field, data) => {
          return moment(data.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
        },
        align: "center",
      },
      {
        title: "操作",
        align: "center",
        fixed: "right",
        filters: [],
        onFilterDropdownVisibleChange: this.handle_filterDropdownVisibleChange,
        filterIcon: (filtered) => (
          <SettingFilled style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        filterDropdownVisible: false,
        render: (field, data) => {
          return (
            <div>
              <a
                href="#!"
                className="btn btn-outline-info btn-circle btn-lg btn-circle"
                title="删除"
                onClick={() => {
                  this.handle_delete(data.id);
                }}
              >
                <i className="ti-trash" />
              </a>
              <Link
                to={"/columns/edit/" + data.id}
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
      <Table
        rowKey={(res) => res.id}
        columns={columns}
        dataSource={this.state.lists}
        pagination={this.state.pagination}
        loading={this.props.server.loading}
        onChange={this.__handle_table_change}
        scroll={{ x: 1500, y: "calc(100vh - 290px)" }}
        bordered={true}
      />
    );
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit_children(u_action) {
    const data = this.state.data || {};
    const type = this.state.module["type"] || {};
    const model = this.state.module["model"] || {};
    const templates = this.state.module["templates"] || {};
    return (
      <>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="基本选项" key="1">
            <Form.Item name="name" label="名称">
              <Input />
            </Form.Item>

            <Form.Item name="parent_id_all" label="上级">
              <Cascader
                // initialValues={data.parent_id_all||[]}
                options={this.state.columns_children}
                fieldNames={{ label: "title", value: "key" }}
                changeOnSelect
                onChange={this.handle_parent_id}
              />
            </Form.Item>

            <Form.Item label="图片">
              {data.image ? (
                <p>
                  <img alt="" src={data.image} style={{ width: "100px" }} />
                </p>
              ) : (
                ""
              )}

              <Upload {...this.__upload_single_props()}>
                <Button icon={<UploadOutlined />}>上传图片</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="idx" label="排序">
              <Input />
            </Form.Item>
            <Form.Item name="icon" label="图标">
              <Input />
            </Form.Item>
            <Form.Item name="type" label="类型">
              <Select>
                {Object.keys(type).map((val, key) => {
                  return (
                    <Select.Option key={key} value={type[val]["id"]}>
                      {type[val]["name"]}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="model_id" label="模型">
              <Select>
                {Object.keys(model).map((val, key) => {
                  return (
                    <Select.Option key={key} value={model[val]["id"]}>
                      {model[val]["name"]}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="intro" label="介绍">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="生成设置" key="2">
            <Form.Item label="生成静态" name="sethtml">
              <Radio.Group>
                <Radio value={1}>生成静态</Radio>
                <Radio value={2}>跟随系统</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="is_login" label="是否登录">
              <Radio.Group>
                <Radio value={1}>登录可见</Radio>
                <Radio value={2}>游客可见</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="is_column" label="后台可见">
              <Radio.Group>
                <Radio value={1}>显示</Radio>
                <Radio value={2}>隐藏</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="is_menu" label="前台可见">
              <Radio.Group>
                <Radio value={1}>显示</Radio>
                <Radio value={2}>隐藏</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="childmap" label="栏目映射">
              <Input />
            </Form.Item>
            <Form.Item name="controller" label="内容映射">
              <Input />
            </Form.Item>
            <Form.Item name="method" label="映射功能">
              <Input />
            </Form.Item>
            <Form.Item name="catdir" label="生成文件">
              <Input />
            </Form.Item>
            <Form.Item name="url" label="链接">
              <Input />
            </Form.Item>
            <Form.Item name="letter" label="英文">
              <Input />
            </Form.Item>
            <Form.Item name="purl" label="生成地址">
              <Input />
            </Form.Item>
            <Form.Item name="template_content" label="内容模板">
              <Select>
                {templates &&
                  Object.keys(templates).map((val, key) => {
                    return (
                      <Select.Option key={key} value={templates[val].id}>
                        {templates[val].name}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item name="template_list" label="列表模板">
              <Select>
                {templates &&
                  Object.keys(templates).map((val, key) => {
                    return (
                      <Select.Option key={key} value={templates[val].id}>
                        {templates[val].name}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item name="template_category" label="栏目模板">
              <Select>
                {templates &&
                  Object.keys(templates).map((val, key) => {
                    return (
                      <Select.Option key={key} value={templates[val].id}>
                        {templates[val].name}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="高级设置" key="3">
            <Form.Item name="keywords" label="关键词">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="expand" label="扩展信息">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Tabs.TabPane>
        </Tabs>
      </>
    );
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit(u_action) {
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handle_submit.bind(this)}
        {...this.__form_item_layout()}
      >
        {this.__render_add_edit_children(u_action)}
        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.props.loading}
          >
            {this.props.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/columns"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }

  __render_children() {
    const children = this.state.columns_children || [];
    return (
      <>
        <Tree
          className="draggable-tree"
          showLine={{ showLeafIcon: false }}
          draggable
          blockNode
          onDragEnd={this.handle_drag_end}
          onDrop={this.handle_drop}
          onSelect={this.handle_select}
          treeData={children}
        />
        <Drawer
          title={(this.state.u_action === "add" ? "添加" : "编辑") + "栏目"}
          width={"61.8%"}
          forceRender={true}
          onClose={this.handle_drawer_close}
          visible={this.state.drawer_visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                shape="round"
                style={{ marginRight: 8 }}
                onClick={this.handle_drawer_close}
              >
                取消
              </Button>
              <Button
                shape="round"
                loading={this.props.loading}
                type="primary"
                onClick={this.handle_drawer_submit}
              >
                提交
              </Button>
            </div>
          }
        >
          <Form ref={this.formRef} onFinish={this.handle_submit}>
            {this.__render_add_edit_children(this.state.u_action)}
          </Form>
        </Drawer>
      </>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Columns);
