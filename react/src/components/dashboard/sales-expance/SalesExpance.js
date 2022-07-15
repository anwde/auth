import React from "react";

import { Card, Row, Col, CardTitle } from "reactstrap";

import Chart from "react-apexcharts";

const SalesExpance = () => {
  const optionssalesexpance = {
    chart: {
      id: "basic-bar",
      fontFamily: "Rubik,sans-serif",
      type: "area",
      height: 265,
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
  const seriessalesexpance = [
    {
      name: "Site A",
      data: [2, 5, 2, 6, 2, 5, 2, 4],
    },
    {
      name: "Site B",
      data: [5, 2, 7, 4, 5, 3, 5, 4],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <div className="p-3">
        <div className="d-md-flex align-items-center">
          <div>
            <CardTitle className="text-uppercase">Sales Expance</CardTitle>
          </div>
          <div className="ml-auto align-items-center">
            <ul className="list-inline mr-3 mb-0">
              <li className="border-0 p-0 text-info list-inline-item">
                <i className="fa fa-circle"></i> Xtreme
              </li>
              <li className="border-0 p-0 text-danger list-inline-item">
                <i className="fa fa-circle"></i> Ample
              </li>
            </ul>
          </div>
        </div>
        <Chart
          options={optionssalesexpance}
          series={seriessalesexpance}
          type="area"
          height="265"
        />
      </div>
      <Row>
        <Col lg={6} className="border-right border-top border-bottom">
          <div className="d-flex align-items-center px-4 py-3">
            <h2 className="mb-0 text-info display-7">
              <i className="ti-headphone-alt"></i>
            </h2>
            <div className="ml-4">
              <h2 className="font-normal">$250</h2>
              <h4>Entertainment</h4>
            </div>
          </div>
        </Col>
        <Col lg={6} className="border-bottom border-top">
          <div className="d-flex align-items-center px-4 py-3">
            <h2 className="mb-0 text-info display-7">
              <i className="ti-home"></i>
            </h2>
            <div className="ml-4">
              <h2 className="font-normal">$60.50</h2>
              <h4>House Rent</h4>
            </div>
          </div>
        </Col>
        <Col lg={6} className="border-right ">
          <div className="d-flex align-items-center px-4 py-3">
            <h2 className="mb-0 text-info display-7">
              <i className="far fa-paper-plane"></i>
            </h2>
            <div className="ml-4">
              <h2 className="font-normal">$28</h2>
              <h4>Travel</h4>
            </div>
          </div>
        </Col>
        <Col lg={6} className="">
          <div className="d-flex align-items-center px-4 py-3">
            <h2 className="mb-0 text-info display-7">
              <i className="ti-shopping-cart"></i>
            </h2>
            <div className="ml-4">
              <h2 className="font-normal">$70</h2>
              <h4>Shopping</h4>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default SalesExpance;
