
// @ts-nocheck
import React from "react";
import Base_Materials from "./base/materials";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../../utils/webapi";
import moment from "moment";
class Materials extends Base_Materials {
    base_url = 'books/';
    constructor(props: any) {
        super(props);
    }
    /*----------------------0 parent start----------------------*/
    __init_state_after() {
        const query = webapi.utils.query() as { book_id: 0 };
        return {
            book_id: query.book_id || 0,
        };
    }
    /*----------------------0 parent end----------------------*/

    /*----------------------1 other start----------------------*/

    /*----------------------1 other end----------------------*/

    /*----------------------2 init start  ----------------------*/
    //构建-数据-列表
    init_lists_build_data = (data) => {
        data.book_id = this.state.book_id;
        return data;
    }
    //构建-数据-提交
    __handle_submit_build_data = (data) => {
        data.book_id = this.state.book_id;
        return data;
    }
    /*----------------------2 init end  ----------------------*/

    /*----------------------3 handle start  ----------------------*/

    /*----------------------3 handle end  ----------------------*/

    /*----------------------4 render start  ----------------------*/

    /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Materials);
