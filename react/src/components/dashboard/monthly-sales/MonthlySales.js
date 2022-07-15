import React from "react";

import { Card, CardBody, Row, Col } from "reactstrap";

import Chart from "react-apexcharts";

const MonthlySales = () => {
  const optionsmonthlysales = {
    chart: {
      fontFamily: "Rubik,sans-serif",
      height: 57,
      type: "line",
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 5,
      borderColor: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: ["3"],
      dashArray: [4],
    },
    colors: ["#2cabe3"],
    fill: {
      type: "solid",
      colors: ["#2cabe3"],
      opacity: 1,
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        show: true,
      },
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriesmonthlysales = [
    {
      name: "",
      data: [1, -2, 5, 3, 0, 2.5],
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
            <h2 className="mb-0 font-medium">356</h2>
            <h5 className="text-muted mb-0">Monthly Sales</h5>
          </Col>
          <Col sm={6}>
            <div style={{ height: "57px" }}>
              <Chart
                options={optionsmonthlysales}
                series={seriesmonthlysales}
                type="line"
                height="57"
              />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default MonthlySales;
