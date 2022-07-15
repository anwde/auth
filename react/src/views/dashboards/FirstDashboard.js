import React from "react";
import { Row, Col } from "reactstrap";

import {
  Chat,
  EarningCards,
  ProductYearlySales,
  SalesWeek,
  BalanceCard,
  ManageUsers,
  TodoList,
  MyCalendar,
  PostCard,
  ChatListing,
  UserActivity,
  SelectUser,
} from "../../components/dashboard/";

const Classic = () => {
  return (
    <div>
      <Row>
        <Col xs={12}>
          <EarningCards />
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <ProductYearlySales />
        </Col>
        <Col lg={4}>
          <SalesWeek />
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <SelectUser />
        </Col>
        <Col lg={4}>
          <BalanceCard />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ManageUsers />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <TodoList />
        </Col>
        <Col lg={8}>
          <MyCalendar />
        </Col>
      </Row>
      <PostCard />
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

export default Classic;
