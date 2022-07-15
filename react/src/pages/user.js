import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "@/utils/webapi";
import classnames from "classnames";
import immer from "immer";
import {
	Form,
	Input,
	Checkbox,
	Radio,
	Textarea,
	Select,
	DatePicker,
	Tree,
	Upload,
	Table,
	Cascader,
	Button
} from "antd";
import moment from "moment";
const breadcrumb = {
	title: "用户管理",
	lists: [
		{ title: "主页", url: "/" },
		{ title: "用户管理", url: "/authorize/user" }
	],
	buttons: [{ title: "添加用户", url: "/authorize/user/add" }]
};
class User extends React.Component {
	/*--------------------------------------------------------------------------------
    * 构造
    --------------------------------------------------------------------------------*/
	constructor(props) {
		super(props);
		this.state = this.init_state();
	}
	init_state() {
		return {
			loading: this.props.loading,
			tabs_active: "",
			order_field: "create_time",
			order_value: "desc",
			offset: 1,
			row_count: 10,
			page: this.props.match.params.page || "index",
			user_id: this.props.match.params.id || 0,
			lists: [],
			num_rows: 0,
			value: {},
			data: {
				database_default_id: "",
				database: [],
				field: {}
			},
			area: [],
			nodes: []
		};
	}

	/*--------------------------------------------------------------------------------
    * newProps
    --------------------------------------------------------------------------------*/

	componentWillReceiveProps(newProps) {
		// console.log("componentWillReceiveProps", newProps, this.state);
		this.props = newProps;
		this.setState({ loading: this.props.loading });
		var page = this.props.match.params.page || "index";
		if (page === this.state.page) {
			return false;
		}
		this.setState(this.init_state(), () => {
			this.handle_init();
		});
	}
	/*--------------------------------------------------------------------------------
    * 渲染前调用
    --------------------------------------------------------------------------------*/

	componentWillMount() {
		this.handle_init();
	}
	/*--------------------------------------------------------------------------------
    * 渲染
    --------------------------------------------------------------------------------*/
	render() {
		// console.log("render", this.state);
		var childs = "";
		switch (this.state.page) {
			case "edit":
				childs = this.render_edit_add();
				break;
			case "add":
				childs = this.render_edit_add();
				break;
			case "account_setting":
				childs = this.render_account_setting();
				break;
			default:
				childs = this.render_index();
		}
		return childs;
	}

	/*--------------------------------------------------------------------------------
    * 渲染前用初始化
    --------------------------------------------------------------------------------*/

	handle_init() {
		// return 1;
		// console.log("handle_init", this.state.page);
		switch (this.state.page) {
			case "edit":
				this.init_data();
				break;
			case "add":
				this.init_data();
				break;
			default:
				this.init_lists();
		}
	}

	/*--------------------------------------------------------------------------------
    * handle_change
    --------------------------------------------------------------------------------*/

	handle_change = value => {
		this.setState({ value });
	} 

	
	handle_goBack() {
		this.props.history.goBack();
	}

	/*--------------------------------------------------------------------------------
    * handle_submit
    --------------------------------------------------------------------------------*/
	async handle_submit(data) {
		data.user_id=this.state.user_id;
		// return console.log("user", data);

		var that = this;
		var data = await webapi.request.post("authorize/user/dopost", data);
			
			webapi.dialog({
				id: "handle_submit_dialog",
				content: data.message,
				onshow: function() {
					var dthat = this;
					setTimeout(function() {
						dthat.close().remove();
						if (data.status == "success") {
							return that.props.history.push("/authorize/user");
						}
					}, 1000);
				}
			})
			.show();
	}

	/*--------------------------------------------------------------------------------
    * 列表数据
    --------------------------------------------------------------------------------*/

	async init_lists(d = {}) {
		d.order_field = this.state.order_field;
		d.order_value = this.state.order_value;
		var data = await webapi.request.post("authorize/user/lists", d);
		var lists = [];
		if (data.code === 10000 && data.num_rows > 0) {
			this.setState({
				lists: data.lists,
				num_rows: data.num_rows
			});
		}
	}
	async init_area() {
		var data = await webapi.request.post("authorize/user/area");
		if (data.code === 10000) {
			this.setState({ area: data.lists });
		}
	}

