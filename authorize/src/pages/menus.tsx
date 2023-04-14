import {
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import {
  Button,
  Cascader, Form,
  Input,
  Radio,
  Select, Space
} from "antd";
import { FormInstance } from "antd/lib/form";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Basic_Component from "../components/base/component";
import webapi from "../utils/webapi";
const BREADCRUMB = {
  title: "菜单",
  lists: [
    { title: "主页", url: "/" },
    { title: "菜单", url: "/menus" },
  ],
  buttons: [
    { title: "添加", url: "/menus/add" },
    { title: "群组", url: "/menus/group" },
  ],
};
type Module_data<T = any> = {
  [key: number]: T;
};
type State = Server.State & {
  menus_children?: [];
  group?: Module_data<Server.Menus_group>;
  visibility: boolean;
};
class Menus extends Basic_Component {
  formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
  group = {};
  menus_children = [];
  constructor(props: any) {
    super(props);
  }
  /*----------------------0 parent start----------------------*/
  /**
   * 面包屑导航
   */
   __breadcrumb(data = {}): void {
    super.__breadcrumb({ ...BREADCRUMB, ...data });
  }
  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/
  /**
   * 获取群组
   * @return obj
   */
  async get_group(reset = false) {
    let group = this.group || {};
    if (reset || Object.keys(group).length === 0) {
      let res = await webapi.request.get("menus/group", {
        data: { dict: 1 },
      });
      if (res.code === 10000) {
        group = res.lists;
      }
      this.group = group;
    }
    return group;
  }
  /**
   * 获取菜单树
   * @return obj
   */
  async get_menus_children(reset = false) {
    var menus_children = this.menus_children || [];
    if (reset || menus_children.length === 0) {
      var res = await webapi.request.get("menus/children");
      if (res.code === 10000) {
        menus_children = res.lists;
      }
      this.menus_children = menus_children;
    }
    return menus_children;
  }

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  /**
   * index  列表数据
   */
  __init_index(d = {}) { 
    this.init_lists("menus/lists", d);
  }
  /**
   *  列表数据
   */
  async init_lists(url: string, d: Server.Query = {}, b = {}) {
    d.order_field = this.state.order_field;
    d.order_value = this.state.order_value;
    d.row_count = this.state.pagination.pageSize;
    d.offset = this.state.pagination.current;
    d.q = this.state.q;
    if (!d.filters) {
      d.filters = this.state.filters;
    }
    const query = webapi.utils.query();
    if (query['filters']) {
      try {
        d.filters = JSON.parse(query['filters']);
      } catch (err) {}
    }
    const data = await webapi.request.get(url, {data:d});
    let lists = [];
    if (data.code === 10000 && data.num_rows > 0) {
      lists = data.lists;
    }
    this.setState({
      lists: lists,
      pagination: { ...this.state.pagination, total: data.num_rows },
    });
    this.__breadcrumb(b);
  }
  async __init_add_edit(action: string) {
    let b = { title: "" };
    let data = { name: "" };
    if (action === "edit" && this.state.id) {
      var res = await webapi.request.get("menus/get", {
        data: {
          id: this.state.id,
        },
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = `${BREADCRUMB.title}-${data.name}-编辑`;
    } else {
      b.title = `${BREADCRUMB.title}-添加`;
    }
    let menus_children = await this.get_menus_children();
    let group = await this.get_group();
    this.setState({ data: data, menus_children, group });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }
  /**
   * group 列表数据
   */
  async __init_group(d = {}) {
    let buttons = [
      { title: "添加", url: "/menus/group_add" },
      { title: "菜单", url: "/menus" },
    ]; 
    let lists=[...BREADCRUMB.lists];
    lists.push({ title: "群组", url: "/menus/group" });
    this.init_lists("menus/group", d, { lists,buttons, title :'群组'});
  }
  __init_group_edit() {
    this.__init_group_add_edit("edit");
  }
  __init_group_add() {
    this.__init_group_add_edit("add");
  }
  async __init_group_add_edit(action: string) {
    let b = { title: "" };
    let data = { name: "" };
    if (action === "edit" && this.state.id) {
      var res = await webapi.request.get("menus/group_get", {
        data: {
          id: this.state.id,
        },
      });
      if (res.code === 10000) {
        data = res.data;
      }
      b.title = `${BREADCRUMB.title}-群组-${data.name}-编辑`;
    } else {
      b.title = `${BREADCRUMB.title}-群组-添加`;
    }
    this.setState({
      data: data,
    });
    this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    this.__breadcrumb(b);
  }

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
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
  handle_submit = async (data: Server.Menus) => {
    data.id = this.state.id; 
    var res = await webapi.request.post("menus/dopost", { data });
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/menus");
    } else {
      webapi.message.error(res.message);
    }
  };

  /**
   * 集中 删除
   **/
  handle_do_delete(url: string, id: number) {
    this.__handle_delete({
      url: `menus/${url}`,
      data: { id },
    });
  }
  /**
   * 删除
   **/

  handle_delete(id: number) {
    this.handle_do_delete("delete", id);
  }
  /**
   * 群组删除
   **/
  handle_group_delete(id: number) {
    this.handle_do_delete("group_delete", id);
  }
  /**
   * 群组提交
   **/
  handle_group_submit = async (data: Server.Menus_group) => { 
    data.id = this.state.id;
    var res = await webapi.request.post("menus/group_dopost", {
      data,
    });
    if (res.code === 10000) {
      webapi.message.success(res.message);
      this.props.history.replace("/menus/group");
    } else {
      webapi.message.error(res.message);
    }
  };

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  /**
   * 渲染 首页
   **/
  __render_index(): JSX.Element {
    const columns: ProColumns<Server.Menus>[] = [
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name",
        align: "center",
      },
      {
        title: "链接",
        sorter: true,
        fixed: "left",
        dataIndex: "url",
        align: "center",
      },

      {
        title: "更新时间",
        sorter: true,
        dataIndex: "update_time",
        align: "center",
        render: (_, row) => {
          if (row.update_time && row.update_time > 0) {
            return moment(row.update_time * 1000).format("YYYY-MM-DD HH:mm:ss");
          } else {
            return <></>;
          }
        },
        search: false,
      },
      {
        title: "创建时间",
        sorter: true,
        dataIndex: "create_time",
        align: "center",
        render: (_, row) => {
          if (row.create_time && row.create_time > 0) {
            return moment(row.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
          } else {
            return <></>;
          }
        },

        valueType: "dateRange",
        // search: {
        //   transform: (value) => {
        //     return {
        //       start_time: value[0],
        //       end_time: value[1],
        //     };
        //   },
        // },
        search: false,
      },
      {
        title: "操作",
        align: "center",
        fixed: "right",
        search: false,
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

              <Link to={`/menus/edit/${row.id}`}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
              </Link>
            </Space>
          );
        },
      },
    ];
    return (
      <ProTable 
        rowKey={"id"}
        columns={columns}
        pagination={this.state.pagination}
        dataSource={this.state.lists}
        loading={this.props.server.loading}
        toolBarRender={() => [
          <Link to={"/menus/add"}>
            <Button type="primary" shape="round">
              添加菜单
            </Button>
          </Link>,
        ]}
        rowSelection={{
          onChange: (_, selectedRows) => {},
        }}
        search={{
          labelWidth: "auto",
        }}
        request={async (params = {}, sorts, filter) => {
          return this.__handle_tablepro_request(params, sorts, filter);
        }}
      />
    );
  }
  /**
   * 添加-编辑 子类重写
   * @return obj
   */
  __render_add_edit(u_action: string) {
    const state = this.state as unknown as State;
    const menus_children = state.menus_children || [];
    const group = state.group || {};
    // console.log('d=>',this.props)
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handle_submit}
        {...this.__form_item_layout()}
      >
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name="idx" label="序号">
          <Input />
        </Form.Item>
        <Form.Item name="url" label="链接">
          <Input />
        </Form.Item>
        <Form.Item name="icon" label="图标">
          <Input />
        </Form.Item>
        <Form.Item name="style" label="样式">
          <Input />
        </Form.Item>
        <Form.Item name="group_id" label="群组">
          <Select>
            {Object.entries(group).map(([key, val]) => {
              return (
                <Select.Option key={key} value={val.id}>
                  {val.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="所属">
          <Cascader
            options={menus_children}
            fieldNames={{ label: "name", value: "id" }}
            changeOnSelect
            onChange={this.handle_parent_id}
          />
        </Form.Item>
        <Form.Item name="intro" label="描述">
          <Input.TextArea />
        </Form.Item>
        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.props.server.loading}
          >
            {this.props.server.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/menus"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  __render_group() {
    const columns: ProColumns<Server.Menus_group>[] = [
      {
        title: "名称",
        sorter: true,
        fixed: "left",
        dataIndex: "name", 
        align: "center",
      },
      {
        title: "状态",
        sorter: true,
        fixed: "left",
        dataIndex: "visibility", 
        align: "center",
        render: function (field, data) {
          return field === "1" ? "显示" : "隐藏";
        },
        valueType: 'select',
        valueEnum: {
          0: { text: '全部', status: '0' },
          1: {
            text: '显示',
            status: '1',
          },
          2: {
            text: '隐藏',
            status: '2',
          },
        }
      },
      {
        title: "时间",
        sorter: true,
        dataIndex: "create_time",
        align: "center",
        render: function (_, row) {
          if (row.create_time && row.create_time > 0) {
            return moment(row.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
          } else {
            return <></>;
          }
        }, 
        valueType: "dateRange",
        search: {
          transform: (value) => {
            return {
              start_time: value[0],
              end_time: value[1],
            };
          },
        },
      },
      {
        title: "操作",
        search: false,
        align: "center",
        render: (_, row) => {
          return (
            <Space>
              <Button
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                title="删除"
                onClick={() => {
                  this.handle_group_delete(row.id);
                }}
              />

              <Link to={`/menus/group_edit/${row.id}`}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
              </Link>
            </Space>
          );
        },
      },
    ];
    return (
      <ProTable
        rowKey="id"
        columns={columns}
        pagination={this.state.pagination}
        dataSource={this.state.lists}
        loading={this.props.server.loading}
        search={{
          labelWidth: "auto",
        }}
        request={async (params = {}, sorts, filter) => {
          return this.__handle_tablepro_request(params, sorts, filter);
        }}
      />
    );
  }
  /**
   * 编辑
   * @return obj
   */
  __render_group_edit() {
    return this.__render_group_add_edit();
  }
  /**
   * 添加
   * @return obj
   */
  __render_group_add() {
    return this.__render_group_add_edit();
  }
  /**
   * 添加、编辑
   * @return obj
   */
  __render_group_add_edit() {
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handle_group_submit}
        {...this.__form_item_layout()}
      >
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name="allow" label="链接">
          <Input />
        </Form.Item>
        <Form.Item name="visibility" label="状态">
          <Radio.Group>
            <Radio value={1}>显示</Radio>
            <Radio value={2}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...this.__tail_layout()}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px" }}
            loading={this.props.server.loading}
          >
            {this.props.server.loading ? "正在提交" : "立即提交"}
          </Button>
          <Link className="button" to={"/menus/group"}>
            返回
          </Link>
        </Form.Item>
      </Form>
    );
  }
  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Menus);
