import React from "react";
import { Row, Col } from "reactstrap";

import {
  ChatListing,
  Chat,
  ProgressSalesCard,
  CardBandwidth,
  CardDownload,
  Notification,
  TopSales,
  TopEarning,
} from "../../components/dashboard/";

const SixthDashboard = () => {
  return (
    <div>
      <ProgressSalesCard />
      <Row>
        <Col lg={6}>
          <CardBandwidth />
          <CardDownload />
        </Col>
        <Col lg={6}>
          <Notification />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <TopSales />
        </Col>
        <Col lg={6}>
          <TopEarning />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Chat />
        </Col>
        <Col lg={6}>
          <ChatListing />
        </Col>
      </Row>
    </div>
  );
};

export default SixthDashboard;
