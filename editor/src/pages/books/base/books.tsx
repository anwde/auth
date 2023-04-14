// @ts-nocheck
import React from "react";
import Basic from "./basic";
import { Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import webapi from '../../../utils/webapi';
import {
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    Modal,
    Select,
    Checkbox,
    Row,
    Drawer,
    Tag,
    Popover,
    Card,
    Skeleton,
    Avatar,
    DatePicker, Dropdown,
    Image,
    List
} from "antd";
import moment from "moment";
import Books_Components from '../components/books';
import { EditOutlined, FileWordOutlined, CloseOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
export default class Basic_Books extends Basic {
    formRef = React.createRef();
    constructor(props) {
        super(props);

    }
    /*----------------------0 parent start----------------------*/

    /*----------------------0 parent end----------------------*/

    /*----------------------1 other start----------------------*/

    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/
    __init_index = async () => {
        const state = this.state as unknown as State;
        const server_state = await this.get_server_state();
        const category_dict = await this.get_category_dict();
        const lists = [
            { title: "作品管理", url: `/${this.base_url}home` },
        ];
        const buttons = [
            {
                title: "创建作品",
                onClick: (e) => {
                    e.preventDefault();
                    this.handle_add();
                }
            }
        ];
        // console.log(1111);
        this.__breadcrumb({ buttons, lists });
        this.setState(
            {
                server_state,
                category_dict,
            });
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/
    //作品-添加
    handle_add = () => {
        this.handle_add_edit("edit", 0, "添加作品");
    };
    //作品-修改
    handle_edit = async (id) => {
        const data = await this.get_book(id, true);
        data.id = id;
        this.handle_add_edit("edit", "修改作品", data);
    };
    //作品-修改|添加
    handle_add_edit = async (u_action, add_edit_title, data = {}) => {

        const category = await this.get_category();
        const tag = await this.get_tag();
        this.setState({
            u_action,
            add_edit_modal_visible: true,
            add_edit_title,
            data,
            tag,
            category,
        });
        this.formRef.current && this.formRef.current.setFieldsValue(data);
    };
    //作品-修改|添加-提交
    handle_add_edit_dopost = () => {
        this.formRef.current &&
            this.formRef.current
                .validateFields()
                .then((values) => {
                    this.handle_submit(values);
                })
                .catch((info) => { });
    };
    //作品-修改|添加-finish提交
    handle_submit = async (values) => {
        const state = this.state;
        const data = new FormData();
        data.append("id", state.data.id || 0);
        data.append("name", values.name || "");
        data.append("category_id", state.category_id || "");
        data.append("intro", values.intro || "");
        data.append("author_id", values.author_id || "");
        data.append("tag", values.tag || "");
        state.data.file && data.append("image", state.data.file);
        const res = await webapi.request.post(this.handle_submit_build_url(`${this.base_url}home/dopost`), { data: this.handle_submit_build_data(data, values), file: true });;
        if (res.code === 10000) {
            webapi.message.success(res.message);
            this.handle_add_edit_modal_visible(!state.add_edit_modal_visible);
            this.__init_index(true);
        } else {
            webapi.message.error(res.message);
        }
    };
    //构建-数据-提交
    handle_submit_build_data = (data, olddata) => {
        return data;
    }
    //构建-url-提交
    handle_submit_build_url = (url) => {
        return url;
    }
    // Modal 添加-作品-开关
    handle_add_edit_modal_visible = (v) => {
        this.setState({ add_edit_modal_visible: v })
    }
    //生成封面图片
    __handleGenerateCoverImage = async (id) => {
        this.handleGenerateCoverImagVisible(true);
        this.setState({ modal_generate_cover_image_id: id })
    }
    //生成封面图片-Modal-开关
    handleGenerateCoverImagVisible = (v: boolean) => {
        this.setState({ modal_generate_cover_image_visible: v })

    }
    //生成封面图片-Modal-输入框
    handleGenerateCoverImagChange = (v) => {
        this.setState({ modal_generate_cover_image_prompt: v.target.value })
    }
    //生成封面图片-Modal-提交
    handleGenerateCoverImagDopost = async () => {
        const state = this.state;
        if (!state.modal_generate_cover_image_prompt) {
            return webapi.message.error('请输入描述语');
        }
        if (!state.modal_generate_cover_image_id) {
            return webapi.message.error('请输入描述语');
        }
        const res = await webapi.request.post(`${this.base_url}home/generateCoverImage`, { data: { id: state.modal_generate_cover_image_id, prompt: state.modal_generate_cover_image_prompt } });;
        if (res.code === 10000) {
            this.handleGenerateCoverImagVisible(false);
            webapi.message.success(res.message);
            this.__setTimeout(10000, (count) => {
                this.handleGenerateCoverImagQuery(res.data.task_id, count)
            }, 3000);
        } else {
            webapi.message.error(res.message);
        }
    }
    //生成封面图片-轮询-查询
    handleGenerateCoverImagQuery = async (task_id, count) => {
        const r = await webapi.request.post(`${this.base_url}home/generateCoverImageQuery`, { data: { count, task_id }, loading: false });
        if (r.code === 10000) {
            this.__clearinterval();
            this.__init_index();
        } else {
            this.__setTimeout(10000, (count) => {
                this.handleGenerateCoverImagQuery(task_id, count)
            }, 3000);
        }
    }
    //选择书鼠标获得焦点
    handleSelectBooksMouseEnter = (k) => {
        this.setState({ [k]: true });
    }
    //选择书鼠标失去焦点
    handleSelectBooksMouseLeave = (k) => {
        this.setState({ [k]: false });
    }

    handle_modal_books_open = (modal_books) => {
        this.setState({ modal_books });
    }
    handle_modal_books_lists = async (d = {}) => {
        const res = await webapi.request.get("books/home/lists", { data: d });
        const modal_books_lists = res.code === 10000 && res.num_rows > 0 ? res.lists : [];
        this.setState({ modal_books: true, modal_books_lists });
    }
    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/
    // Modal 添加-作品
    __render_index_add_edit(u_action) {

        return (
            <Modal
                width="61.8vw"
                height="85.4vh"
                style={{ top: "20px", bottom: '20px' }}
                keyboard={false}
                maskClosable={false}
                open={this.state.add_edit_modal_visible}
                onOk={this.handle_add_edit_dopost}
                onCancel={() => this.handle_add_edit_modal_visible(false)}
                centered={true}
                title={
                    <>
                        <h4>{this.state.add_edit_title}</h4>
                    </>
                }
                bodyStyle={{
                    height: "calc(85.4vh - 150px)",
                    overflowX: "hidden",
                    overflowY: "scroll",
                }}
            >
                <div className="form-book-edit">{this.__render_add_edit(u_action)}</div>
            </Modal >
        );
    }
    //  添加-作品
    __render_add_edit(u_action) {
        const state = this.state;
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
        };
        return (
            <Form
                {...this.__form_item_layout()}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                layout="horizontal"
                ref={this.formRef}
                onFinish={this.handle_submit}
            >
                <Form.Item label="封面图片">
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
                <Form.Item label="作品名称" name="name">
                    <Input placeholder="输入名称" />
                </Form.Item>
                <Form.Item label="作者信息" name="author_id">
                    <Input placeholder="输入作者uid或手机号码,不填写就默认是当前登录的人" />
                </Form.Item>

                <Form.Item label="作品类型" name="category">
                    <Cascader
                        fieldNames={{ label: "name", value: "id" }}
                        options={this.state.category}
                        placeholder="请选择类型"
                        onChange={this.handle_category_change}
                    />
                </Form.Item>
                <Form.Item label="商户作品" name="customer_book_id">
                    <Input placeholder="商户作品id" />
                </Form.Item>
                <Form.Item label="年龄分段" name="age_group">
                    <Select >
                        <Select.Option value="14">14+</Select.Option>
                        <Select.Option value="16">16+</Select.Option>
                        <Select.Option value="18">18+</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="作品标签" name="tag">
                    <Checkbox.Group>
                        <Row>
                            {this.state.tag &&
                                Object.keys(this.state.tag).map((val) => {
                                    return (
                                        <Checkbox
                                            key={this.state.tag[val].id}
                                            value={this.state.tag[val].id}
                                            style={{
                                                marginLeft: "0",
                                            }}
                                        >
                                            {this.state.tag[val].name}
                                        </Checkbox>
                                    );
                                })}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item label="作品介绍" name="intro">
                    <Input.TextArea
                        placeholder="请输入介绍"
                        autoSize={{ minRows: 5, maxRows: 10 }}
                    />
                </Form.Item>
                {this.state.add_edit_modal_visible ? (
                    ""
                ) : (
                    <Form.Item {...this.__tail_layout()}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={this.state.loading}
                        >
                            提交保存
                        </Button>
                    </Form.Item>
                )}
            </Form>
        );
    }

    __render_drawer_tag_children = (filters, field, id, name) => {
        return (
            <Tag.CheckableTag
                value={id}
                key={`${field}-${id}`}
                onChange={(checked) =>
                    this.handle_filters_radio_change_values(field, id, checked)
                }
                checked={filters[field] && filters[field][id]}
            >
                {name}
            </Tag.CheckableTag>
        );
    };
    __render_drawer(children = "") {
        const state = this.state;
        const channel = state.channel || {};
        const category = state.category || [];
        const server_state = state.server_state || {};
        const state_sale = server_state.book ? server_state.book.sale : {};
        const filters = state.filters || {};
        // console.log(filters);
        return (
            <>
                <Modal
                    width="61.8vw"
                    centered={true}
                    open={state.modal_books}
                    onOk={this.handle_modal_books_submit}
                    onCancel={() => this.handle_modal_books_open(false)}
                    bodyStyle={{ padding: 0 }}
                >
                    <Books_Components
                        pagination={state.pagination}
                        // request_url={'books/home/lists'}
                        request_handle={async (params = {}, sorts, filter) => {
                            return await this.__handle_tablepro_request(params, sorts, filter, 'books/home/lists');
                        }}
                    />
                </Modal>
                <Modal
                    width="61.8vw"
                    height="61.8vh"
                    style={{ top: "20px", bottom: '20px' }}
                    keyboard={false}
                    maskClosable={false}
                    open={state.modal_generate_cover_image_visible}
                    onOk={this.handleGenerateCoverImagDopost}
                    onCancel={() => this.handleGenerateCoverImagVisible(false)}
                    centered={true}
                    title='请输入待生成的图片描述'
                    bodyStyle={{
                        height: "calc(61.8vh - 150px)",
                        overflowX: "hidden",
                        overflowY: "scroll",
                    }}
                >
                    <Input.TextArea
                        showCount
                        maxLength={300}
                        style={{ height: 'calc(61.8vh - 200px)', resize: 'none' }}
                        onChange={this.handleGenerateCoverImagChange}
                        placeholder="描述"
                        value={state.modal_generate_cover_image_prompt || ''}
                    />
                </Modal >
                <Drawer
                    title="筛选"
                    width="38.2%"
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
                                onClick={this.handle_filter_submit}
                                loading={this.props.loading}
                                type="primary"
                                style={{ marginRight: 8 }}
                            >
                                确认
                            </Button>
                            <Button onClick={this.handle_drawer_reset}>重置</Button>
                        </div>
                    }
                >
                    <Form
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        layout="vertical"
                    >
                        <Form.Item label="状态" name="state_sale">
                            <div
                                style={{
                                    lineHeight: "32px",
                                    transition: "all 0.3s",
                                    userSelect: "none",
                                }}
                            >
                                {Object.keys(state_sale).map((val) => {
                                    return this.__render_drawer_tag(
                                        filters,
                                        "state_sale",
                                        val,
                                        state_sale[val].name
                                    );
                                })}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="分类"
                            name="category_id"
                            style={{ display: "none" }}
                        >
                            <div
                                style={{
                                    lineHeight: "32px",
                                    transition: "all 0.3s",
                                    userSelect: "none",
                                }}
                            >
                                {category.map((val) => {
                                    let c = "";
                                    if (val.children) {
                                        c = val.children.map((v) => {
                                            return this.__render_drawer_tag(
                                                filters,
                                                "category_id",
                                                v.id,
                                                v.name
                                            );
                                        });
                                    }
                                    return c;
                                })}
                            </div>
                        </Form.Item>
                        <Form.Item label="更新时间" name="last_chapter_update_time">
                            <DatePicker.RangePicker
                                onChange={this.handle_change_RangePicker}
                                onCalendarChange={this.handle_change_RangePicker_clendar}
                                initialValues={[
                                    filters["last_chapter_update_time"] &&
                                        filters["last_chapter_update_time"]["start"]
                                        ? moment(
                                            filters["last_chapter_update_time"]["start"],
                                            "YYYY-MM-DD"
                                        )
                                        : "",
                                    filters["last_chapter_update_time"] &&
                                        filters["last_chapter_update_time"]["end"]
                                        ? moment(
                                            filters["last_chapter_update_time"]["end"],
                                            "YYYY-MM-DD"
                                        )
                                        : "",
                                ]}
                            />
                        </Form.Item>

                        <Form.Item label="来源" name="client_id" style={{ display: "none" }}>
                            <div
                                style={{
                                    lineHeight: "32px",
                                    transition: "all 0.3s",
                                    userSelect: "none",
                                }}
                            >
                                {Object.keys(channel).map((val) => {
                                    return this.__render_drawer_tag(
                                        filters,
                                        "client_id",
                                        channel[val].id,
                                        channel[val].name
                                    );
                                })}
                            </div>
                        </Form.Item>

                        <Form.Item label="连载/完结" name="end_of_serial">
                            <div
                                style={{
                                    lineHeight: "32px",
                                    transition: "all 0.3s",
                                    userSelect: "none",
                                }}
                            >
                                {this.__render_drawer_tag(filters, "end_of_serial", 1, "连载")}
                                {this.__render_drawer_tag(filters, "end_of_serial", 2, "完结")}
                            </div>
                        </Form.Item>
                        {children}
                    </Form>
                </Drawer>
            </>
        );
    }
    __render_user_popover(item, children) {
        const user = this.state.user || {};
        return (
            <Popover
                content={
                    <Card
                        bordered={false}
                        style={{ width: 300, marginTop: 16 }}
                        actions={[
                            <>
                                <EditOutlined key="ellipsis" />
                                作品总数 {user.books || 0}
                            </>,
                            <>
                                <FileWordOutlined />
                                累计字数{" "}
                                {user.words > 10000
                                    ? (user.words / 10000).toFixed(2) + "万"
                                    : user.words || 0}
                            </>,
                        ]}
                    >
                        <Skeleton loading={this.props.server.loading} avatar active>
                            <Card.Meta
                                avatar={<Avatar size={80} src={user.avatar} />}
                                title={
                                    user.nickname &&
                                    user.nickname +
                                    (user.pseudonym ? "(" + user.pseudonym + ")" : "")
                                }
                                description={
                                    <>
                                        {user.mobile ? <p>手机:{user.mobile}</p> : ""}
                                        {user.qq ? <p>QQ:{user.qq}</p> : ""}
                                        {user.weixin ? <p>微信:{user.weixin}</p> : ""}
                                        <div>{user.intro}</div>
                                    </>
                                }
                            />
                        </Skeleton>
                    </Card>
                }
                title=""
                visible={
                    this.state.user_card_visible &&
                    this.state.user_card_visible[item.user_id + "_" + item.id]
                }
                onVisibleChange={(o) =>
                    this.handle_user_card_change(
                        o,
                        item.user_id,
                        item.user_id + "_" + item.id
                    )
                }
            >
                {children}
            </Popover>
        );
    }
    __render_index_sign() {
        const server_state = this.state.server_state || {};
        const sign = server_state.book
            ? server_state.book.sign
                ? server_state.book.sign
                : {}
            : {};
        const sign_type = sign.type ? sign.type : {};
        const sign_sale = sign.sale ? sign.sale : {};
        return (
            <Drawer
                title="添加/修改 签约 "
                width={500}
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
                            onClick={this.handle_drawer_close}
                            style={{ marginRight: 8 }}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={this.handle_sign_submit}
                            loading={this.props.loading}
                            type="primary"
                        >
                            提交
                        </Button>
                    </div>
                }
            >
                <Form layout="horizontal" ref={this.formRef}>
                    <Form.Item name="type" label="签约方式">
                        <Select>
                            {Object.keys(sign_type).map((val, key) => {
                                return (
                                    <Select.Option key={key} value={val}>
                                        {sign_type[val]["name"]}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name="sale" label="签约类型">
                        <Select>
                            {Object.keys(sign_sale).map((val, key) => {
                                return (
                                    <Select.Option key={key} value={val}>
                                        {sign_sale[val]["name"]}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        );
    }
    __render_index_duty() {
        return (
            <Drawer
                title="添加/修改 责编 "
                width={500}
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
                            onClick={this.handle_drawer_close}
                            style={{ marginRight: 8 }}
                        >
                            取消;
                        </Button>
                        <Button
                            onClick={this.handle_duty_submit}
                            loading={this.props.loading}
                            type="primary"
                        >
                            提交
                        </Button>
                    </div>
                }
            >
                <Form layout="horizontal" ref={this.formRef}>
                    <Form.Item name="user_id" label="用户">
                        <Input placeholder="请输入责编id或手机号" />
                    </Form.Item>
                </Form>
            </Drawer>
        );
    }


    __render_drawer_tag = (filters, field, id, name) => {
        return (
            <Tag.CheckableTag
                value={id}
                key={id}
                onChange={(checked) =>
                    this.handle_filters_checkbox_change_values(field, id, checked)
                }
                checked={filters[field] && filters[field][id]}
            >
                {name}
            </Tag.CheckableTag>
        );
    };
    /*----------------------4 render end  ----------------------*/

}