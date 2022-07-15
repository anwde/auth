import React from "react";
import { Link } from "react-router-dom";
import webapi from "@/utils/webapi";
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
	Table
} from "antd";
import moment from "moment";
const breadcrumb = {
	title: "系统日志",
	lists: [
		{ title: "主页", url: "/" },
		{ title: "系统日志", url: "/stsyemlog" }
	],
	buttons: []
};
export default class Stsyemlog extends React.Component {
	/*--------------------------------------------------------------------------------
    * 构造
    --------------------------------------------------------------------------------*/
	constructor(props) {
		super(props);
		this.state = {
			order_field: "create_time",
			order_value: "desc",
			offset: 1,
			row_count: 10,
			page: this.props.match.params.page,
			id: this.props.match.params.id || 0,
			lists: [],
			value: {},
			data: { stsyemlog: {}, menus_lists: [] },
		}; 
	}
	/*--------------------------------------------------------------------------------
    * newProps
    --------------------------------------------------------------------------------*/

	componentWillReceiveProps(newProps) {
		var params = newProps.match.params || {};
		if (params.page === this.state.page) {
			return false;
		}
		this.setState(
			{
				page: params.page || "index",
				id: params.id || 0
			},
			function() {
				this.handle_init();
			}
		);
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	/*--------------------------------------------------------------------------------
    * 分页
    --------------------------------------------------------------------------------*/

	handle_pagechange(offset, row_count) {
		this.setState({ offset, row_count });
		this.lists({ offset, row_count });
	}
	/*--------------------------------------------------------------------------------
    * 排序
    --------------------------------------------------------------------------------*/

	handle_sorter(name, order) {
		var that = this;
		that.setState({ order_field: name, order_value: order }, function() {
			that.lists();
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
		return this.index();
	}
	/*--------------------------------------------------------------------------------
    * 渲染前用初始化
    --------------------------------------------------------------------------------*/

	handle_init() {
		this.lists();
	}
	/*--------------------------------------------------------------------------------
    * 列表数据
    --------------------------------------------------------------------------------*/

	async lists(d = {}) { 
		d.order_field = this.state.order_field;
		d.order_value = this.state.order_value;
		var data = await webapi.request.post("stsyemlog/lists", d);
		var lists = [];
		var load = true;
		if (data.code === 10000 && data.num_rows > 0) {
			for (var i in data.lists) {
				var l = data.lists[i];
				l.create_time = moment(l.create_time * 1000).format(
					"YYYY-MM-DD HH:mm:ss"
				);
				lists.push(l);
			}
		}
		this.setState({
			num_rows: data.num_rows,
			lists: lists
		});
	} 

	/*--------------------------------------------------------------------------------
    * 删除
    --------------------------------------------------------------------------------*/

	handle_delte(id) {
		var that = this;
		webapi.delete_dialog("stsyemlog/delete", { id: id }, function(data) {
			if (data.status == "success") {
				that.lists();
			}
		});
	}
	  
	/*--------------------------------------------------------------------------------
    * 首页
    --------------------------------------------------------------------------------*/

	index() { 
		webapi.pubsub.publish("breadcrumb", breadcrumb);
		var that = this;
		const columns = [
			
			{
				title: "名称",
				fixed: "left",
				render: "name"
			},
			{
				title: "系统",
				fixed: "left",
				render: "os"
			},
			{
				title: "浏览器",
				render: function(d, i) {
					return d.browser;
				}
			},
			{
				title: "地址",
				render: function(d, i) {
					return d.ip_address;
				}
			},
			
			{
				title: "时间",
				render: function(d, i) {
					return d.create_time;
				}
			},
			{
				title: "操作",
				render: function(d, i) {
					return (
						<div>
							<a
								className="btn btn-outline-info btn-circle btn-lg btn-circle"
								title="删除"
								onClick={that.handle_delte.bind(that, d.id)}>
								<i className="ti-trash" />{" "}
							</a> 
						</div>
					);
				}
			}
		];
		return (
			<div className="card">
				<Table
					data={this.state.lists}
					fixed="both"
					keygen="id"
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
		);
	}
}
