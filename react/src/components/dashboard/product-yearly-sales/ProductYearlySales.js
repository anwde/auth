import React from "react";

import { Card, CardBody, CardTitle } from "reactstrap";

import Chart from "react-apexcharts";

const ProductYearlySales = () => {
  const optionsproductyearlysales = {
    chart: {
      id: "basic-bar",
      fontFamily: "Rubik,sans-serif",
      type: "area",
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#2cabe3", "#ff5050"],
    legend: {
      show: false,
    },
    markers: {
      size: 4,
      strokeColors: "transparent",
    },
    xaxis: {
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      labels: {
        show: true,
        style: {
          colors: [
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
          ],
          fontSize: "12px",
          fontFamily: "'Rubik', sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: [
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
            "#99abb4",
          ],
          fontSize: "12px",
          fontFamily: "'Rubik', sans-serif",
        },
      },
    },
    grid: {
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
    tooltip: {
      theme: "dark",
    },
  };
  const seriesproductyearlysales = [
    {
      name: "Windows",
      data: [2, 5, 2, 6, 2, 5, 2, 4],
    },
    {
      name: "Mac",
      data: [5, 2, 7, 4, 5, 3, 5, 4],
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
            <CardTitle className="text-uppercase">
              Products Yearly Sales
            </CardTitle>
          </div>
          <div className="ml-auto align-items-center">
            <ul className="list-inline mr-3 mb-0">
              <li className="border-0 p-0 text-info list-inline-item">
                <i className="fa fa-circle"></i> Mac
              </li>
              <li className="border-0 p-0 text-danger list-inline-item">
                <i className="fa fa-circle"></i> Windows
              </li>
            </ul>
          </div>
        </div>
        <div>
          <Chart
            options={optionsproductyearlysales}
            series={seriesproductyearlysales}
            type="area"
            height="310"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductYearlySales;
