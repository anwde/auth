import React from "react";
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  SparklineCards,
  Chat,
  ChatListing,
  UserActivity,
  TodoList,
  ManageUsers,
  RecentSales,
  RecentComment,
  ProductMonthlySales,
  MonthlyEarnings,
} from "../../components/dashboard/";

import img1 from "../../assets/images/users/1.jpg";
import img4 from "../../assets/images/users/4.jpg";
import img5 from "../../assets/images/users/5.jpg";

const FourthDashboard = () => {
  return (
    <div>
      <SparklineCards />
      <Row>
        <Col lg={8}>
          <ProductMonthlySales />
        </Col>
        <Col lg={4}>
          <MonthlyEarnings />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <RecentSales />
        </Col>
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
      </Row>
      <Row>
        <Col lg={4}>
          <TodoList />
        </Col>
        <Col lg={8}>
          <ManageUsers />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <ChatListing />
        </Col>
        <Col lg={4}>
          <UserActivity />
        </Col>
        <Col lg={4}>
          <Chat />
        </Col>
      </Row>
    </div>
  );
};

export default FourthDashboard;
