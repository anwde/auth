// @ts-nocheck
import VirtualList from 'rc-virtual-list';
import Basic_Component from "../../../components/base/component";
import webapi from "../../../utils/webapi";
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
    List,
    Skeleton
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SettingFilled, ArrowRightOutlined, ArrowLeftOutlined, UnorderedListOutlined } from "@ant-design/icons";

export default class Basic_Books extends Basic_Component {
    group = {};
    category_dict = {};
    category = [];
    tag = {};
    book = {};
    volume = {};
    volumes = {};
    channel = {};
    dutys = [];
    server_state = {};
    base_url = 'books/';
    constructor(props) {
        super(props);
        webapi.store.dispatch({
            type: "SIDEBARACTIVE",
            data: { expand: { 47: true }, selected: 48 },
        });
    }

    /*----------------------1 other start----------------------*/

    async get_dutys(reset = false) {
        if (reset || (this.dutys || []).length === 0) {
            const res = await webapi.request.get("books/home/duty", { loading: false });
            this.dutys = res.code === 10000 ? res.lists : [];
        }
        return this.dutys;
    }

    /**
     * other 获取服务器状态
     */
    async get_server_state(reset = false) {
        if (reset || Object.keys(this.server_state || {}).length === 0) {
            const res = await webapi.request.get(`books/home/state`, { cache: true, loading: false });
            this.server_state = res.code === 10000 ? res.data : {};
        }
        return this.server_state;
    }
    async get_category_dict(reset = false) {
        if (reset || Object.keys(this.category_dict || {}).length === 0) {
            const res = await webapi.request.get(`${this.base_url}categorys/dict`, { cache: true, loading: false });
            this.category_dict = res.code === 10000 ? res.data : {};
        }
        return this.category_dict;
    }

    async get_category(reset = false) {
        if (reset || (this.category || []).length === 0) {
            const res = await webapi.request.get(`${this.base_url}categorys/tree`, { cache: true, loading: false, data: {} });
            this.category = res.code === 10000 ? res.lists : [];
        }
        return this.category;
    }
    async get_tag(reset = false) {
        if (reset || Object.keys(this.tag || {}).length === 0) {
            const res = await webapi.request.get(`${this.base_url}tags/dict`, { cache: true, loading: false });
            this.tag = res.code === 10000 ? res.data : {};
        }
        return this.tag;
    }
    async get_book(book_id, reset = false,) {
        if (reset || Object.keys(this.book[book_id] || {}).length === 0) {
            const res = await webapi.request.get(`${this.base_url}home/get`, {
                data: {
                    id: book_id,
                }
                , loading: false
            });

            this.book[book_id] = res.code === 10000 ? res.data : {};

        }
        return this.book[book_id];
    }
    async get_volumes(book_id, d = {}, reset = false) {
        const volumes = this.volumes
            ? this.volumes[book_id]
                ? this.volumes[book_id]
                : []
            : [];
        if (reset || volume.length === 0) {
            let p = d;
            p.book_id = book_id;
            p.loading = false;
            const res = await webapi.request.get(`${this.base_url}volumes/lists`, p);
            if (res.code === 10000) {
                volume = res.lists;
            }
        }
        this.volumes[book_id] = volumes;
        return this.volumes[book_id];
    }
    async get_volume_dict(book_id, reset = false) {
        let volume = this.volume
            ? this.volume[book_id]
                ? this.volume[book_id]
                : {}
            : {};
        if (reset || Object.keys(volume).length === 0) {
            const data = { book_id };
            const res = await webapi.request.get(`${this.base_url}volumes/dict`, { data, loading: false });
            if (res.code === 10000) {
                volume = res.data;
            }
        }
        this.volume[book_id] = volume;
        return this.volume[book_id];
    }

    async get_channel(reset = false) {
        if (reset || Object.keys(this.channel).length === 0) {
            const res = await webapi.request.get("books/home/channel", { loading: false });
            this.channel = res.code === 10000 ? res.data : {};
        }
        return this.channel;
    }

    async get_author_info(user_id, reset = false) {
        let author = this.authors
            ? this.authors[user_id]
                ? this.authors[user_id]
                : {}
            : {};
        if (reset || Object.keys(author).length === 0) {
            var res = await webapi.request.get("novel/author/info", {
                user_id,
            });
            if (res.code === 10000) {
                author = res.data;
            }
        }
        this.authors = this.authors || {};
        this.authors[user_id] = author;
        return this.authors[user_id];
    }
    __get_chapter_content = async (data = {}) => {
        return await webapi.request.get(`${this.base_url}chapters/content`, { data });

    };
    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/

