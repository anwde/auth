import React from "react";

import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

import Chart from "react-apexcharts";

const TopSales = () => {
  const optionstopsales = {
    chart: {
      height: 390,
      fontFamily: '"Rubik",sans-serif',
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#2962ff"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    markers: {
      size: 3,
      colors: "#2962ff",
      strokeColors: "transparent",
      strokeWidth: 0,
    },
    grid: {
      show: true,
      borderColor: "rgba(0,0,0,0.1)",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
          width: 1,
          opacity: 0.2,
        },
      },
    },
    xaxis: {
      categories: [
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
      ],
      labels: {
        show: true,
        style: {
          colors: [
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
            "#a1aab2",
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
            "#a1aab2",
          ],
        },
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
    },
  };
  const seriestopsales = [
    {
      name: "Top selling",
      data: [2666, 2778, 4912, 3767, 6810, 5670, 4820, 15073, 10687, 8432],
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
            options={optionstopsales}
            series={seriestopsales}
            type="line"
            height="370"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default TopSales;
