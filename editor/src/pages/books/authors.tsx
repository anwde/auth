// @ts-nocheck
import React from "react";
import Basic_Component from "../../components/base/component";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../utils/webapi";
import { ProTable, TableDropdown, ProList, ProCard } from '@ant-design/pro-components';
import type { PaginationConfig } from 'antd/es/pagination';
import { FormInstance } from "antd/lib/form";
import ImgCrop from "antd-img-crop";
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
    Radio,
    Cascader,
    Tree,
    Avatar,
    Upload
} from "antd";
import { BookOutlined, UserOutlined, PlusOutlined, DeleteOutlined, EditOutlined, SettingFilled, ArrowRightOutlined, ArrowLeftOutlined, UnorderedListOutlined } from "@ant-design/icons";

import moment from "moment";
import type { Authors as TypesaAthors } from '../../books';
import type { ProColumns } from "@ant-design/pro-table";
const BREADCRUMB = {
    title: "作家管理",
    lists: [
        { title: "作家管理", url: "/books/authors" },

    ],
    buttons: [{ title: "添加", url: "/books/authors/add" }],
};
type State = Server.State & {
    data?: TypesaAthors;
    idcard?: string,
    children?: [],
    area?: [],
    area_id?: number,
    drawer_visible?: boolean;
};
class Authors extends Basic_Component {
    formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    categorys = [];
    children = [];
    sms_code = {};
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
    async get_sms_code(reset = false) {
        if (reset || Object.keys(this.sms_code || {}).length === 0) {
            const res = await webapi.request.get(`server/sms`, { cache: true, loading: false });
            this.sms_code = res.code === 10000 ? res.data : {};
        }
        return this.sms_code;
    }