    __handle_init_before = () => {
        if (!this.category || this.category.length === 0) {
            this.get_category();
        }
        if (!this.channel || Object.keys(this.channel).length === 0) {
            this.get_channel();
        }
        // this.get_dutys();
        if (
            !this.server_state ||
            Object.keys(this.server_state).length === 0
        ) {
            this.get_server_state();
        }
    };

    __init_state_before() {
        return {
            checked_ids: {},
            checkbox_all: false,
            book_id: this.props.match.params.book_id || 0,
        };
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/
    handle_checkbox_ids = (checked_ids, fun) => {
        this.setState({ checked_ids }, () => { fun && fun() });
    }
    handle_checkbox_all = () => {
        const checkbox_all = !this.state.checkbox_all;
        const checked_ids = this.state.checked_ids || {};
        this.state.lists.map((item, key) => {
            if (checked_ids[item.id]) {
                delete checked_ids[item.id];
            } else {
                checked_ids[item.id] = item.id;
            }
        });
        this.setState({ checkbox_all });
        this.handle_checkbox_ids(checked_ids);
    };
    handle_checkbox = (id) => {
        let checkbox_all = this.state.checkbox_all;
        const checked_ids = this.state.checked_ids || {};
        if (checked_ids[id]) {
            delete checked_ids[id];
        } else {
            checked_ids[id] = id;
        }
        if (Object.keys(checked_ids).length == this.state.lists.length) {
            checkbox_all = true;
        }
        this.setState({ checkbox_all, checked_ids });
    };
    __handle_init_index = () => {
        this.setState({ pagination: this.__init_page_data() }, () => { this.__init_index() });
    }

    //显示内容
    __handle_chapter_content = async (data = {}) => {
        const res = await this.__get_chapter_content(data);
        if (res.code === 10000) {
            this.setState({ data: res.data, chapter_content_modal_visible: true });
        } else {
            webapi.message.error(res.message);
        }
    };
    //显示大纲
    __handle_book_outline = async () => {
        const res = await webapi.request.get(`${this.base_url}home/outline`, { data: { id } });
        if (res.code === 10000) {
            this.setState({ data: res.data, book_outline_modal_visible: true });
        } else {
            webapi.message.error(res.message);
        }
    };

    //章节内容开关
    __handle_chapter_content_modal_visible = (v) => {
        this.setState({ chapter_content_modal_visible: v });
    };
    //更新章节内容素材
    __handle_materials = async (related_type) => {
        const state = this.state;
        const material = state.material;
        if (!material || material === '') {
            return 0;
        }
        const data = { related_type, name: material };
        // data.t=123;
        const res = await webapi.request.post(`${this.base_url}materials/dopost`, { data: this.__handle_materials_build_data(data) });
        if (res.code === 10000) {
            webapi.message.success(res.message);
        } else {
            webapi.message.error(res.message);
        }
    }
    //更新章节内容素材-子类需实现-构建提交数据
    __handle_materials_build_data = (data) => {
        return data;
    }
    //章节基本信息-打开
    __handle_chapter_base_drawer_open = (item) => {
        this.__handle_chapter_content_modal_visible(false)
        this.setState({
            item,
            chapter_base_drawer_visible: true,
        });
    };
    //章节基本信息-drawer关闭
    __handle_chapter_base_drawer_close = () => {
        this.setState({
            chapter_base_drawer_visible: false,
        });
    };
    //章节基本信息-提交
    __handle_chapter_base_drawer_submit = async () => {
        if (this.props.server.loading) {
            return false;
        }
        const data = this.state.item;
        delete (data['content']);
        delete (data['content_arr']);
        const res = await webapi.request.post(`${this.base_url}chapters/dopost`, { data });
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.__handle_chapter_base_drawer_close();
            this.__init_index();
        } else {
            webapi.message.error(res.message);
        }
    };

    //章节基本信息-输入框 
    __handle_chapter_base_input_change(v, event) {
        var val = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
        this.setState({ item: { ...this.state.item, [v]: val } });
    }
    handle_popover_change_visible = (visible) => {
        this.setState({ popover_visible: visible });
    };

