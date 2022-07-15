import React from "react";

import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

import Chart from "react-apexcharts";

const TopEarning = () => {
  const optionstopearning = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    colors: ["#2962FF", "#ff7676"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 3,
    },
    grid: {
      borderColor: "#e7e7e7",
      yaxis: {
        lines: {
          offsetX: -30,
        },
      },
      padding: {
        left: 20,
      },
    },
    markers: {
      size: 2,
      colors: "transparent",
      strokeColors: ["#2962FF", "#ff7676"],
      strokeWidth: 2,
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: [
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
          ],
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      floating: false,

      labels: {
        style: {
          colors: [
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
          ],
        },
        offsetY: -7,
        offsetX: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      floating: true,
      labels: {
        colors: "#a1aab2",
      },
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriestopearning = [
    {
      name: "Max temp",
      data: [5, 15, 11, 15, 12, 13, 10],
    },
    {
      name: "Min temp",
      data: [1, -2, 2, 5, 3, 2, 0],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody>
        <div className="d-md-flex align-items-center">
          <div>
            <CardTitle className="text-uppercase">Top Selling</CardTitle>
            <CardSubtitle>Last 5 Days</CardSubtitle>
          </div>
          <div className="ml-auto align-items-center">
            <select className="form-control">
              <option>January 2018</option>
              <option>February 2018</option>
              <option>March 2018</option>
            </select>
          </div>
        </div>
        <div>
          <Chart
            options={optionstopearning}
            series={seriestopearning}
            type="line"
            height="370"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default TopEarning;
