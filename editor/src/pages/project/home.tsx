import React from "react";
import Basic_Component from "../../components/base/component";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ProList, ProDescriptions } from '@ant-design/pro-components';
import { Button, Tag, Input, Form, Space, Upload, Image, Progress, Tabs } from 'antd';
import ImgCrop from "antd-img-crop";
import { FormInstance } from "antd/lib/form";
import webapi from "../../utils/webapi";
import moment from "moment";
import type { Project as TypesProject } from './project';
import { LikeOutlined, MessageOutlined, StarOutlined, AndroidOutlined, AppleOutlined } from '@ant-design/icons';
const BREADCRUMB = {
    title: "项目管理",
    lists: [
        { title: "项目管理", url: "/project/home" },

    ],
    buttons: [{ title: "添加", url: "/project/home/add" }],
};
const IconText = ({ icon, text }: { icon: any; text: string }) => (
    <span>
        {React.createElement(icon, { style: { marginInlineEnd: 8 } })}
        {text}
    </span>
);
type State = Server.State & {
    data?: TypesProject;
    upload_books_hover?: boolean;

};
class Project extends Basic_Component {
    formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
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

    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/
    /**
   * index  列表数据
   */
    async __init_index(d = {}) {
        this.__breadcrumb({});
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
        const res = await webapi.request.get("project/home/lists", { data: d });
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
    async __init_detail() {
        const state = this.state;
        let b = { title: "" };
        let data = { name: "" };
        const id = state.id;
        const res = await webapi.request.get("project/home/get", {
            data: {
                id
            },
        });
        if (res.code !== 10000) {
            return 0;
        }
        data = res.data;
        b.title = `${BREADCRUMB.title}-${data.name}`;
        this.setState({ data });
        this.__breadcrumb(b);
    }
    async __init_add_edit(u_action: string) {
        let b = { title: "" };
        let data = { name: "" };
        const id = this.state.id;
        if (u_action === "edit" && id) {
            const res = await webapi.request.get("project/home/get", {
                data: {
                    id
                },
            });
            if (res.code === 10000) {
                data = res.data;
            }
            b.title = `${BREADCRUMB.title}-${data.name}-编辑`;
        } else {
            b.title = `${BREADCRUMB.title}-添加`;
        }
        this.setState({ data });
        this.formRef.current && this.formRef.current.setFieldsValue({ ...data });
        this.__breadcrumb(b);
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/
    /**
    * 提交
    **/
    handle_submit = async (data: TypesProject) => {
        data.id = this.state.id;
        const res = await webapi.request.post("project/home/dopost?t=123", { data });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.props.history.replace("/project/home");
            // this.get_tag(true);
        } else {
            webapi.message.error(res.message);
        }
    };
    //选择书鼠标获得焦点
    handleSelectBooksMouseEnter = (k) => {
        this.setState({ [k]: true });
    }
    //选择书鼠标失去焦点
    handleSelectBooksMouseLeave = (k) => {
        this.setState({ [k]: false });
    }
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    __render_index() {
        const dataSource = [
            {
                title: '语雀的天空',
                content: [
                    {
                        label: '模型数',
                        value: 2905,
                    },
                    {
                        label: '指标数',
                        value: 3722,
                    },
                    {
                        label: '实验状态',
                        value: '成功',
                        status: 'success',
                    },
                ],
            },
            {
                title: 'Ant Design',
                content: [
                    {
                        label: '模型数',
                        value: 2904,
                    },
                    {
                        label: '指标数',
                        value: 3721,
                    },
                    {
                        label: '实验状态',
                        value: '成功',
                        status: 'success',
                    },
                ],
            },
            {
                title: '蚂蚁金服体验科技',
                content: [
                    {
                        label: '模型数',
                        value: 2903,
                    },
                    {
                        label: '指标数',
                        value: 3720,
                    },
                    {
                        label: '实验状态',
                        value: '成功',
                        status: 'success',
                    },
                ],
            },
            {
                title: 'TechUI',
                content: [
                    {
                        label: '模型数',
                        value: 2905,
                    },
                    {
                        label: '指标数',
                        value: 3722,
                    },
                    {
                        label: '实验状态',
                        value: '成功',
                        status: 'success',
                    },
                ],
            },
        ];
        return (
            <ProList<TypesProject>
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
                request={this.init_lists}
                itemLayout="vertical"
                rowKey="id"
                headerTitle="项目管理"
                // dataSource={dataSource}
                metas={{
                    title: {
                        dataIndex: 'name',
                        render: (txt, item) => {
                            return <Link to={`/project/home/detail/${item.id}`}>{txt}</Link>
                        }
                    },
                    description: {
                        render: () => (
                            <>
                                <Tag>语雀专栏</Tag>
                                <Tag>设计语言</Tag>
                                <Tag>蚂蚁金服</Tag>
                            </>
                        ),
                    },
                    actions: {
                        render: () => [
                            <IconText
                                icon={StarOutlined}
                                text="156"
                                key="list-vertical-star-o"
                            />,
                            <IconText
                                icon={LikeOutlined}
                                text="156"
                                key="list-vertical-like-o"
                            />,
                            <IconText
                                icon={MessageOutlined}
                                text="2"
                                key="list-vertical-message"
                            />,
                        ],
                    },
                    extra: {
                        render: () => (
                            <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />
                        ),
                    },
                    content: {
                        render: (_, row) => {
                            return (
                                <div>
                                    <div>
                                        {row.description}
                                    </div>
                                    <div
                                        key="label"
                                        style={{ display: 'flex', justifyContent: 'space-around' }}
                                    >

                                        <div  >
                                            <div style={{ color: '#00000073' }}>优先级</div>
                                            <Progress percent={30} size='small' />
                                        </div>
                                        <div  >
                                            <div style={{ color: '#00000073' }}>进度</div>
                                            <Progress percent={30} size='small' />
                                        </div>
                                        <div  >
                                            <div style={{ color: '#00000073' }}>开始时间</div>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#52c41a',
                                                    marginInlineEnd: 8,
                                                }}
                                            />{row.start_time > 0 ? moment((row.start_time as number) * 1000).format(
                                                "YYYY-MM-DD HH:mm:ss"
                                            ) : '-'}
                                        </div>
                                        <div  >
                                            <div style={{ color: '#00000073' }}>结束时间</div>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#ff4d4f',
                                                    marginInlineEnd: 8,
                                                }}
                                            />{row.stop_time > 0 ? moment((row.stop_time as number) * 1000).format(
                                                "YYYY-MM-DD HH:mm:ss"
                                            ) : '-'}
                                        </div>

                                        {/* {(text as any[]).map((t) => (
                                            <div key={t.label}>
                                                <div style={{ color: '#00000073' }}>{t.label}</div>
                                                <div style={{ color: '#000000D9' }}>
                                                    {t.status === 'success' && (
                                                        <span
                                                            style={{
                                                                display: 'inline-block',
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                backgroundColor: '#52c41a',
                                                                marginInlineEnd: 8,
                                                            }}
                                                        />
                                                    )}
                                                    {t.value}
                                                </div>
                                            </div>
                                        ))} */}
                                    </div>
                                </div>
                            );
                        },
                    },
                }}
            />
        );
    }
    __render_add_edit(u_action: any): JSX.Element {
        const state = this.state as unknown as State;
        return (
            <Form
                ref={this.formRef}
                onFinish={this.handle_submit}
                {...this.__form_item_layout()}
            >
                {this.__render_add_edit_children(state.u_action)}
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
                        <Link className="button" to={"/project/home"}>
                            返回
                        </Link>
                    </Space>
                </Form.Item>
            </Form>
        );
    }
    /**
  * 添加、编辑
  * @return obj
  */
    __render_add_edit_children(u_action: string) {
        const state = this.state as unknown as State;
        const data = state.data;
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
            border: state.upload_books_hover ? '1px dashed #1677ff' : '1px dashed #d9d9d9',
            position: 'relative',
        } as React.CSSProperties;
        return (
            <>
                <Form.Item name="name" label="名称">
                    <Input />
                </Form.Item>
                <Form.Item label="封面">
                    <ImgCrop rotationSlider modalTitle="请编辑图片" aspect={0.618}>
                        <Upload {...this.__upload_single_props()}
                        >

                            <div style={style}
                                onMouseEnter={() => this.handleSelectBooksMouseEnter('upload_books_hover')}
                                onMouseLeave={() => this.handleSelectBooksMouseLeave('upload_books_hover')}
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

                    </ImgCrop>
                </Form.Item>
                <Form.Item label="介绍" name="intro">
                    <Input.TextArea
                        placeholder="请输入介绍"
                        autoSize={{ minRows: 5, maxRows: 10 }}
                    />
                </Form.Item>

                <Form.Item label="内容" name="content">
                    <Input.TextArea
                        placeholder="请输入内容"
                        autoSize={{ minRows: 5, maxRows: 10 }}
                    />
                </Form.Item>



            </>
        );
    }
    __render_detail(): JSX.Element {
        const state = this.state;
        const data = state.data;
        return <>
            <ProDescriptions
                column={2}
                title={data.name}
                tooltip="包含了从服务器请求，columns等功能"
            >
                <ProDescriptions.Item valueType="option">
                    <Button key="primary" type="primary">
                        提交
                    </Button>
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    span={2}
                    valueType="text"
                    contentStyle={{
                        maxWidth: '80%',
                    }}
                    renderText={(_) => {
                        return _ + _;
                    }}
                    ellipsis
                    label="描述"
                >{data.description}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    label="金额"
                    tooltip="仅供参考，以实际为准"
                    valueType="money"
                >
                    100
                </ProDescriptions.Item>
                <ProDescriptions.Item label="百分比" valueType="percent">
                    100
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    label="选择框"
                    valueEnum={{
                        all: { text: '全部', status: 'Default' },
                        open: {
                            text: '未解决',
                            status: 'Error',
                        },
                        closed: {
                            text: '已解决',
                            status: 'Success',
                        },
                        processing: {
                            text: '解决中',
                            status: 'Processing',
                        },
                    }}
                >
                    open
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    label="远程选择框"
                    request={async () => [
                        { label: '全部', value: 'all' },
                        { label: '未解决', value: 'open' },
                        { label: '已解决', value: 'closed' },
                        { label: '解决中', value: 'processing' },
                    ]}
                >
                    closed
                </ProDescriptions.Item>
                <ProDescriptions.Item label="进度条" valueType="progress">
                    40
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    span={2}
                >
                    <Tabs
                        defaultActiveKey="2"
                        items={[AppleOutlined, AndroidOutlined].map((Icon, i) => {
                            const id = String(i + 1);

                            return {
                                label: (
                                    <span>
                                        <Icon />
                                        Tab {id}
                                    </span>
                                ),
                                key: id,
                                children: `Tab ${id}`,
                            };
                        })}
                    />
                </ProDescriptions.Item>

            </ProDescriptions></>
    }
    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Project);