	async user_get_expand(user_id, database_id) {
		var database = this.state.data.database;
		var data = await webapi.request.post("authorize/user/expand", {
			offset: this.state.offset,
			row_count: this.state.row_count,
			user_id: user_id,
			database_id: database_id
		});
		if (data.code === 10000) {
			database[database_id].lists = data.lists;
			database[database_id].num_rows = data.num_rows;
		}
		this.setState({ data: { ...this.state.data, database: database } });
	}
	async post_user(user_id, database_id, struct) {
		var that = this;
		var d = that.state.data;
		if (d.field[database_id]) {
			return false;
		}
		var url =
			"authorize/user/" +
			(struct === "lists" ? "database_field" : "expand");
		var data = await webapi.request.post(url, {
			user_id: user_id,
			database_id: database_id
		});
		if (struct == "lists") {
			this.user_get_expand(user_id, database_id);
		}
		if (data.code === 10000) {
			d.field[database_id] = data.data;

			that.setState({ data: d });
		}
	}
	/*--------------------------------------------------------------------------------
    * 详细数据
    --------------------------------------------------------------------------------*/

	async init_data() {
		this.init_area();
		var that = this;
		var data = await webapi.request.post("authorize/user/get", {
			user_id: that.state.user_id
		});
		if (data.code === 10000) {
			that.setState(
				{
					data: {
						...that.state.data,
						database: data.database,
						database_default_id: data.database_default_id
					},
					tabs_active: data.database_default_id
				},
				function() {
					that.post_user(
						that.state.user_id,
						that.state.data.database_default_id
					);
				}
			);
		}
	}

	keyGenerator = (node, parentKey) =>
		`${parentKey},${node.id}`.replace(/^,/, "");

	handleChange = value => this.setState({ nodes: value });

	renderItem = node => `${node.name}`;

	get_child_expand(user_id, data) {
		// console.log(data, this.state);
		var child = "";
		const name=data.prefix+'['+data.field+']';
		switch (data.formtype) {
			case "radio":
				child = (
					<Radio.Group
						keygen="value"
						data={data.struct.param}
						format="value"
						renderItem="name"
						defaultValue={data.struct.value}
						name={name}
					/>
				);
				break;
			case "roleid":
				child = (
					<Checkbox.Group
						keygen="value"
						data={data.struct.param}
						format="value"
						renderItem="name"
						defaultValue={data.struct.value}
						name={name}
					/>
				);
				break;
			case "area":
				// console.log(this.state);
				child = (
					<Cascader
						name={name}
						data={this.state.area}
						keygen={this.keyGenerator}
						renderItem={this.renderItem}
						onChange={this.handleChange}
						value={this.state.nodes}
					/>
				);
				break;
			default:
				child = (
					<Input name={name} defaultValue={data.struct.value} />
				);
		}

		return <Form.Item label={data.name}>{child}</Form.Item>;
	}

