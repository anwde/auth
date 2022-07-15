import React from "react";
import store from "../../redux/store";
import webapi from "../../utils/webapi";
 
export default class Basic_Component<P = {}, S = {}, SS = any> extends React.Component<
Server.Props,
  Server.State
> {
  //定时器
  interval: number = 0;
  /**
   * 构造
   */
  constructor(props: any) {
    super(props);
    this.state = this.__init_state();
    console.log(props);
  }

  /*----------------------0 parent start----------------------*/
  /**
   * 面包屑导航
   */
  __breadcrumb(data = {}) {
    store.dispatch({ type: "BREADCRUMB", data: data });
  }
  __get_method(type: string, prefixes = "__"): string {
    return `${prefixes}${type}_${this.state.method}`;
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
  __method(type: string) {
    let method = this.__get_method(type);
    if (!(method in this)) {
      console.warn(`${this.__getName()}__method 方法:${method}不存在`);
      method = `__${type}_index`;
    }
    //保护
    if (method in this) { 
      // @ts-ignore
      return this[method]();
    } else {
      return "";
    }
  }
  __get_base64(img: Blob, callback?: Function) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback && callback(reader));
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
  __upload_single_props = (options: {
    accept?: string;
    name?: string;
    success?: Function;
    file_field?: string;
    image_field?: string;
  }) => {
    return {
      accept: options.accept || ".png,.jpg,.jpeg",
      onChange: (info: any) => {
        if (info.file.status === "uploading") {
          return;
        }
      },
      showUploadList: false,
      name: options.name || "image",
      beforeUpload: (file: any) => {
        this.__get_base64(file, (imageUrl: any) => {
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
  __setinterval(c = 200, success: Function, d = 1000, _after: Function) {
    let count = c;
    // @ts-ignore
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
  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/
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
  __init_page_data(data = { page_size: 0, page: 0 }) {
    return {
      showSizeChanger: false,
      hideOnSinglePage: true,
      pageSize: data.page_size ? data.page_size * 1 : 20,
      total: 0,
      current: data.page ? data.page * 1 : 1,
      onChange: this.__handle_page_change,
      onShowSizeChange: this.__handle_page_show_size_change,
    };
  }
  __init_state() {
    const query = webapi.utils.query();
    return {
      // @ts-ignore
      q: query.q || "",
      ...this.__init_state_before(),
      method: this.props.match.params.method || "index",
      id: this.props.match.params.id || 0,
      order_field: "create_time",
      order_value: "desc",
      filters: [],
      data: {},
      lists: [],
      // @ts-ignore
      pagination: this.__init_page_data(query),
      ...this.__init_state_after(),
    };
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
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
  __handle_page_change = (page=0, page_size=0) => {
    let method = this.__get_method("init");
    // @ts-ignore
    const pager:Server.Pagination = { ...this.state.pagination };
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
          const params = webapi.utils.query() as {page?:number,page_size?:number}; 
          params.page = page;
          params.page_size = page_size;
          const param = webapi.utils.http_build_query(params);
          const url = urlParams.pathname + "?" + param;
          this.props.history&&this.props.history.replace(url); 
          // @ts-ignore
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
  __handle_page_show_size_change = (current:any, size:any) => {
    // console.log("handle_page_show_size_change=>", current, size);
  };
  /*
   * handle_table_change
   * @param pagination
   * @param filters
   * @param sorter
   * @return mixed
   */
  __handle_table_change = (pagination:Server.Pagination, filters:any, sorter:{field?:string,order?:string}) => {
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
    const params = webapi.utils.query() as {q?:string};
    if (params.q === val) {
      return false;
    }
    params.q = val;
    const param = webapi.utils.http_build_query(params);
    const url = urlParams.pathname + "?" + param;
    this.props.history&&this.props.history.replace(url);
  };
  __handle_search_keyup = (e:any) => {
    if (e.keyCode === 13) {
      this.__handle_search();
    }
  };
  __handle_search_change = (event:any) => {
    const value = event.target.value.replace(/(^\s*)|(\s*$)/g, "");
    this.setState({
      // @ts-ignore
      query_q: value + "",
    });
  };
  __handle_delete = (options:{}) => {
    webapi.delete({
      success: (data:Server.Status) => {
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
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
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
  __render_add_edit(u_action:string) {
    return <></>;
  }
  /*----------------------4 render end  ----------------------*/
}
