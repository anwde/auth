import React from "react";
import { Row, Col } from "reactstrap";

import {
  ProgressCards,
  CountryVisit,
  TrafficCard,
  VisitCountries,
  WeatherCard,
  ManageUsers,
  SalesCard,
  CarouselWidget,
} from "../../components/dashboard/";

const Ecommerce = () => {
  return (
    <div>
      <ProgressCards />
      <Row>
        <Col lg={6}>
          <CountryVisit />
        </Col>
        <Col lg={6}>
          <TrafficCard />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <VisitCountries />
        </Col>
        <Col lg={8}>
          <WeatherCard />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <SalesCard />
        </Col>
        <Col lg={6}>
          <CarouselWidget />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ManageUsers />
        </Col>
      </Row>
    </div>
  );
};

export default Ecommerce;
