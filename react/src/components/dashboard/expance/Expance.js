import React from "react";

import { Card, Row, Col, Button } from "reactstrap";

import Chart from "react-apexcharts";

const Expance = () => {
  const optionsexpance = {
    chart: {
      type: "line",
      height: 130,
      fontFamily: "Rubik,sans-serif",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      stacked: false,
    },
    tooltip: {
      fillSeriesColor: false,
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    legends: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "35%",
      },
    },
    colors: ["rgba(255,255,255)", "rgba(255,255,255,0.5)"],
    fill: {
      type: "solid",
      colors: ["rgba(255,255,255)", "rgba(255,255,255,0.5)"],
      opacity: 1,
    },
    stroke: {
      width: 0,
    },
    grid: {
      show: false,
    },
  };
  const seriesexpance = [
    {
      name: "Site A",
      type: "column",
      data: [5, 6, 3, 7, 9, 10, 14, 12, 11, 9, 8, 7, 10, 6, 12, 10, 8],
    },
    {
      name: "Site B",
      type: "column",
      data: [1, 2, 8, 3, 4, 5, 7, 6, 5, 6, 4, 3, 3, 12, 5, 6, 3],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <div className="bg-danger p-3">
        <h5 className="card-title text-uppercase mb-0 text-white">Expance</h5>
        <Chart
          options={optionsexpance}
          series={seriesexpance}
          type="area"
          height="180"
        />
      </div>
      <div className="d-flex align-items-center p-4 border-bottom">
        <div>
          <h2 className="font-medium">$458.90</h2>
          <h5 className="text-muted mb-0">Expence for December 1 to 10</h5>
        </div>
        <div className="ml-auto">
          <Button color="info" size="lg" className="btn btn-circle">
            <i className="ti-plus"></i>
          </Button>
        </div>
      </div>
      <Row>
        <Col lg={6} className="border-right border-bottom">
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
        <Col lg={6} className="border-bottom">
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

export default Expance;
