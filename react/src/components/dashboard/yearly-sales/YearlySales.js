import React from "react";

import { Card, CardBody, Row, Col } from "reactstrap";

import Chart from "react-apexcharts";

const YearlySales = () => {
  const optionsyearlysales = {
    chart: {
      fontFamily: "Rubik,sans-serif",
      height: 57,
      type: "area",
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
      width: ["0", "2"],
      dashArray: [0, 4],
    },
    colors: ["rgba(44, 171, 227, 0.5)", "rgba(44, 171, 227, 0.3)"],
    fill: {
      type: "solid",
      colors: ["rgba(44, 171, 227, 0.5)", "rgba(44, 171, 227, 0.3)"],
      opacity: 1,
    },
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
  const seriesyearlysales = [
    {
      name: "",
      data: [1, 2, 5, 3, 4, 2.5, 5, 3, 1],
    },
    {
      name: "",
      data: [1, 4, 2, 5, 2, 5.5, 3, 4, 1],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody>
        <Row>
          <Col sm={6}>
            <h2 className="font-medium mb-0">3456</h2>
            <h5 className="text-muted mb-0">Yearly Sales</h5>
          </Col>
          <Col sm={6}>
            <div style={{ height: "57px" }}>
              <Chart
                options={optionsyearlysales}
                series={seriesyearlysales}
                type="area"
                height="57"
              />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default YearlySales;