    /*----------------------1 other start----------------------*/

    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/
    /**
   * index  列表数据
   */
    async __init_index(d = {}) {
        this.__breadcrumb({});
        // const sms_code = await this.get_sms_code();
        // this.setState({ sms_code });
    }
    init_lists = async (
        params,
        sort,
        filter
    ) => {
        const state = this.state;
        let d = params;
        d.filters = state.filters;
        d.q = state.q;
        d.order_field = state.order_field;
        d.order_value = state.order_value;
        d.row_count = state.pagination.pageSize;
        d.offset = state.pagination.current;
        d.state_delete = 1;
        // d.t = 123;
        const res = await webapi.request.get("books/authors/lists", { data: d });
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
                success: true,
                total: res.num_rows,
            };
        }

    }
    async __init_add_edit(u_action: string) {
        let b = { title: "" };
        let data = { name: "" };
        const user_id = this.state.id;
        if (u_action === "edit" && user_id) {
            const res = await webapi.request.get("books/authors/get", {
                data: {
                    user_id
                },
            });
            if (res.code === 10000) {
                data = res.data;
            }
            b.title = `${BREADCRUMB.title}-${data.name}-编辑`;
        } else {
            b.title = `${BREADCRUMB.title}-添加`;
        }
        const sms_code = await this.get_sms_code();
        this.setState({ data, sms_code });
        this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
        this.__breadcrumb(b);
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/

    /**
    * 提交
    **/
    handle_submit = async (values: TypesaAthors) => {
        const state = this.state;
        values.user_id = state.id;
        values.field_name = 'avatar';
        // values.t = '123';
        const data = new FormData();
        Object.keys(values).map((k) => {
            data.append(k, values[k] || '');

        });

        state.data.file && data.append("avatar", state.data.file);
        const res = await webapi.request.post("books/authors/dopost", { data, file: true });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace("/books/authors");
        } else {
            webapi.message.error(res.message);
        }
    };
    /**
    * 删除
    **/
    handle_delete(id: number) {
        this.__handle_delete({
            url: `books/authors/delete`,
            data: { id }
        });
    }

    handle_blur_idcard = async (event) => {
        const state = this.state as State;
        if (state.idcard) {
            const data = await webapi.request.post("account/idcard", {
                data: { idcard: state.idcard }, loading: false,
            });
            if (data.code === 10000) {
                this.setState({
                    data: {
                        ...state.data,
                        idcard_model: data.idcard_model,
                    },
                });
            }
        }
    };
    handle_change_idcard = (event) => {
        const val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
        if (val != "") {
            this.setState({
                idcard: val,
            });
        }
    };
    handle_profile_area_id = (value) => {
        const state = this.state as unknown as State;
        const area_id = value[value.length - 1];
        if (area_id != state.area_id) {
            this.setState({
                area_id: area_id,
            });
        }
    };
    handle_sms_code_select = (value, item = {}) => {
        const data = this.state.data;
        data.mobile_code = item.data.code;
        data.area_code = item.data.area_code;
        this.setState({ data });
        this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
    }
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    __render_index() {
        const state = this.state as unknown as State;
        // console.log(state); 
        return <>
            <ProList
                params={{ ...state.params, q: state.q }}
                headerTitle='作家列表'
                rowKey="user_id"
                search={false}
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
                pagination={{ ...this.state.pagination }}
                request={this.init_lists}
                metas={{
                    avatar: {
                        render: (_, item) => {
                            return <Avatar size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} src={item.avatar} />;
                        }
                    },
                    title: {
                        render: (_, item) => {
                            return <>
                                <a
                                    onClick={(e) => {
                                        e.preventDefault();

                                    }}
                                >{item.pseudonym}</a>
                            </>
                        }
                    },
                    description: {
                        render: (_, item) => {
                            return (
                                <Space>
                                    <Link
                                        to={`?end_of_serial=${item.end_of_serial}`}
                                        className={
                                            'tag fill-' +
                                            (item.end_of_serial == 1 ? 'stress' : 'primary')
                                        }
                                        onClick={() => this.__handle_init_index()}
                                    >
                                        <Tag>{item.end_of_serial == 1 ? '连载' : '完结'}</Tag>
                                    </Link>



                                    <span>
                                        作品ID:{item.user_id}
                                    </span>

                                    <span>
                                        创建时间:
                                        {item.create_time > 0 ? moment((item.create_time) * 1000).format(
                                            "YYYY-MM-DD HH:mm:ss"
                                        ) : ''}</span>

                                </Space>
                            );
                        },
                    },
                    content: {
                        render: (_, item) => {
                            return <>
                                <span>
                                    作品ID:{item.user_id}
                                </span>
                            </>;
                        },

                    },
                    actions: {
                        render: (_, item) => {
                            return [
                                <Dropdown menu={{ items: this.__render_lists_actions(item) }} key='dropdown'>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        size="small"
                                        icon={<UnorderedListOutlined />}
                                    />
                                </Dropdown>
                            ]
                        }
                    }
                }}
            >
            </ProList>

        </>
    }
    __render_lists_actions(item) {
        const state = this.state || {};
        const items: MenuProps['items'] = [
            {
                key: '1',
                label: <Link to={`/books/authors/edit/${item.user_id}`}>
                    <Button type="primary" shape="round" icon={<BookOutlined />} size="default">
                        编辑
                    </Button>
                </Link>,
            },
        ];

        return items;
    }
    /**
   * 添加-编辑 子类重写
   * @return obj
   */
    __render_add_edit(u_action: string) {
        const state = this.state as unknown as State;
        const data = state.data || {};
        const sms_code = state.sms_code || {};
        // console.log(sms_code);
        let suffix = <span />;
        const prefixSelector = (
            <Form.Item noStyle>
                <Select
                    showSearch
                    style={{
                        width: 200,
                    }}
                    filterOption={(input, option) => {
                        // console.log(option);
                        //(option?.data ?? '')
                        return (option?.data ? (`${option.data.area}${option.data.code}${option.data.name}${option.data.area_code}`) : '').toLowerCase().includes(input.toLowerCase())
                    }}
                    options={(Object.keys(sms_code).map((i) => {
                        const item = sms_code[i] || {};
                        return { value: item.id, data: item, label: <>{item.name}(+{item.code})</> };
                    }))}
                    onChange={this.handle_sms_code_select}
                >
                </Select>
            </Form.Item>
        );
        return (
            <Form
                ref={this.formRef}
                onFinish={this.handle_submit}
                {...this.__form_item_layout()}
            >
                <ProCard
                    tabs={{
                        tabPosition: 'top',
                        items: [
                            {
                                label: `基本信息`,
                                key: 'tab1',
                                children: <>
                                    <Form.Item label="头像">
                                        <Space align="center" size="middle">

                                            <ImgCrop >
                                                <Upload {...this.__upload_single_props()}>
                                                    <Avatar
                                                        size={64}
                                                        src={data['avatar'] || ''}

                                                    />
                                                </Upload>
                                            </ImgCrop>
                                        </Space>
                                    </Form.Item>
                                    <Form.Item name="mobile" label="手机号码">
                                        <Input addonBefore={prefixSelector} />
                                    </Form.Item>
                                    <Form.Item name="mobile_code" label="区号" hidden={true}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="area_code" label="区域代码" hidden={true}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="nickname" label="昵称">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="pseudonym" label="笔名">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="intro" label="个人简介">
                                        <Input.TextArea placeholder="个人简介" rows={4} />
                                    </Form.Item>

                                </>,
                            },
                            {
                                label: `信息方式`,
                                key: 'tab2',
                                children: <>
                                    <Form.Item name="userrealname" label="姓名">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="idcard" label="身份证号">
                                        <Input
                                            suffix={suffix}
                                            onBlur={this.handle_blur_idcard}
                                            onChange={this.handle_change_idcard}
                                        />
                                    </Form.Item>
                                    <Form.Item name="area" label="所在省市">
                                        <Cascader
                                            options={state.area}
                                            showSearch
                                            placeholder="请选择地址"
                                            onChange={this.handle_profile_area_id}
                                        />
                                    </Form.Item>
                                    <Form.Item name="address" label="详细地址">
                                        <Input />
                                    </Form.Item>
                                </>,
                            }
                        ],
                        onChange: (key) => {
                            console.log(key);
                        },
                    }}
                    actions={[
                        <Form.Item {...this.__tail_layout()}>
                            <Space style={{ display: 'flex' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={this.props.server.loading}
                                    shape="round"
                                >
                                    {this.props.server.loading ? "正在提交" : "立即提交"}
                                </Button>
                                <Link className="button" to={"/books/authors"}>
                                    返回
                                </Link>
                            </Space>
                        </Form.Item>
                        ,

                    ]}
                />



            </Form>
        );
    }


    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Authors);
