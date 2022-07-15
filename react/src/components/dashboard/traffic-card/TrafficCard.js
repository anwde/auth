import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

import Chart from "react-apexcharts";

const TrafficCard = () => {
  const optionstrafficcard1 = {
    chart: {
      fontFamily: "Rubik,sans-serif",
      height: 50,
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
      borderColor: "transparent",
    },
    stroke: {
      curve: "straight",
      width: 0,
    },
    colors: ["#ff5050"],
    fill: {
      type: "solid",
      colors: ["#ff5050"],
      opacity: 1,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriestrafficcard1 = [
    {
      name: "",
      data: [0, 7, 2, 5, 3, 5, 8, 0],
    },
  ];
  // 2
  const optionstrafficcard2 = {
    chart: {
      fontFamily: "Rubik,sans-serif",
      height: 50,
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
      borderColor: "transparent",
    },
    stroke: {
      curve: "straight",
      width: 0,
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
      show: false,
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriestrafficcard2 = [
    {
      name: "",
      data: [0, 7, 2, 5, 3, 5, 8, 0],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Wizard Page                                                            */
    /*--------------------------------------------------------------------------------*/
    <div>
      <Card>
        <CardBody>
          <div className="d-flex align-items-center mb-3">
            <CardTitle className="text-uppercase mb-0">
              Mothly Site Traffic
            </CardTitle>
            <div className="ml-auto">
              <small className="text-success">
                <i className="fas fa-sort-up"></i> 18% High then last month
              </small>
            </div>
          </div>
          <div className="d-flex flex-row">
            <div className="p-2 pl-0 border-right">
              <h6 className="font-light">Overall Growth</h6>
              <span className="font-medium">80.40%</span>
            </div>
            <div className="p-2 border-right">
              <h6 className="font-light">Montly</h6>
              <span className="font-medium">20.40%</span>
            </div>
            <div className="p-2">
              <h6 className="font-light">Day</h6>
              <span className="font-medium">5.40%</span>
            </div>
          </div>
        </CardBody>
        <div className="mt-3">
          <Chart
            options={optionstrafficcard1}
            series={seriestrafficcard1}
            type="area"
            height="50"
          />
        </div>
      </Card>

      <Card>
        <CardBody>
          <div className="d-flex align-items-center mb-3">
            <CardTitle className="text-uppercase mb-0">
              Weekly Site Traffic
            </CardTitle>
            <div className="ml-auto">
              <small className="text-danger">
                <i className="fas fa-sort-down"></i> 18% High then last month
              </small>
            </div>
          </div>
          <div className="d-flex flex-row">
            <div className="p-2 pl-0 border-right">
              <h6 className="font-light">Overall Growth</h6>
              <span className="font-medium">80.40%</span>
            </div>
            <div className="p-2 border-right">
              <h6 className="font-light">Montly</h6>
              <span className="font-medium">20.40%</span>
            </div>
            <div className="p-2">
              <h6 className="font-light">Day</h6>
              <span className="font-medium">5.40%</span>
            </div>
          </div>
        </CardBody>
        <div className="mt-3">
          <Chart
            options={optionstrafficcard2}
            series={seriestrafficcard2}
            type="area"
            height="50"
          />
        </div>
      </Card>
    </div>
  );
};

export default TrafficCard;
