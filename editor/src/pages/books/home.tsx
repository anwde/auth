// @ts-nocheck
import {
  Form
} from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import webapi from '../../utils/webapi';
import Basic_Books from './base/books';
type State = Server.State & {
  drawer_visible: boolean;
  group: Server.data;
  category_dict: Server.data;
  server_state: Server.data;
  menus: [];
  columns: [];
  permission: [];
};
const BREADCRUMB = {
  title: '作品管理',
  lists: [
    {
      title: '作品管理',
      url: '/novel/books',
    },
  ],
  buttons: [

  ],
};
class Books extends Basic_Books<{}, State> {
  formRef = React.createRef();
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

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/


  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/


  dopost = async (data) => {
    return await webapi.request.post("books/home/dopost", { data, file: true });
  }


  handle_filter_drawer_show = () => {
    this.setState({
      drawer_visible: true,
    });
  };
  handle_filter_submit = () => {
    let filters = this.state.filters;
    // if (Object.keys(this.state.filters).length > 0) {
    this.setState(
      {
        drawer_visible: false,
        filters: {},
      },
      () => {
        const urlParams = new URL(window.location.href);
        const params = webapi.utils.query();
        params.filters = JSON.stringify(filters);
        const param = webapi.utils.http_build_query(params);
        var url = urlParams.pathname + "?" + param;
        this.props.history.replace(url);
        this.__init_index();
      }
    );
    // }
  };
  handle_filters_radio_change_values = (field, id, val) => {
    const filters = this.state.filters || {};
    filters[field] = {};
    if (val) {
      filters[field][id] = id;
    }
    this.setState({
      filters,
    });
  };
  handle_filters_checkbox_change_values = (field, id, check, val) => {
    // console.log(field, id, check, val);
    const filters = this.state.filters || {};
    if (!filters[field]) {
      filters[field] = {};
    }
    if (check) {
      filters[field][id] = val ? val : id;
    } else {
      delete filters[field][id];
    }
    this.setState({
      filters,
    });
  };
  //更新章节内容素材-子类需实现-构建提交数据
  __handle_materials_build_data = (data) => {
    data.chapter_id = this.state.data.chapter_id;
    data.book_id = this.state.data.book_id;
    return data;
  }
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/
  __render_index() {
    const state = this.state as unknown as State;
    let c = "";
    if (this.state.u_action == "sign") {
      c = this.__render_index_sign();
    }
    if (this.state.u_action == "duty") {
      c = this.__render_index_duty();
    }

    return (
      <>

        {this.__render_components_lists({
          page: 'books',
          generate_cover_mage: true,
          pagination: state.pagination,
          request_url: 'books/home/lists',
          metas: {
            title: {
              click: (item) => this.handle_edit(item.id, item),
            },
            subTitle: {},
            description: {
            },
            actions: {
            },
            avatar: {
            },
            content: {
            },
            extra: {}

          }
        })}
        {c}

      </>
    );
  }


  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Books);