	/*--------------------------------------------------------------------------------
    * handle_expand
    --------------------------------------------------------------------------------*/
	handle_child_expand_lists(user_id, database) {
		var that = this;
		var m = that.state.data.field[database.id] || [];

		const columns = m.map(function(val, key) {
			return {
				title: val.name,
				render: val.field,
				width: 80,
				align: "center",
				thclassName: "border-0 text-uppercase font-medium"
			};
		});
		columns.push({
			title: "操作",
			width: 160,
			align: "center",
			thclassName: "border-0 text-uppercase font-medium",
			render: function(d, i) {
				return (
					<div>
						<a
							className="btn btn-outline-info btn-circle btn-lg btn-circle"
							title="删除"
							onClick={that.handle_expand_delete.bind(
								that,
								user_id,
								database,
								d.id
							)}
						>
							<i className="ti-trash" />{" "}
						</a>
						<a
							className="btn btn-outline-info btn-circle btn-lg btn-circle  ml-2"
							title="更改"
							onClick={that.handle_expand_edit.bind(
								that,
								user_id,
								database,
								d.id
							)}
						>
							<i className="ti-pencil-alt" />
						</a>
					</div>
				);
			}
		});
		// console.log(columns)
		return (
			<div>
				<Table
					data={this.state.data.database[database.id].lists || []}
					keygen="id"
					striped
					columns={columns}
					rowsInView={10}
					className="table-responsive"
					pagination={{
						current: this.state.offset,
						pageSize: this.state.row_count,
						align: "center",
						layout: ["links", "list"],
						onChange: this.handle_user_expand_pagechange.bind(
							this,
							user_id,
							database
						),
						pageSizeList: [10, 15, 20],
						total: this.state.data.database[database.id].num_rows,
						text: {
							page: "/页"
						}
					}}
				/>
			</div>
		);
	}
	handle_child_expand(user_id, database) {
		if (database.struct == "lists") {
			return this.handle_child_expand_lists(user_id, database);
		}
		var that = this;
		var m = that.state.data.field[database.id] || [];
		// console.log("expand", m);
		var c = m.map(function(val, key) {
			return <div key={key}>{that.get_child_expand(user_id, val)}</div>;
		});
		return <div>{c}</div>;
	}
	/*--------------------------------------------------------------------------------
    * 删除
    --------------------------------------------------------------------------------*/

	handle_delete(id) {
		var that = this;
		webapi.delete_dialog("authorize/user/delete", { id: id }, function(
			data
		) {
			if (data.status == "success") {
				that.init_lists();
			}
		});
	}
	handle_expand_delete(user_id, database, id) {}
	handle_expand_edit(user_id, database, id) {}
	/*--------------------------------------------------------------------------------
    * handle_tabs 
    --------------------------------------------------------------------------------*/

	handle_tabs(id) {
		if (this.state.tabs_active === id) {
			return false;
		}
		this.setState({ tabs_active: id });
		var db = this.state.data.database[id] || {};
		this.post_user(this.state.user_id, db.id, db.struct);
	}

	/*--------------------------------------------------------------------------------
    * 分页
    --------------------------------------------------------------------------------*/

	handle_pagechange(offset, row_count) {
		this.setState({ offset, row_count });
		this.init_lists({ offset, row_count });
	}

	handle_user_expand_pagechange(user_id, database, offset, row_count) {
		this.setState({ offset, row_count }, () => {
			this.user_get_expand(user_id, database.id);
		});
	}

	/*--------------------------------------------------------------------------------
    * 排序
    --------------------------------------------------------------------------------*/

	handle_sorter(name, order) {
		var that = this;
		that.setState(
			{ order_field: name, order_value: order, offset: 1 },
			function() {
				that.init_lists();
			}
		);
	}
	/*--------------------------------------------------------------------------------
    * account_setting
    --------------------------------------------------------------------------------*/

	account_setting() {
		return <div />;
	}
	/*--------------------------------------------------------------------------------
    * edit add
    --------------------------------------------------------------------------------*/

