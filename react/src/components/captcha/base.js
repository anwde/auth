import React from "react";
// const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
export default class Base extends React.Component {
	/**
	 * 构造
	 */
	constructor(props) {
		super(props);
		this.state = this.__init_state();
	}
	/**
	 * init_state 初始化状态 2=init
	 * @return obj
	 */
	__init_state() {
		return {
			...this.__init_state_before(),
			...this.__init_state_after(),
		};
	}
	/**
	 * 初始化状态前 父类state会覆盖
	 * @return obj
	 */
	__init_state_before() {
		return {};
	}
	/**
	 * 初始化状态后 可以覆盖父类state
	 * @return obj
	 */
	__init_state_after() {
		return {};
	}
	 
}
