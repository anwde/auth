// @ts-nocheck
import React from "react";
import Basic_Component from "../../components/base/component";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../utils/webapi";
import moment from "moment";
import ImgCrop from "antd-img-crop";
import {
    ProList, ModalForm, ProForm,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { Menu, Dropdown, Button, Pagination, Avatar, Tag, Form, Space, Divider, Input, Image, Upload, Modal } from "antd";
import { FileWordOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UnorderedListOutlined, SettingFilled } from "@ant-design/icons";
import { ProTable, TableDropdown } from '@ant-design/pro-components';
const BREADCRUMB = {
    title: "推荐位管理",
    lists: [
        {
            title: "推荐位管理",
            url: "/area",
        },
    ],
    buttons: [

    ],
};
class AreaItem extends Basic_Component {
    formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    area = {};
    constructor(props: any) {
        super(props);
    }
    /*----------------------0 parent start----------------------*/
    /**
    * 面包屑导航
    */
    __breadcrumb(data = {}) {
        super.__breadcrumb({ ...BREADCRUMB, ...data });
    }
    /*----------------------0 parent end----------------------*/

    /*----------------------1 other start----------------------*/
    /**
     * 获取location
     * @return obj
     */
    async get_area(id, reset = false): Promise<any> {
        if (reset || Object.keys((this.area && this.area[id]) || {}).length === 0) {
            const res = await webapi.request.get("area/home/get", { data: { id } });
            this.area[id] = res.code === 10000 ? res.data : {};
        }
        return this.area[id];
    }
    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/
    __init_state_before() {
        const params = this.__get_params();
        console.log(params)
        return {
            area_id: params.area_id,
        };
    }
    async __init_index() {
        const state = this.state;
        const area = await this.get_area(state.area_id);
        const b = {
            title: `${BREADCRUMB.title}-${area.name}`,
            lists: [

                {
                    title: "推荐位管理",
                    url: "/area/home/",
                }
            ],
            buttons: [
                { title: "添加", url: `/area/item/add/${this.state.area_id}` },
            ]
        };
        this.__breadcrumb(b);
    }
    init_index = async (params,
        sort,
        filter,) => {
        const state = this.state;
        const d = params;
        d.filters = state.filters;
        d.q = state.q;
        d.order_field = state.order_field;
        d.order_value = state.order_value;
        d.row_count = state.pagination.pageSize;
        d.offset = state.pagination.current;
        d.area_id = state.area_id;
        d.state_delete = 1;
        // d.t=123;
        const res = await webapi.request.get("area/item/lists", { data: d });
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
    async __init_add_edit(action: string) {
        const state = this.state;
        const area = await this.get_area(state.area_id);
        let b = {
            title: "", lists: [
                {
                    title: "推荐位管理",
                    url: "/area/home/",
                },
                {
                    title: `${area.name}`,
                    url: `/area/item/index/${area.id}`,
                }
            ],
        };
        let data = { name: "" };
        if (action === "edit" && this.state.id) {
            const res = await webapi.request.get("area/item/get", {
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

        this.setState({ data: data, area });
        this.formRef.current && this.formRef.current.setFieldsValue(data);
        this.__breadcrumb(b);
    }

    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/
    //提交
    handle_submit = async (values) => {
        const state = this.state;
        const data = new FormData();
        Object.keys(values).map((t) => {
            values[t] && data.append(t, values[t]);
        });
        data.append("id", state.id || 0);
        data.append("area_id", state.area_id);
        state.data.file && data.append("image", state.data.file);
        const res = await webapi.request.post("area/item/dopost", { data, file: true });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace(`/area/item/index/${state.area_id}`);
        } else {
            webapi.message.error(res.message);
        }
    };

    //删除 
    handle_delete(id: number) {
        this.__handle_delete({
            url: `area/item/delete`,
            data: { id },
        });
    }
    //选择鼠标获得焦点
    handleSelectMouseEnter = (k) => {
        this.setState({ [k]: true });
    }
    //选择鼠标失去焦点
    handleSelectMouseLeave = (k) => {
        this.setState({ [k]: false });
    }
    handle_modal_books_lists = async (d = {}) => {
        const res = await webapi.request.get("books/related/lists", { data: d });
        const modal_books_lists = res.code === 10000 && res.num_rows > 0 ? res.lists : [];
        this.setState({ modal_books: true, modal_books_lists });
    }
    handle_modal_books_open = (modal_books) => {
        this.setState({ modal_books });
    }
    handle_modal_books_submit = () => {
        const state = this.state;
        const book = state.selected_book || { id: 0 };
        if (book.id == 0) {
            webapi.message.error('请选择');
            return false;
        }
        const data = { ...state.data, link: book.id, book };
        if (!data.intro && book.intro) {
            data.intro = book.intro;
        }
        if (!data.name && book.name) {
            data.name = book.name;
        }

        this.setState({ data }, () => this.handle_modal_books_open(false));

        this.formRef.current && this.formRef.current.setFieldsValue(data);
    }
    handleModalFormFinish = async (values) => {
        const state = this.state;
        if (values.url && webapi.utils.isValidUrl(values.url)) {
            const data = { ...state.data, image: values.url };
            this.setState({ data: { ...state.data, 'image': values.url } });
            this.formRef.current && this.formRef.current.setFieldsValue(data);
            return true;
        }
        return false;
    }
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    __render_index() {
        const state = this.state;
        const columns = [{
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

        },
        {
            title: "排序",
            sorter: true,
            dataIndex: "idx",
            align: "center",

        },
        {
            title: "链接",
            sorter: true,
            dataIndex: "link",
            align: "center",

        },

        {
            title: "更新时间",
            sorter: true,
            hideInSearch: true,
            dataIndex: "create_time",
            align: "center",
            width: 200,
            render: (_, row) => {
                return <>
                    {row.update_time > 0 ? moment((row.update_time as number) * 1000).format(
                        "YYYY-MM-DD HH:mm:ss") : '--'}

                </>;
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
                return <>
                    {moment((row.create_time as number) * 1000).format(
                        "YYYY-MM-DD HH:mm:ss")}

                </>;
            },
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

                        <Link to={`/area/item/edit/${row.area_id}/${row.id}`}>
                            <Button type="primary" shape="circle" icon={<EditOutlined />} />
                        </Link>
                    </Space>
                );
            },
        },
        ];
        return <>
            <ProTable
                headerTitle="推荐位列表"
                rowKey={"id"}
                columns={columns}
                pagination={this.state.pagination}
                request={this.init_index}
                onChange={this.__handle_table_change}
                scroll={{ x: 1000, y: "calc(100vh - 290px)" }}
                search={false}
                toolBarRender={() => [
                    <Input.Search
                        placeholder="搜索"
                        allowClear
                        enterButton="Search"
                        size="large"
                        enterButton
                    />
                ]
                }
            >
            </ProTable></>;
    }
    /**
    * 添加-编辑 子类重写
    * @return obj
    */
    __render_add_edit(u_action: string) {
        const state = this.state;
        const area = state.area || {};
        const style = {
            textAlign: 'center',
            verticalAlign: 'top',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'border-color 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            position: 'relative',
        };
        // console.log((state.data.book && state.data.book.name) || "");
        return (
            <>

                <Modal
                    width="61.8vw"
                    height="calc(100vh - 40px)"
                    bodyStyle={{
                        padding: 0,
                        height: "calc(100vh - 180px)",
                        overflowX: "hidden",
                        overflowY: "scroll",
                    }}
                    centered={true}
                    open={state.modal_books}
                    onOk={this.handle_modal_books_submit}
                    onCancel={() => this.handle_modal_books_open(false)}


                >
                    <ProList
                        showActions='hover'
                        itemLayout="vertical"
                        rowKey="id"
                        toolBarRender={(() => {
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
                        })}
                        dataSource={state.modal_books_lists || []}
                        pagination={state.pagination}
                        rowSelection={{
                            selectedRowKeys: state.selected_book ? [state.selected_book.id] : [],
                            onSelect: (record, selected) => {
                                let book = { id: 0 };
                                if (selected) {
                                    book = record;
                                }
                                this.setState({ selected_book: book });
                            },
                            onSelectAll: (selected) => {
                                console.log(selected)
                            },
                            onSelectNone: (selected) => {
                                console.log(selected)
                            }
                        }}
                        metas={{
                            title: {
                                render: (_, item) => {
                                    return <>
                                        {item.name}
                                    </>
                                }
                            },
                            content: {
                                render: (_, item) => {
                                    return <>
                                        <div>
                                            {item.intro}
                                        </div>
                                    </>;
                                },

                            },
                            extra: {
                                render: (_, item) => {
                                    return <>
                                        <Image
                                            width={170.8152}
                                            height={200}
                                            src={item.image || ''}
                                            preview={false}
                                            style={{ borderRadius: '0.6rem' }}
                                            fallback="data:image/png;base64,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"
                                        />

                                    </>;
                                },
                            },
                        }}
                    />
                </Modal>
                <Form
                    ref={this.formRef}
                    onFinish={this.handle_submit}
                    {...this.__form_item_layout()}
                >
                    {area.type == 3 ? (<Form.Item label="选择作品">
                        <div style={{ width: 173, border: state.upload_books_hover ? '1px dashed #1677ff' : '1px dashed #d9d9d9', ...style }}
                            onMouseEnter={() => this.handleSelectMouseEnter('upload_books_hover')}
                            onMouseLeave={() => this.handleSelectMouseLeave('upload_books_hover')}
                            onClick={() => this.handle_modal_books_lists()}
                        >
                            <Image
                                style={{ borderRadius: '0.6rem' }}
                                preview={false}
                                width={170.8152}
                                height={200}
                                src={(state.data.book && state.data.book.image) || ""}
                                alt={(state.data.book && state.data.book.name) || ""}
                                fallback="data:image/png;base64,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"
                            />
                            <span>{(state.data.book && state.data.book.name) || ""}</span>
                        </div>
                    </Form.Item>) : ''}
                    <Form.Item label="封面图片">
                        <Space align="center" direction="vertical">
                            <Upload {...this.__upload_single_props()}
                            >

                                <div style={{ border: state.upload_image_hover ? '1px dashed #1677ff' : '1px dashed #d9d9d9', ...style }}
                                    onMouseEnter={() => this.handleSelectMouseEnter('upload_image_hover')}
                                    onMouseLeave={() => this.handleSelectMouseLeave('upload_image_hover')}
                                >
                                    <Image
                                        style={{ borderRadius: '0.6rem' }}
                                        preview={false}
                                        width={170.8152}
                                        height={200}
                                        src={state.data.image || ''}

                                        fallback="data:image/png;base64,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"
                                    />
                                </div>
                            </Upload>
                            <ModalForm
                                title="选择网络图片"
                                trigger={
                                    <Button
                                        type="primary"
                                        loading={this.props.server.loading}
                                        shape="round"
                                    >
                                        选择网络图片
                                    </Button>
                                }
                                autoFocusFirstInput
                                onFinish={this.handleModalFormFinish}
                            >
                                <Form.Item name="url" label="图片地址" placeholder="请输入图片地址">
                                    <Input />
                                </Form.Item>
                            </ModalForm>

                        </Space>
                    </Form.Item>

                    <Form.Item name="name" label="名称">
                        <Input />
                    </Form.Item>
                    <Form.Item name="idx" label="排序">
                        <Input />
                    </Form.Item>
                    <Form.Item name="link" label="链接" hidden={area.type == 3 ? true : false}>
                        <Input />
                    </Form.Item>


                    <Form.Item name="tag" label="标签">
                        <Input />
                    </Form.Item>
                    <Form.Item name="intro" label="简介">
                        <Input.TextArea showCount
                            maxLength={382}
                            style={{ height: 120, resize: 'none' }} />
                    </Form.Item>
                    <Form.Item name="image" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item {...this.__tail_layout()}>

                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={this.props.server.loading}
                                shape="round"
                            >
                                {this.props.server.loading ? "正在提交" : "立即提交"}
                            </Button>
                            <Link className="button" to={`/area/item/index/${state.area_id}`}>
                                返回
                            </Link>
                        </Space>



                    </Form.Item>
                </Form >
            </>
        );
    }
    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(AreaItem);
