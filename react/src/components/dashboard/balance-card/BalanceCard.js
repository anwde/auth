import React from "react";

import { Card, CardBody, Button } from "reactstrap";

import Chart from "react-apexcharts";

const BalanceCard = () => {
  const optionsBalanceCard = {
    chart: {
      fontFamily: "Rubik,sans-serif",
      height: 85,
      type: "area",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
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
      width: "2",
    },
    colors: ["#79e580", "#2cabe3"],
    legend: {
      show: false,
    },
    fill: {
      type: "solid",
      colors: ["#79e580", "#2cabe3"],
      opacity: 0.1,
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriesBalanceCard = [
    {
      name: "Site A",
      data: [50, 160, 110, 60, 130, 200, 100],
    },
    {
      name: "Site B",
      data: [0, 100, 60, 200, 150, 90, 150],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody>
        <div className="d-flex align-items-center">
          <Button className="btn btn-circle btn-success text-white btn-lg">
            <i className="ti-plus"></i>
          </Button>
          <div className="ml-3">
            <h2 className="display-6">$456.90</h2>
            <h5 className="font-light">Your wallet Balance</h5>
          </div>
        </div>
        <div>
          <Chart
            options={optionsBalanceCard}
            series={seriesBalanceCard}
            type="area"
            height="85"
          />
        </div>
      </CardBody>
      <ul className="list-style-none mt-4">
        <li className="py-2 px-4 border-top">
          <div className="d-flex align-items-center">
            <i className="ti-wallet font-24 text-info"></i>
            <a href="/" className="link ml-3 font-18 font-light">
              Withdraw Money
            </a>
          </div>
        </li>
        <li className="py-2 px-4 border-top">
          <div className="d-flex align-items-center">
            <i className="ti-bag font-24 text-info"></i>
            <a href="/" className="link ml-3 font-18 font-light">
              Shop Now
            </a>
          </div>
        </li>
        <li className="py-2 px-4 border-top">
          <div className="d-flex align-items-center">
            <i className="ti-briefcase font-24 text-info"></i>
            <a href="/" className="link ml-3 font-18 font-light">
              Add funds
            </a>
          </div>
        </li>
        <li className="py-2 px-4 border-top">
          <div className="d-flex align-items-center">
            <i className="ti-notepad font-24 text-info"></i>
            <a href="/" className="link ml-3 font-18 font-light">
              Statement
            </a>
          </div>
        </li>
        <li className="py-2 px-4 border-top">
          <div className="d-flex align-items-center">
            <i className="ti-money font-24 text-info"></i>
            <a href="/" className="link ml-3 font-18 font-light">
              Purchase
            </a>
          </div>
        </li>
        <li className="py-2 px-4 border-top">
          <div className="d-flex align-items-center">
            <i className="ti-files font-24 text-info"></i>
            <a href="/" className="link ml-3 font-18 font-light">
              Receipts
            </a>
          </div>
        </li>
        <li className="py-2 px-4 border-top">
          <div className="d-flex align-items-center">
            <i className="ti-marker font-24 text-info"></i>
            <a href="/" className="link ml-3 font-18 font-light">
              Generate Pin
            </a>
          </div>
        </li>
      </ul>
    </Card>
  );
};

export default BalanceCard;
