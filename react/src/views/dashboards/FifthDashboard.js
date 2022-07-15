import React from "react";
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";

import PerfectScrollbar from "react-perfect-scrollbar";

import {
  TotalIncome,
  YearlySales,
  MonthlySales,
  SalesExpance,
  TotalSales,
  WeeklyUsage,
  MonthlyUsage,
  RecentComment,
  RecentSales,
  DateCalendar,
  FollowerCard,
  UserActivity,
  TotalEarnings,
  Feeds,
  Chat,
} from "../../components/dashboard/";

import img1 from "../../assets/images/users/1.jpg";
import img4 from "../../assets/images/users/4.jpg";
import img5 from "../../assets/images/users/5.jpg";

const FifthDashboard = () => {
  return (
    <div>
      <Row>
        <Col lg={4}>
          <TotalIncome />
        </Col>
        <Col lg={4}>
          <YearlySales />
        </Col>
        <Col lg={4}>
          <MonthlySales />
        </Col>
      </Row>
      <Row>
        <Col sm="12" lg="8">
          <SalesExpance />
        </Col>
        <Col sm="12" lg="4">
          <TotalSales />
        </Col>
      </Row>
      <Row>
        <Col lg={5} className="d-flex align-items-stretch">
          <FollowerCard />
        </Col>
        <Col lg={7} className="d-flex align-items-stretch">
          <DateCalendar />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <WeeklyUsage />
        </Col>
        <Col lg={6}>
          <MonthlyUsage />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Card>
            <CardBody>
              <CardTitle className="text-uppercase">Recent Comments</CardTitle>
            </CardBody>
            <div
              className="comment-widgets scrollable"
              style={{ height: "525px" }}
            >
              <PerfectScrollbar>
                <RecentComment
                  image={img1}
                  badge="Pending"
                  badgeColor="primary"
                  name="James Anderson"
                  comment="Donec ac condimentum massa. Etiam pellentesque pretium lacus. Phasellus ultricies dictum suscipit. Aenean commodo "
                  date="10:20 AM 20 may 2016"
                />
                <RecentComment
                  image={img4}
                  badge="Approved"
                  badgeColor="success"
                  name="Michael Jorden"
                  comment="Donec ac condimentum massa. Etiam pellentesque pretium lacus. Phasellus ultricies dictum suscipit. Aenean commodo "
                  date="10:20 AM 20 may 2016"
                />
                <RecentComment
                  image={img5}
                  badge="Rejected"
                  badgeColor="danger"
                  name="Johnathan Doeting"
                  comment="Donec ac condimentum massa. Etiam pellentesque pretium lacus. Phasellus ultricies dictum suscipit. Aenean commodo "
                  date="10:20 AM 20 may 2016"
                />
                <RecentComment
                  image={img1}
                  badge="Pending"
                  badgeColor="primary"
                  name="James Anderson"
                  comment="Donec ac condimentum massa. Etiam pellentesque pretium lacus. Phasellus ultricies dictum suscipit. Aenean commodo "
                  date="10:20 AM 20 may 2016"
                />
                <RecentComment
                  image={img4}
                  badge="Approved"
                  badgeColor="success"
                  name="Michael Jorden"
                  comment="Donec ac condimentum massa. Etiam pellentesque pretium lacus. Phasellus ultricies dictum suscipit. Aenean commodo "
                  date="10:20 AM 20 may 2016"
                />
              </PerfectScrollbar>
            </div>
          </Card>
        </Col>
        <Col lg={6}>
          <RecentSales />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <UserActivity />
        </Col>
        <Col lg={8}>
          <Chat />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <TotalEarnings />
        </Col>
        <Col lg={6}>
          <Feeds />
        </Col>
      </Row>
    </div>
  );
};

export default FifthDashboard;
