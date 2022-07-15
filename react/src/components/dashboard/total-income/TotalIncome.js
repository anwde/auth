import React from "react";

import { Card, CardBody } from "reactstrap";

import Chart from "react-apexcharts";

const TotalIncome = () => {
  const optionstotalincome = {
    chart: {
      type: "bar",
      fontFamily: "Rubik,sans-serif",
      height: 55,
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
        columnWidth: "5%",
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
        fillColors: ["#2cabe3"],
      },
      x: {
        show: false,
      },
    },
  };
  const seriestotalincome = [
    {
      name: "",
      data: [1.1, 1.4, 1.1, 0.9, 2.1, 1, 0.3],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody>
        <div className="d-flex align-items-center">
          <div>
            <h2 className="mb-0 font-medium">$354.50</h2>
            <h5 className="text-muted mb-0">Total Income</h5>
          </div>
          <div className="ml-auto">
            <div style={{ height: "55px", width: "100px" }}>
              <Chart
                options={optionstotalincome}
                series={seriestotalincome}
                type="bar"
                height="55"
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TotalIncome;
