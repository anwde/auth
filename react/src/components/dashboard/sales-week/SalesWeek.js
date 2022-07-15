import React from "react";

import { Card, Button, CardSubtitle } from "reactstrap";

import Chart from "react-apexcharts";

const SalesWeek = () => {
  const optionssalesweek = {
    chart: {
      id: "basic-bar",
      type: "bar",
      fontFamily: "Rubik,sans-serif",
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
    },
    colors: ["rgba(255,255,255,0.6)"],
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "flat",
        columnWidth: "30%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      theme: "dark",
    },
  };
  const seriessalesweek = [
    {
      name: "Week Sales",
      data: [5, 4, 3, 5.5, 5, 2, 3],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <div className="bg-danger">
        <div className="m-auto" style={{ height: "295px", width: "230px" }}>
          <Chart
            options={optionssalesweek}
            series={seriessalesweek}
            type="bar"
            height="295"
          />
        </div>
      </div>
      <div className="p-4">
        <div className="d-flex align-items-center">
          <div>
            <h2 className="font-medium">Week Sales</h2>
            <CardSubtitle>Ios app - 160 sales</CardSubtitle>
          </div>
          <div className="ml-auto">
            <Button
              className="btn btn-circle btn-info text-white btn-lg"
              href=""
            >
              <i className="ti-shopping-cart"></i>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SalesWeek;
