import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux"; 
import webapi from "@/utils/webapi";
import {
  Statistic,
  Card,
  Row,
  Col,
  Calendar,
  Badge,
  Typography,
  Divider,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
const BREADCRUMB = {
  type: "BREADCRUMB",
  data: {
    title: "",
    lists: [],
    buttons: [],
  },
};
class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(props) {
    this.breadcrumb();
  }
  /**
   * 渲染前调用
   */
  componentWillMount() {
    this.breadcrumb();
  }

  /**
   * 面包屑导航
   */
  breadcrumb(data = {}) {
    // store.dispatch(BREADCRUMB);
  }
  getListData(value) {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
        ];
        break;
      case 10:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
          { type: "error", content: "This is error event." },
        ];
        break;
      case 15:
        listData = [
          { type: "warning", content: "This is warning event" },
          { type: "success", content: "This is very long usual event。。...." },
          { type: "error", content: "This is error event 1." },
          { type: "error", content: "This is error event 2." },
          { type: "error", content: "This is error event 3." },
          { type: "error", content: "This is error event 4." },
        ];
        break;
      default:
    }
    return listData || [];
  }
  getMonthData(value) {
    if (value.month() === 8) {
      return 1394;
    }
  }
  monthCellRender(value) {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }
  dateCellRender(value) {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }
  render2() {
    return (
      <div className="site-statistic-demo-card">
        <Row gutter={16}>
          <Col span={24}>
            <Calendar
              dateCellRender={this.dateCellRender.bind(this)}
              monthCellRender={this.monthCellRender.bind(this)}
            />
          </Col>
        </Row>
      </div>
    );
  }
  render() {
    this.props.history.push('/content/page/41?column_id=41');
    
    return (
      <>
         
      </>
    );
  }
}
export default connect((store) => ({ ...store }))(Welcome);
