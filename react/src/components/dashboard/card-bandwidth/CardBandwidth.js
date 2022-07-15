import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Col, Row } from "reactstrap";

import Chart from "react-apexcharts";

const CardBandwidth = () => {
  const optionsbandwidth = {
    chart: {
      fontFamily: "Rubik,sans-serif",
      height: 120,
      type: "line",
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    colors: ["#fff"],
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    xaxis: {},
    tooltip: {
      theme: "dark",
    },
  };
  const seriesbandwidth = [
    {
      name: "",
      data: [5, 0, 12, 1, 8, 3, 12, 15],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1,2,3                                                        */
    /*--------------------------------------------------------------------------------*/
    <Card className="bg-primary">
      <CardBody>
        <div className="d-flex">
          <div className="mr-3 align-self-center">
            <h1 className="text-white">
              <i className="ti-pie-chart" />
            </h1>
          </div>
          <div>
            <CardTitle className="text-white">Bandwidth usage</CardTitle>
            <CardSubtitle className="text-white op-5">March 2017</CardSubtitle>
          </div>
        </div>
        <Row className="mt-2">
          <Col sm="4" className="align-self-center">
            <h2 className="font-weight-light display-6 text-white">50 GB</h2>
          </Col>
          <Col sm="8" className="pt-2 pb-3 align-self-center">
            <div className="float-right">
              <Chart
                options={optionsbandwidth}
                series={seriesbandwidth}
                type="line"
                height="100px"
                width="250px"
              />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default CardBandwidth;
