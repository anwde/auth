import React from "react";

import { Card, CardBody, Row, Col, CardTitle } from "reactstrap";

import Chart from "react-apexcharts";

const SparklineCards = () => {
  const optionsSparklineCards1 = {
    chart: {
      type: "bar",
      fontFamily: "Rubik,sans-serif",
      height: 30,
      sparkline: {
        enabled: true,
      },
    },
    fill: {
      colors: ["#2cd07e"],
      opacity: 1,
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
        barHeight: "100%",
      },
    },
    stroke: {
      show: true,
      width: 7,
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
      marker: {
        show: true,
        fillColors: ["#2cd07e"],
      },
      x: {
        show: false,
      },
    },
  };
  const seriesSparklineCards1 = [
    {
      name: "",
      data: [1, 5, 6, 10, 9, 12, 4, 9],
    },
  ];
  // 2
  const optionsSparklineCards2 = {
    chart: {
      type: "bar",
      fontFamily: "Rubik,sans-serif",
      height: 30,
      sparkline: {
        enabled: true,
      },
    },
    fill: {
      colors: ["#707cd2"],
      opacity: 1,
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
        barHeight: "100%",
      },
    },
    stroke: {
      show: true,
      width: 7,
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
      marker: {
        show: true,
        fillColors: ["#707cd2"],
      },
      x: {
        show: false,
      },
    },
  };
  const seriesSparklineCards2 = [
    {
      name: "",
      data: [1, 5, 6, 10, 9, 12, 4, 9],
    },
  ];
  // 3
  const optionsSparklineCards3 = {
    chart: {
      type: "bar",
      fontFamily: "Rubik,sans-serif",
      height: 30,
      width: 100,
      sparkline: {
        enabled: true,
      },
    },
    fill: {
      colors: ["#2cabe3"],
      opacity: 1,
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
        barHeight: "100%",
      },
    },
    stroke: {
      show: true,
      width: 7,
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
      marker: {
        show: true,
        fillColors: ["#2cd07e"],
      },
      x: {
        show: false,
      },
    },
  };
  const seriesSparklineCards3 = [
    {
      name: "",
      data: [1, 5, 6, 10, 9, 12, 4, 9],
    },
  ];
  // 4
  const optionsSparklineCards4 = {
    chart: {
      type: "bar",
      fontFamily: "Rubik,sans-serif",
      height: 30,
      sparkline: {
        enabled: true,
      },
    },
    fill: {
      colors: ["#ff5050"],
      opacity: 1,
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
        barHeight: "100%",
      },
    },
    stroke: {
      show: true,
      width: 7,
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
      marker: {
        show: true,
        fillColors: ["#2cd07e"],
      },
      x: {
        show: false,
      },
    },
  };
  const seriesSparklineCards4 = [
    {
      name: "",
      data: [1, 5, 6, 10, 9, 12, 4, 9],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Row>
      <Col lg={3} md={6}>
        <Card>
          <CardBody>
            <CardTitle className="text-uppercase">Total Visit</CardTitle>
            <div className="d-flex align-items-center mt-2">
              <div style={{ width: "80px" }}>
                <Chart
                  options={optionsSparklineCards1}
                  series={seriesSparklineCards1}
                  type="bar"
                  height="30"
                />
              </div>
              <div className="ml-auto">
                <h2 className="text-success mb-0">
                  <i className="ti-arrow-up"></i>659
                </h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={3} md={6}>
        <Card>
          <CardBody>
            <CardTitle className="text-uppercase">Total Page Views</CardTitle>
            <div className="d-flex align-items-center mt-2">
              <div style={{ width: "80px" }}>
                <Chart
                  options={optionsSparklineCards2}
                  series={seriesSparklineCards2}
                  type="bar"
                  height="30"
                />
              </div>
              <div className="ml-auto">
                <div className="ml-auto">
                  <h2 className="text-primary mb-0">
                    <i className="ti-arrow-up"></i>659
                  </h2>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={3} md={6}>
        <Card>
          <CardBody>
            <CardTitle className="text-uppercase">Unique Visitor</CardTitle>
            <div className="d-flex align-items-center mt-2">
              <div style={{ width: "80px" }}>
                <Chart
                  options={optionsSparklineCards3}
                  series={seriesSparklineCards3}
                  type="bar"
                  height="30"
                />
              </div>
              <div className="ml-auto">
                <h2 className="text-info mb-0">
                  <i className="ti-arrow-up"></i>659
                </h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={3} md={6}>
        <Card>
          <CardBody>
            <CardTitle className="text-uppercase">Bounce Rate</CardTitle>
            <div className="d-flex align-items-center mt-2">
              <div style={{ width: "80px" }}>
                <Chart
                  options={optionsSparklineCards4}
                  series={seriesSparklineCards4}
                  type="bar"
                  height="30"
                />
              </div>
              <div className="ml-auto">
                <h2 className="text-danger mb-0">
                  <i className="ti-arrow-down"></i>659
                </h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default SparklineCards;
