import React from "react";
import Basic_Component from "../components/base/component";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import webapi from "../utils/webapi"; 
import moment from "moment";
class Menus extends Basic_Component {
  constructor(props: any) {
    super(props);
  }
  /*----------------------0 parent start----------------------*/

  /*----------------------0 parent end----------------------*/

  /*----------------------1 other start----------------------*/

  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/

  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/

  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/

  /*----------------------4 render end  ----------------------*/
}
export default connect((store) => ({ ...store }))(Menus);
