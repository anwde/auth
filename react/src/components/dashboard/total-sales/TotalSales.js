import React from "react";

import { Card, CardBody, CardTitle } from "reactstrap";

import Chart from "react-apexcharts";

const TotalSales = () => {
  const optiontotalsales = {
    chart: {
      fontFamily: "Rubik,sans-serif",
      type: "donut",
      height: 300,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75px",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              color: undefined,
              offsetY: 10,
            },
            value: {
              show: false,
              color: "#99abb4",
            },
            total: {
              show: true,
              label: "Sales",
              color: "#99abb4",
            },
          },
        },
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    labels: ["Open", "Clicked", "Un-opened", "Bounced"],
    colors: ["#2cabe3", "#2cd07e", "#ff5050", "#7bcef3"],
  };
  const seriestotalsales = [40, 12, 28, 60];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody>
        <CardTitle className="text-uppercase">Sales</CardTitle>
        <div
          className="my-4 d-flex align-items-center justify-content-center"
          style={{ height: "323px" }}
        >
          <Chart
            options={optiontotalsales}
            series={seriestotalsales}
            type="donut"
            height="240"
          />
        </div>
        <div className="d-flex align-items-center mt-5">
          <div>
            <h3 className="font-medium text-uppercase">Total Sales</h3>
            <h5 className="text-muted">160 sales monthly</h5>
          </div>
          <div className="ml-auto">
            <button className="btn btn-info btn-circle btn-lg text-white">
              <i className="ti-shopping-cart"></i>
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TotalSales;