	render_edit_add() {
		webapi.pubsub.publish("breadcrumb", breadcrumb);
		const action_submit = (
			<Form.Item label="">
				<Form.Submit loading={this.state.loading}>{this.state.loading?'正在提交':'立即提交'}</Form.Submit>
				<Button
					type="primary"
					outline
					onClick={this.handle_goBack.bind(this)}
				>
					<i className="fa fa-reply-all" aria-hidden="true"></i>
					返回
				</Button>
			</Form.Item>
		);
		return (
			<Form
				value={this.state.data.user}
				onChange={this.handle_change.bind(this)}
				onSubmit={this.handle_submit.bind(this)}
			>
				<ul className="nav nav-tabs" role="tablist">
					{Object.keys(this.state.data.database).map(key => {
						var val = this.state.data.database[key];
						return (
							<li
								className="nav-item"
								onClick={this.handle_tabs.bind(this, key)}
								key={key}
							>
								<a
									className={classnames(
										"nav-link show",
										this.state.tabs_active === key &&
											"active"
									)}
									href="#!"
									role="tab"
								>
									<span className="hidden-sm-up">
										<i className="ti-home" />
									</span>
									<span className="hidden-xs-down">
										{val.name}
									</span>
								</a>
							</li>
						);
					})}
				</ul>
				<div className="tab-content tabcontent-border p-4">
					{Object.keys(this.state.data.database).map(key => {
						var database = this.state.data.database[key];
						if (database.struct == "lists") {
							var child = this.handle_child_expand(
								this.state.user_id,
								database
							);
						} else {
							var child = this.handle_child_expand(
								this.state.user_id,
								database
							);
						}
						return (
							<div
								className={classnames(
									"tab-pane",
									key,
									this.state.tabs_active === key && "active"
								)}
								key={key}
							>
								{child}
								{database.struct == "lists"
									? ""
									: action_submit}
							</div>
						);
					})}
				</div>
			</Form>
		);
	}

	/*--------------------------------------------------------------------------------
    * 首页
    --------------------------------------------------------------------------------*/

	render_index() {
		webapi.pubsub.publish("breadcrumb", breadcrumb);
		var that = this;
		const columns = [
			{
				title: "用户ID",
				render: function(d, i) {
					return (
						<div>
							<img src={d.avatar} width="80px" />
						</div>
					);
				},
				sorter: this.handle_sorter.bind(this, "user_id"),
				width: 160,
				align: "center",
				thclassName: "border-0 text-uppercase font-medium"
			},
			{
				title: "用户信息",
				render: function(d, i) {
					var c = (
						<div>
							<h5 className="font-medium mb-0">{d.nickname}</h5>
							<span className="text-muted">{d.email}</span>
						</div>
					);
					return c;
				},
				width: 160,
				align: "center",
				thclassName: "border-0 text-uppercase font-medium"
			},
			{
				title: "用户信息",
				render: function(d, i) {
					var c = (
						<div>
							<h5 className="font-medium mb-0">{d.mobile}</h5>
							<span className="text-muted">{d.qq}</span>
						</div>
					);
					return c;
				},
				width: 160,
				align: "center",
				thclassName: "border-0 text-uppercase font-medium"
			},
			{
				title: "添加时间",
				sorter: this.handle_sorter.bind(this, "create_time"),
				render: function(d, i) {
					return d.create_time;
				},
				width: 160,
				align: "center",
				thclassName: "border-0 text-uppercase font-medium"
			},
			{
				title: "最后登录时间",
				sorter: this.handle_sorter.bind(this, "last_login"),
				render: function(d, i) {
					return d.last_login;
				},
				width: 160,
				align: "center",
				thclassName: "border-0 text-uppercase font-medium"
			},
			{
				title: "操作",
				render: function(d, i) {
					return (
						<div>
							<a
								className="btn btn-outline-info btn-circle btn-lg btn-circle"
								title="删除"
								onClick={that.handle_delete.bind(
									that,
									d.user_id
								)}
							>
								<i className="ti-trash" />
							</a>
							<Link
								to={"/authorize/user/edit/" + d.user_id}
								className="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"
							>
								<i className="ti-pencil-alt" />
							</Link>
						</div>
					);
				},
				width: 160,
				align: "center",
				thclassName: "border-0 text-uppercase font-medium"
			}
		];
		return (
			<div className="row">
				<div>
					<div className="card">
						<div className="card-body">
							<Table
								data={this.state.lists}
								keygen="user_id"
								striped
								columns={columns}
								rowsInView={10}
								pagination={{
									current: this.state.offset,
									pageSize: this.state.row_count,
									align: "center",
									layout: ["links", "list"],
									onChange: this.handle_pagechange.bind(this),
									pageSizeList: [10, 15, 20],
									total: this.state.num_rows
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default connect(store => ({ ...store }))(User);