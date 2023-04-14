import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../utils/webapi";
import moment from "moment";
import {
  Form,
  Input,
  Radio,
  Select,
  Upload,
  Button,
  Cascader,
  Tabs,
  Tree,
  Drawer,
  Space,
  Modal,
} from "antd";
import {
  UploadOutlined,
  SettingFilled,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Icon, * as Icons from "@ant-design/icons";
import Basic_Authorize from "./basic_authorize";
import classnames from "classnames";
// import ProTable from "@ant-design/pro-table";
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
// import type { ProColumns } from "@ant-design/pro-table";
// import "@ant-design/pro-table/dist/table.css";
import { FormInstance } from "antd/lib/form";
import styles from "./columns.module.less";
// console.log("icons=>", Icons);
const BREADCRUMB = {
  title: "栏目组件",
  lists: [
    { title: "主页", url: "/" },
    { title: "栏目管理", url: "/columns" },
  ],
  buttons: [],
};
type Module_data = {
  [key: number]: { id: number; name: string };
};
type Module = {
  model: Module_data;
  templates: Module_data;
  types: Module_data;
};
type State = Server.State & {
  columns_children?: [];
  module?: Module;
  data?: Server.Columns;
  u_action?: string;
  drawer_visible?: boolean;
  icon_visible?: boolean;
  icon?: string;
};
const Default_Module = { model: {}, templates: {}, types: {} };
class Columns extends Basic_Authorize<{}, State> {
  formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
  columns_children = [];
  module: Module = Default_Module;
  data = { id: 0, name: "" };
  /**
   * 构造
   */
  constructor(props: any) {
    super(props);
    // console.log('props=>',props);
    // this.state = this.__init_state() as State;
    // this.formRef = React.createRef<FormInstance>();
  }

  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  __init_state_before(): {} {
    return {
      columns_children: [],
      module: Default_Module,
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
    let module = this.module;
    if (
      reset ||
      Object.keys(module.model).length === 0 ||
      Object.keys(module.templates).length === 0 ||
      Object.keys(module.types).length === 0
    ) {
      const data = await webapi.request.get("columns/module");
      if (data.code === 10000) {
        module.model = data.data.model;
        module.templates = data.data.templates;
        module.types = data.data.types;
        this.module = module;
      }
    }
    return module;
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
  async get_columns(
    reset: boolean = false,
    id?: number
  ): Promise<Server.Columns> {
    let data = this.data;
    if (reset || Object.keys(data).length === 0) {
      const res = await webapi.request.get("columns/get", {
        data: {
          id
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
  async __init_index(data: Server.Query = {}) {
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
    // if (query.filters) {
    //   try {
    //     data.filters = JSON.parse(query.filters);
    //   } catch (err) {}
    // }
    // if (query.customerappid) {
    //   data.filters.client_id = query.customerappid;
    // }
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

  async __init_add_edit(action: string) {
    this.handle_init_add_edit(action, this.state.id);
    let data: Server.Columns = { id: this.state.id };
    let b = { title: BREADCRUMB.title };
    if (action === "edit" && this.state.id) {
      data = await this.get_columns(true, this.state.id);
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

  handle_parent_id = (value: (string | number)[]): void => {
    let parent_id: string | number = 0;
    if (value.length > 0) {
      parent_id = value[value.length - 1];
    }
    if (parent_id !== this.state.id) {
      this.setState({
        data: { ...this.state.data, parent_id: parent_id },
      });
    }
  };
  /**
   * 提交
   **/
  handle_submit = async (data: Server.Columns) => {
    const state = this.state;
    data.id = state.id;
    data.image = data.image;
    var res = await webapi.request.post("columns/dopost", { data });
    if (res.code === 10000) {
      this.get_children(true);
      webapi.message.success(res.message);
      this.props.history.replace("/columns");
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 集中 删除
   **/
  handle_do_delete(url: string, id: number) {
    webapi.confirm({
      url: "columns/" + url,
      data: { id },
      success: (data: Server.Status) => {
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
  handle_delete = (id: number) => {
    this.handle_do_delete("delete", id);
  };
  handle_columns_check = (selectedKeys: []) => {
    this.setState({ data: { ...this.state.data, ids: selectedKeys } });
  };
  handle_add = () => {
    this.setState({ drawer_visible: true, u_action: "add" });
  };
  handle_filterDropdownVisibleChange = (visible: any) => {
    console.log(visible);
  };
  handle_drawer_close = () => {
    this.formRef.current && this.formRef.current.resetFields();
    this.setState({
      drawer_visible: false,
    });
  };
  handle_drawer_submit = () => {
    this.formRef.current &&
      this.formRef.current.validateFields().then((data: Server.Columns) => {
        this.handle_finish_dopost(data);
      });
  };
  handle_finish_dopost = async (data: Server.Columns) => {
    const state = this.state as Server.Columns;
    data.id = state.columns_id || 0;
    data.parent_id = state.parent_id || 0;
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
  handle_select = (selectedKeys: any, info: any) => {
    if (info.node.key > 0) {
      this.handle_init_add_edit("edit", info.node.key * 1);
    }
  };
  handle_drag_end = (info: any) => {
    console.log(info);
  };
  handle_drop = async (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const res = await webapi.request.post("columns/dopost", {
      data: { id: dragKey, parent_id: dropKey },
    });
    if (res.code === 10000) {
      this.__init_children();
    }
  };
  handle_init_add_edit = async (action: string, id: number) => {
    const columns_children = await this.get_children();
    const module = await this.get_module();
    const data = await this.get_columns(true, id);
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
  handle_icon_show = () => {
    const state = this.state as State;
    this.setState({ icon_visible: true, icon: state.data.icon });
  };
  handle_icon_clos = () => {
    this.setState({ icon_visible: false });
  };
  handle_icon_confirm = () => {
    const state = this.state as State;
    if (state.icon && this.formRef.current) {
      const data = {
        ...this.state.data,
        ...this.formRef.current.getFieldsValue(),
        icon: state.icon,
      };
      this.setState({ data });
      this.formRef.current.setFieldsValue({ ...data });
    }
    this.handle_icon_clos();
  };
  handle_icon_select = (icon: string) => {
    this.setState({ icon });
  };
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start----------------------*/

  /**
   * 渲染 首页
   **/
  __render_index() {
    const state = this.state as State;
    const module = state.module;
    const types = module.types;
    const model = module.model;
    const templates = module.templates;
    console.log(module);
    const columns: ProColumns<Server.Columns>[] = [
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
        render: (_, row: Server.Columns) => {
          let i = row.type as number;
          return <>{types[i] && types[i]["name"]}</>;
        },
      },
      {
        title: "模型",
        sorter: true,
        dataIndex: "model_id",
        align: "center",
        render: (_, row) => {
          let i = row.type as number;
          return model[i] && model[i]["name"];
        },
      },
      {
        title: "内容模板",
        sorter: true,
        dataIndex: "template_content",
        align: "center",
        render: (_, row) => {
          let i = row.type as number;
          return templates[i] && templates[i]["name"];
        },
      },
      {
        title: "列表",
        sorter: true,
        dataIndex: "template_list",
        align: "center",
        render: (_, row) => {
          let i = row.type as number;
          return templates[i] && templates[i]["name"];
        },
      },
      {
        title: "栏目",
        sorter: true,
        dataIndex: "template_category",
        align: "center",
        render: (_, row) => {
          let i = row.type as number;
          return templates[i] && templates[i]["name"];
        },
      },

      {
        title: "时间",
        sorter: true,
        hideInSearch: true,
        dataIndex: "create_time",
        align: "center",
        render: (_, row) => {
          return moment((row.create_time as number) * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        },
      },
      {
        title: "时间",
        dataIndex: "create_time",
        valueType: "dateRange",
        hideInTable: true,
        search: {
          transform: (value: [0, 1]) => {
            return {
              create_time: { start: value[0], end: value[1] },
            };
          },
        },
      },
      {
        title: "操作",
        align: "center",
        fixed: "right",
        valueType: "option",
        filters: [],
        onFilterDropdownVisibleChange: this.handle_filterDropdownVisibleChange,
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
                  this.handle_delete(row.id);
                }}
              />

              <Link to={`/columns/edit/${row.id}`}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
              </Link>
            </Space>
          );
        },
      },
    ];
    return (
      <ProTable
        headerTitle="查询表格"
        rowKey={"id"}
        columns={columns}
        pagination={this.state.pagination}
        dataSource={this.state.lists}
        // loading={this.props.server.loading}
        onChange={this.__handle_table_change}
        scroll={{ x: 1500, y: "calc(100vh - 290px)" }}
        toolBarRender={() => [
          // <Button type="primary" key="primary" onClick={() => {}}>
          //   新建
          // </Button>,
        ]}
        search={{
          labelWidth: 120,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {},
        }}
      />
    );
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit_children(u_action: string) {
    const state = this.state as State;
    const data = state.data;
    const module = state.module;
    const templates = module.templates;
    const types = module.types;
    const model = module.model;
    const columns_children = state.columns_children;
    // console.log('templates',(templates))
    // Object.entries(templates).map(([key, val]) => {
    //   console.log('templates',val)
    // });
    return (<>
      <Modal
        title="请选择图标"
        open={state.icon_visible}
        onOk={this.handle_icon_confirm}
        onCancel={this.handle_icon_clos}
      >
        <div className={styles.content_article}>
          <ul className={styles.ul}>
            {Object.entries(Icons).map(([key, val]) => {
              if (typeof val == "function") {
                return;
              }
              return (
                <li
                  key={key}
                  className={classnames(
                    styles.li,
                    state.icon === key ? styles.hover : ""
                  )}
                  onClick={() => {
                    this.handle_icon_select(key);
                  }}
                >
                  <Icon component={Icons[key]} className={styles.anticon} />
                  <span className={styles.anticon_class}>
                    <span className="ant-badge"> {key}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Modal>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基本选项" key="1">
          <Form.Item name="name" label="名称">
            <Input />
          </Form.Item>

          <Form.Item name="parent_id_all" label="上级">
            <Cascader
              options={columns_children}
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
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={
                <Icon component={Icons[data.icon]} style={{ fontSize: 30 }} />
              }
              onClick={() => {
                this.handle_icon_show();
              }}
            />
          </Form.Item>
          <Form.Item name="type" label="类型">
            <Select>
              {Object.entries(types).map(([key, val]) => {
                return (
                  <Select.Option key={key} value={val.id}>
                    {val.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="model_id" label="模型">
            <Select>
              {Object.entries(model).map(([key, val]) => {
                return (
                  <Select.Option key={key} value={val.id}>
                    {val.name}
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
              {Object.entries(templates).map(([key, val]) => {
                return (
                  <Select.Option key={key} value={val.id}>
                    {val.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="template_list" label="列表模板">
            <Select>
              {Object.entries(templates).map(([key, val]) => {
                return (
                  <Select.Option key={key} value={val.id}>
                    {val.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="template_category" label="栏目模板">
            <Select>
              {Object.entries(templates).map(([key, val]) => {
                return (
                  <Select.Option key={key} value={val.id}>
                    {val.name}
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
    </>);
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_add_edit(u_action: string): JSX.Element {
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
            shape="round"
            style={{ marginRight: "8px" }}
            loading={this.props.server.loading}
          >
            {this.props.server.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/columns"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }

  __render_children() {
    const state = this.state as State;
    const children = state.columns_children;
    return (<>
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
        title={(state.u_action === "add" ? "添加" : "编辑") + "栏目"}
        width={"61.8%"}
        forceRender={true}
        onClose={this.handle_drawer_close}
        open={state.drawer_visible}
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
              loading={this.props.server.loading}
              type="primary"
              onClick={this.handle_drawer_submit}
            >
              提交
            </Button>
          </div>
        }
      >
        <Form
          ref={this.formRef}
          onFinish={this.handle_submit}
          {...this.__form_item_layout()}
        >
          {this.__render_add_edit_children(state.u_action)}
        </Form>
      </Drawer>
    </>);
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Columns);
