import Base from "./base.js";
import webapi from "@/utils/webapi";
export default class Slide_Base extends Base {
	constructor(props) {
		super(props);
		this.state={ };
	}
	init() {
		let _this = this;

		window.removeEventListener("touchmove", function (e) {
			_this.move(e);
		});
		window.removeEventListener("mousemove", function (e) {
			_this.move(e);
		});

		//鼠标松开
		window.removeEventListener("touchend", function () {
			_this.end();
		});
		window.removeEventListener("mouseup", function () {
			_this.end();
		});

		window.addEventListener("touchmove", function (e) {
			_this.move(e);
		});
		window.addEventListener("mousemove", function (e) {
			_this.move(e);
		});

		//鼠标松开
		window.addEventListener("touchend", function () {
			_this.end();
		});
		window.addEventListener("mouseup", function () {
			_this.end();
		});
	}
	async getData() {
	
		this.setState({
			img_type: "",
			slide_y: "",
			backImgBase: null,
			blockBackImgBase: null,
		});
		var res = await webapi.request.post("auth/captcha", {
			u_action: "slide",
		});

		if (res.code === 10000) {
			this.setState({
				img_type: res.data.img_type,
				slide_y: res.data.slide_y,
				backImgBase: res.data.background_image,
				blockBackImgBase: res.data.slide_image,
			});
		}
		// 请求次数超限
		if (res.code === 11045) {
			this.setState({
				backImgBase: null,
				blockBackImgBase: null,
				leftBarBorderColor: "#d9534f",
				iconColor: "#fff",
				iconClass: "icon-close",
				passFlag: false,
				tipWords: res.message,
			});
			// setTimeout(() => {
			// 	this.setState({
			// 		tipWords: "",
			// 	});
			// }, 1000);
		}
	}

	refresh = () => {
		this.getData();
		this.setState({
			moveBlockLeft: "",
			leftBarWidth: "",
			text: "向右滑动完成验证",
			moveBlockBackgroundColor: "#fff",
			leftBarBorderColor: "#337AB7",
			iconColor: "#fff",
			status: false,
			isEnd: false,
		});
	};
	setBarArea = (event) => {
		let barAreaLeft = event && event.getBoundingClientRect().left;
		let barAreaOffsetWidth = event && event.offsetWidth;
		this.state.barAreaLeft = barAreaLeft;
		this.state.barAreaOffsetWidth = barAreaOffsetWidth;
	};

	start = (e) => {
		e = e || window.event;
		let x='';
		if (!e.touches) {
			//兼容PC端
			 x = e.clientX;
		} else {
			//兼容移动端
			 x = e.touches[0].pageX;
		}
		this.state.startLeft = Math.floor(x - this.state.barAreaLeft);
		this.state.startMoveTime = +new Date(); //开始滑动的时间
		if (this.state.isEnd === false) {
			this.setState({
				text: "",
				moveBlockBackgroundColor: "#337ab7",
				leftBarBorderColor: "#337AB7",
				iconColor: "#fff",
				status: true,
			});
			this.text = "";
			e.stopPropagation();
		}
	};

	move = (e) => {
		e = e || window.event;
		if (this.state.status && this.state.isEnd === false) {
			let x='';
			if (!e.touches) {
				//兼容PC端
				 x = e.clientX;
			} else {
				//兼容移动端
				 x = e.touches[0].pageX;
			}
			var bar_area_left = this.state.barAreaLeft;
			var move_block_left = x - bar_area_left; //小方块相对于父元素的left值
			if (
				move_block_left >=
				this.state.barAreaOffsetWidth -
					parseInt(parseInt(this.state.blockSize.width) / 2) -
					2
			) {
				move_block_left =
					this.state.barAreaOffsetWidth -
					parseInt(parseInt(this.state.blockSize.width) / 2) -
					2;
			}
			if (move_block_left <= 0) {
				move_block_left = parseInt(this.state.blockSize.width / 2);
			}
			//拖动后小方块的left值
			this.state.moveBlockLeft =
				move_block_left - this.state.startLeft + "px";
			this.state.leftBarWidth =
				move_block_left - this.state.startLeft + "px";
			this.setState({
				moveBlockLeft: this.state.moveBlockLeft,
				leftBarWidth: this.state.leftBarWidth,
			});
		}
	};

	end = async () => {
		this.state.endMovetime = +new Date(); 
		//判断是否重合
		if (this.state.status && this.state.isEnd === false) {
			var moveLeftDistance = parseInt(
				(this.state.moveBlockLeft || "").replace("px", "")
			);
			moveLeftDistance =
				(moveLeftDistance * 310) /
				parseInt(this.state.setSize.imgWidth);
			let data = {
				u_action: this.state.u_action,
				point: { x: moveLeftDistance, y: this.state.slide_y },
				startMoveTime: this.state.startMoveTime,
				endMovetime: this.state.endMovetime,
			};

			var res = await this.props.complete(
				webapi.utils.encrypt(
					JSON.stringify(data),
					window.cs,
					this.state.slide_y
				)
			); 
			if(!res.code){
				return false;
			}
			if (res.code === 10000) {
				this.state.isEnd = true;
				this.state.passFlag = true;
				this.state.tipWords = this.setState({
					tipWords: `${(
						(this.state.endMovetime - this.state.startMoveTime) /
						1000
					).toFixed(2)}s验证成功`,
				});
				this.props.success && this.props.success(res);
				this.props.onclose && this.props.onclose(false);
			} else {
				this.setState({
					isEnd: true,
					moveBlockBackgroundColor: "#d9534f",
					leftBarBorderColor: "#d9534f",
					iconColor: "#fff",
					iconClass: "icon-close",
					passFlag: false,
					tipWords: res.message || "验证失败",
				});
				setTimeout(() => {
					this.refresh();
					this.setState({
						tipWords: "",
					});
				}, 1000);
				this.props.error && this.error.success(res);
			}

			this.state.status = false;
		}
	};

	closeBox = () => {
		this.props.onclose && this.props.onclose(false);
	};
}