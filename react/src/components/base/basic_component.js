import React from "react";
import webapi from "@/utils/webapi";
import store from "@/redux/store";
// const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
export default class Basic_Component extends React.Component {
  /**
   * 构造
   */
  constructor(props) {
    super(props);
    this.state = this.__init_state();
  }
  /**
   * props 有变化
   */
  UNSAFE_componentWillReceiveProps(props) { 
    //  console.log('props data=>',props);
    this.props = props;
    const query = webapi.utils.query();
    const q = query.q || "";
    const method = this.props.match.params.method || "index";
    const id = this.props.match.params.id || 0;
    let flag = false;
    if (method !== this.state.method) {
      // console.log('componentWillReceiveProps=>',this.state);
      // console.log('componentWillReceiveProps=>',this.props);
      flag = true;
    }
    if (!flag && this.state.id !== id) {
      // console.log('componentWillReceiveProps=>',this.state);
      // console.log('componentWillReceiveProps=>',this.props);
      flag = true;
    }
    if (!flag && q !== this.state.q) {
      // console.log('componentWillReceiveProps=>',this.state);
      // console.log('componentWillReceiveProps=>',this.props);
      flag = true;
    }
    if (flag) {
      this.__init_state_handle();
    }
  }
  /**
   * 渲染前调用
   */
  UNSAFE_componentWillMount() {
    this.__handle_init();
  }
  /*----------------------1 other start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    store.dispatch({ type: "BREADCRUMB", data: data });
  }
  __get_method(type,f='__') {
    return `${f}${type}_${this.state.method}`;
  }
  __get_controller() {
    return this.__getName();
  }
  __getName() {
    let funcNameRegex = /function (.{1,})\(/;
    let results = funcNameRegex.exec(this.constructor.toString());
    return results && results.length > 1
      ? results[1]
      : this.constructor.name
      ? this.constructor.name
      : "";
  }

  /**
   * __method 1=other
   * @param type string  公共方法处理
   * @return mixed
   */
  __method(type) {
    let method = this.__get_method(type);
    if (!(method in this)) {
      console.warn(`${this.__getName()}__method 方法:${method}不存在`);
      method = `__${type}_index`;
    }
    //保护
    if (method in this) {
      return this[method]();
    } else {
      return "";
    }
  }
  __get_base64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader));
    reader.readAsDataURL(img);
  }

  __form_item_layout = () => {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
  };

  __tail_layout = () => {
    return {
      wrapperCol: { offset: 4, span: 14 },
    };
  };
  __upload_single_props = (options = {}) => {
    return {
      accept: options.accept || ".png,.jpg,.jpeg",
      onChange: (info) => {
        if (info.file.status === "uploading") {
          return;
        }
      },
      showUploadList: false,
      name: options.name || "image",
      beforeUpload: (file) => {
        this.__get_base64(file, (imageUrl) => {
          const base64Data = imageUrl.result;
          options.success
            ? options.success(options, file, base64Data)
            : this.setState({
                [options.file_field ? options.file_field : "file"]: file,
                data: {
                  ...this.state.data,
                  [options.image_field ? options.image_field : "image"]:
                    base64Data,
                },
              });
        });
        return false;
      },
    };
  };
  /**
   * 定时器
   */
  __setinterval(c = 200, success, d = 1000, _after) {
    let count = c;
    this.setState({ count });
    this.interval = window.setInterval(() => {
      count -= 1;
      success(count);
      if (count <= 0) {
        _after && _after();
        this.__clearinterval();
      }
    }, d);
  }
  /**
   * 清除定时器
   */
  __clearinterval() {
    this.interval && window.clearInterval(this.interval);
  }

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
  /**
   * init_state 初始化状态 2=init
   * @return obj
   */
  __init_state() {
    const query = webapi.utils.query();
    return {
      q: query.q || "",
      ...this.__init_state_before(),
      method: this.props.match.params.method || "index",
      id: this.props.match.params.id || 0,
      order_field: "create_time",
      order_value: "desc",
      filters: [],
      data: {},
      lists: [],
      pagination: this.__init_page_data(query),
      ...this.__init_state_after(),
    };
  }
  /**
   * init state  handle 初始化 state 和 handle
   * @return mixed
   */
  __init_state_handle() {
    this.setState(this.__init_state(), () => {
      this.__handle_init();
    });
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
  __init_page_data(data = {}) {
    return {
      showSizeChanger: false,
      hideOnSinglePage: true,
      pageSize: data.page_size?(data.page_size*1):20,
      total: 0,
      current: data.page?(data.page*1):1,
      // onChange: this.handle_page_change,
      // onShowSizeChange: this.__handle_page_show_size_change,
    };
  }
  /**
   * 添加始化
   */
  __init_add() {
    this.__init_add_edit("add");
  }
  /**
   * 编辑始化
   */
  __init_edit() {
    this.__init_add_edit("edit");
  }
  /**
   * 添加-编辑始化
   */
  __init_add_edit(u_action) {}

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start----------------------*/

  /**
   * handle_init 业务初始化 3=handle
   * @return obj
   */
  __handle_init() {
    this.__handle_init_before();
    this.__method("init");
    this.__handle_init_after();
  }
  /**
   *  业务初始化前 子类可重写
   * @return obj
   */
  __handle_init_before = () => {};
  /**
   *  业务初始化后 子类可重写
   * @return obj
   */
  __handle_init_after = () => {};

  /**
   * 改变 分页
   * @param page 当前页
   * @param page_size 当前分页大小
   * @return mixed
   */
  __handle_page_change = (page, page_size) => {
    let method = this.__get_method("init");
    const pager = { ...this.state.pagination };
    pager.current = page;
    pager.pageSize = page_size; 
    this.setState(
      {
        pagination: pager,
      },
      () => {
        if (!(method in this)) {
          console.warn("__handle_page_change 方法:" + method + "不存在");
        } else { 
          const urlParams = new URL(window.location.href);
          const params = webapi.utils.query(); 
          params.page = page;
          params.page_size = page_size;
          const param = webapi.utils.http_build_query(params);
          const url = urlParams.pathname + "?" + param;
          this.props.history.replace(url); 
          this[method](); 
        }
      }
    );
  };
  /*
   * handle_page_show_size_change
   * @param current obj  当前数据
   * @param size int  大小
   * @return mixed
   */
  __handle_page_show_size_change = (current, size) => {
    // console.log("handle_page_show_size_change=>", current, size);
  };
  /*
   * handle_table_change
   * @param pagination
   * @param filters
   * @param sorter
   * @return mixed
   */
  __handle_table_change = (pagination, filters, sorter) => {
    const page = { ...this.state.pagination, ...pagination };
    const order_field = sorter.field ? sorter.field : this.state.order_field;
    const order_value = sorter.field
      ? sorter.order === "ascend"
        ? "asc"
        : "desc"
      : this.state.order_value;
    this.setState(
      {
        filters,
        order_field: order_field,
        order_value: order_value,
      },
      () => {
        this.__handle_page_change(page.current, page.pageSize);
      }
    );
  };
  __handle_scroll_top = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  __handle_search = () => {
    const val = this.state.query_q;
    const urlParams = new URL(window.location.href);
    const params = webapi.utils.query();
    if (params.q === val) {
      return false;
    }
    params.q = val;
    const param = webapi.utils.http_build_query(params);
    const url = urlParams.pathname + "?" + param;
    this.props.history.replace(url);
  };
  __handle_search_keyup = (e) => {
    if (e.keyCode === 13) {
      this.__handle_search();
    }
  };
  __handle_search_change = (event) => {
    const value = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
    this.setState({
      query_q: value + "",
    });
  };
  __handle_delete = (options) => {
    webapi.delete({
      success: (data) => {
        if (data.code === 10000) {
          webapi.message.success(data.message);
          this.__method("init");
        } else {
          webapi.message.error(data.message);
        }
      },
      ...options,
    });
  };

  /*----------------------3 handle end----------------------*/

  /*----------------------4 render start----------------------*/
  /**
   * render 渲染  4=render
   * @return obj
   */
  render() {
    return this.__method("render");
  }
  /**
   * 添加
   * @return obj
   */
  __render_add() {
    return this.__render_add_edit("add");
  }
  /**
   * 编辑
   * @return obj
   */
  __render_edit() {
    return this.__render_add_edit("edit");
  }
  /**
   * 添加-编辑 子类可重写
   * @return obj
   */
  __render_add_edit(u_action) {
    return "";
  }
  /*----------------------4 render end----------------------*/
}