    __handle_chapter_published_drawer_open = (item = {}, published_u_action) => {
        this.__handle_chapter_content_modal_visible(false);
        this.__handle_chapter_base_drawer_close();
        this.setState({
            item,
            published_u_action,
            published_drawer_visible: true,
        });
    };
    __handle_chapter_published_drawer_close = () => {
        this.setState({
            published_drawer_visible: false,
        });
    };
    __handle_chapter_published_datepicker_onChange = () => { };
    __handle_chapter_published_datepicker_onOk = (value) => {
        const time_related_id = moment(value).format("YYYY-MM-DD HH:mm:ss");
        this.setState({
            time_related_id
        });
        if (this.formRef.current) {
            const data = this.formRef.current.getFieldsValue();
            data.time_related_id = time_related_id;
            console.log(data)
            this.formRef.current && this.formRef.current.setFieldsValue(data);
        }
    };

    __handle_chapter_published_datepicker_disabledDate = (current) => {
        return current && current < moment().endOf("day");
    };
    /**
     *   提交
     */
    __handle_chapter_published_drawer_submit = () => {
        if (this.props.server.loading || !this.state.time_related_id) {
            return false;
        }
        let checked_ids = this.state.checked_ids || {};
        if (this.state.published_u_action == 'single') {
            checked_ids = { [this.state.item.id]: this.state.item.id };
        }
        this.setState(
            {
                checked_ids: checked_ids,
            },
            () => {
                this.handle_checked_sale(6, {
                    time_related_type: 2,
                    time_related_id: this.state.time_related_id,
                    success: () => {
                        this.handle_published_drawer_close();
                        this.__init_index();
                    }
                });
            }
        );
    };
    __handle_book_read = (params) => {
        this.setState({ chapters_lists: [] }, () => {
            this.__handle_book_read_chapter_content(params);
            this.__handle_book_read_drawer_open();
        });

    }
    //显示内容
    __handle_book_read_chapter_content = async (params = {}) => {
        const res = await this.__get_chapter_content(params);
        if (res.code === 10000) {
            this.setState({ chapter: res.data, chapters_lists: [...this.state.chapters_lists, res.data] });
        } else {
            webapi.message.error(res.message);
        }
    };
    __handle_book_read_drawer_close = () => {
        this.setState({ book_read_drawer_visible: false });
    }
    __handle_book_read_drawer_open = () => {
        this.setState({ book_read_drawer_visible: true });
    }
    loadMoreData = () => {
        const state = this.state;
        const chapter = state.chapter || {};
        console.log(chapter);
        if (chapter.next_id > 0) {
            this.__handle_book_read_chapter_content({ book_id: this.state.chapter.book_id, chapter_id: chapter.next_id });
        }


    }
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    //modal 和 drawer 操作
    __render_chapter_action_drawer_modal(o = { prev_id: true, next_id: true }) {
        const state = this.state;
        const data = state.data;
        const item = state.item || {};
        const content = data.content || [];
        const popover_content = (
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
                        menu={{ items: this.__render_chapter_dropdown_menus_action(data) }}
                        type="primary"
                        shape="round"
                        arrow={{ pointAtCenter: true }}
                    >
                        <Button
                            type="primary"
                            shape="round"
                            icon={<UnorderedListOutlined />}
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
        const items = [
            {
                label: '标记为人物',
                key: '1',
                onClick: () => {
                    this.__handle_materials(1);
                }
            },
            {
                label: '标记为地点',
                key: '2',
                onClick: () => {
                    this.__handle_materials(2);
                }
            },
            {
                label: '标记为时间',
                key: '3',
                onClick: () => {
                    this.__handle_materials(3);
                }
            },
            {
                label: '标记为建筑物',
                key: '4',
                onClick: () => {
                    this.__handle_materials(4);
                }
            },
        ];
        return (
            <>
                <Drawer
                    title="章节预发信息管理"
                    width={"61.8%"}
                    forceRender={true}
                    onClose={this.__handle_chapter_published_drawer_close}
                    visible={this.state.published_drawer_visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: "right",
                            }}
                        >
                            <Button
                                onClick={this.__handle_chapter_published_drawer_close}
                                style={{ marginRight: 8 }}
                            >
                                取消
                            </Button>
                            <Button
                                onClick={this.__handle_chapter_published_drawer_submit}
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
                    onClose={this.__handle_chapter_base_drawer_close}
                    open={state.chapter_base_drawer_visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: "right",
                            }}
                        >
                            <Button
                                onClick={this.__handle_chapter_base_drawer_close}
                                style={{ marginRight: 8 }}
                            >
                                取消
                            </Button>
                            <Button
                                onClick={this.__handle_chapter_base_drawer_submit}
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
                                value={item.name}
                                placeholder="请输入名称"
                                onChange={(o) => {
                                    this.__handle_chapter_base_input_change("name", o);
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="序号">
                            <Input
                                value={item.idx}
                                placeholder="请输入序号"
                                onChange={(o) => {
                                    this.__handle_chapter_base_input_change("idx", o);
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="商户书ID">
                            <Input
                                value={item.customer_book_id}
                                placeholder="请输入商户书ID"
                                onChange={(o) => {
                                    this.__handle_chapter_base_input_change("customer_book_id", o);
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="商户卷ID">
                            <Input
                                value={item.customer_volume_id}
                                placeholder="请输入商户卷ID"
                                onChange={(o) => {
                                    this.__handle_chapter_base_input_change("customer_volume_id", o);
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="商户章ID">
                            <Input
                                value={item.customer_chapter_id}
                                placeholder="请输入商户章ID"
                                onChange={(o) => {
                                    this.__handle_chapter_base_input_change("customer_chapter_id", o);
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Drawer>
                <Modal
                    title={
                        <>
                            <h4 style={{ display: 'inline-block' }}>{this.state.data.name}</h4>
                            <Popover
                                placement="bottomRight"
                                title={<span>将内容设置为</span>}
                                content={popover_content}
                                trigger="click"
                                open={this.state.popover_visible}
                                onOpenChange={this.handle_popover_change_visible}
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

                    onOk={() => this.__handle_chapter_content_modal_visible(false)}
                    onCancel={() => this.__handle_chapter_content_modal_visible(false)}
                    open={state.chapter_content_modal_visible}
                    footer={footer}
                    width="61.8vw"
                    centered={true}
                >
                    <div
                        className="content-article"
                        style={{
                            height: "calc(100vh - 340px)",
                            overflowX: "hidden",
                            overflowY: "scroll",
                        }}
                    >
                        <Dropdown
                            menu={{
                                items,
                            }}
                            trigger={['contextMenu']}
                            onOpenChange={(open) => {
                                if (open) {
                                    const sel = window.getSelection();
                                    this.setState({ 'material': sel.toString() })

                                }
                            }}
                        >
                            <List
                                dataSource={content}
                                renderItem={(k, v) => (

                                    <p key={v} style={{
                                        textIndent: '2em',
                                        fontSize: '18px',
                                        lineHeight: 1.7,
                                        fontFamily: "宋体",
                                        margin: '20px 0px'
                                    }}>{k}</p>

                                )}
                            />


                        </Dropdown>
                    </div>
                </Modal>
            </>
        );
    }
    __render_chapter_dropdown_menus_action = (data) => {
        const state = this.state;
        let items = [{
            key: 'handle_state_sale',
            label: (
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
            ),
        }, {
            key: 'handle_base_drawer_open',
            label: (
                <Button
                    type="primary"
                    shape="round"
                    onClick={() => {
                        this.__handle_chapter_base_drawer_open(data);
                    }}
                >
                    更改基本信息
                </Button>
            ),
        }];
        if (webapi.utils.in_array(data.state_published, [
            "2",
            "3",
            "4",
            "5",
            "6",
        ])) {
            items.push({
                key: 'handle_published_batch',
                label: (
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
                ),
            });
        }
        if (webapi.utils.in_array(data.state_published, ["1", "2", "3"])) {
            items.push({
                key: 'handle_revert_batch',
                label: (
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
                ),
            });
        }
        if (state.page !== 'customer') {
            items.push({
                key: '__handle_chapter_published_drawer_open',
                label: (
                    <Button
                        onClick={() => {
                            this.__handle_chapter_published_drawer_open(data, 'single');
                        }}
                        type="primary"
                        shape="round"
                    >
                        预发设置
                    </Button>
                ),
            });
        }
        return items;
    };
    __render_book_read_drawer() {
        const state = this.state;
        const book = state.book || {};
        const data = state.data;
        const item = state.item || {};
        const chapter = state.chapter || {};
        const chapters_lists = state.chapters_lists || [];
        const loadMore = chapter.next_id > 0 ?
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={this.loadMoreData}>loading more</Button>
            </div> : '';

        return <Drawer
            title={book.name}
            width={"61.8%"}
            forceRender={true}
            onClose={this.__handle_book_read_drawer_close}
            open={state.book_read_drawer_visible}
        >
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={chapters_lists}
                renderItem={(v, k) => (

                    <div key={k}  >
                        <h3>{v.name}</h3>
                        <Divider />

                        {v.content.map((t, i) => {
                            return <p key={i} style={{
                                textIndent: '2em',
                                fontSize: '18px',
                                lineHeight: 1.7,
                                fontFamily: "宋体",
                                margin: '20px 0px'
                            }}>{t}
                            </p>
                        })}
                    </div>




                )}
            />



        </Drawer>;
    }

    /*----------------------4 render end  ----------------------*/
}
