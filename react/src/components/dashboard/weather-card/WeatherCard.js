import React from "react";

import { Card, CardBody, Row, Col } from "reactstrap";

import Chart from "react-apexcharts";

const WeatherCard = () => {
  const optionsweathercard = {
    chart: {
      height: 205,
      type: "line",
      fontFamily: "Rubik,sans-serif",
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: "3",
    },
    markers: {
      size: 4,
      strokeColors: "rgba(255,255,255,0.5)",
      fillOpacity: 1,
    },
    colors: ["rgba(255,255,255,0.5)"],
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriesweathercard = [
    {
      name: "Kufri",
      data: [5, 2, 7, 4, 5, 3, 5, 4],
    },
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody className="bg-primary text-white">
        <div className="pb-4">
          <h2 className="display-7">Kufri, Himachal Pradesh</h2>
          <h4 className="font-light">Friday, 19 Jan 2018</h4>
        </div>
        <div className="d-flex align-items-center mt-4">
          <span>
            <i className="mdi mdi-weather-windy display-5"></i>
          </span>
          <div className="ml-4">
            <h2 className="display-7">
              <span className="font-medium">25°</span>
            </h2>
            <p className="font-14 mb-0 font-light">Mostly Sunny</p>
          </div>
          <div className="ml-auto">
            <ul className="list-style-none">
              <li className="py-2">
                <span>
                  <i className="mdi mdi-weather-windy mr-1"></i>
                </span>
                <span className="font-light font-14">Humidity 38%</span>
              </li>
              <li className="py-2">
                <span>
                  <i className="mdi mdi-weather-fog mr-1"></i>
                </span>
                <span className="font-light font-14">Wind 38%</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <Chart
            options={optionsweathercard}
            series={seriesweathercard}
            type="line"
            height="205"
          />
        </div>
      </CardBody>
      <Row className="no-gutters">
        <Col lg={12}>
          <Row className="text-center no-gutters">
            <Col xs={6} md={2} className="border-right py-4 weather-report">
              <div className="mb-3 font-16 font-light">TUE</div>
              <h2 className="weather-type">
                <i className="mdi mdi-weather-lightning-rainy mb-2"></i>
              </h2>
              <div className="font-16 font-light">
                32 <sup>°F</sup>
              </div>
            </Col>
            <Col
              xs={6}
              md={2}
              className="border-right py-4 weather-report active"
            >
              <div className="mb-3 font-16 font-light">TUE</div>
              <h2 className="weather-type">
                <i className="mdi mdi-weather-lightning mb-2"></i>
              </h2>
              <div className="font-16 font-light">
                32 <sup>°F</sup>
              </div>
            </Col>
            <Col xs={6} md={2} className="border-right py-4 weather-report">
              <div className="mb-3 font-16 font-light">TUE</div>
              <h2 className="weather-type">
                <i className="mdi mdi-weather-fog mb-2"></i>
              </h2>
              <div className="font-16 font-light">
                32 <sup>°F</sup>
              </div>
            </Col>
            <Col xs={6} md={2} className="border-right py-4 weather-report">
              <div className="mb-3 font-16 font-light">TUE</div>
              <h2 className="weather-type">
                <i className="mdi mdi-weather-rainy mb-2"></i>
              </h2>
              <div className="font-16 font-light">
                32 <sup>°F</sup>
              </div>
            </Col>
            <Col xs={6} md={2} className="border-right py-4 weather-report">
              <div className="mb-3 font-16 font-light">TUE</div>
              <h2 className="weather-type">
                <i className="mdi mdi-weather-partlycloudy mb-2"></i>
              </h2>
              <div className="font-16 font-light">
                32 <sup>°F</sup>
              </div>
            </Col>
            <Col xs={6} md={2} className="border-right py-4 weather-report">
              <div className="mb-3 font-16 font-light">TUE</div>
              <h2 className="weather-type">
                <i className="mdi mdi-weather-snowy-rainy mb-2"></i>
              </h2>
              <div className="font-16 font-light">
                32 <sup>°F</sup>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default WeatherCard;
