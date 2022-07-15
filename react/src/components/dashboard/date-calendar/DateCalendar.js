import React, { useState } from "react";

import { Card, CardBody, Row, Col } from "reactstrap";

import DatePicker from "react-datetime";
import "react-datetime/css/react-datetime.css";

const DateCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const state = {
    curTime: new Date().getDate(),
    // curDay: new Date().getDay(),
    curDay: new Date().getDay(),
    curYear: new Date().getFullYear(),
    curMonth: new Date().getMonth(),
  };
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card className="w-100">
      <Row className="h-100">
        <Col md={4}>
          <CardBody>
            <span className="display-6">
              <span className="font-normal">{state.curTime}</span>
            </span>
            <h4 className="pb-2 mb-0">{dayNames[state.curDay]}</h4>
            <span className="weight-border"></span>
            <span className="text-dark d-block">
              {monthNames[state.curMonth]} {state.curYear}
            </span>
            <div className="bottom-text">
              <a href="/" className="text-info text-uppercase">
                3 Tasks
              </a>
              <h5 className="mb-0 mt-2">Prepare Project</h5>
            </div>
          </CardBody>
        </Col>
        <Col md={8}>
          <div className="bg-primary text-white calendar-widget h-100">
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline={true}
              open={true}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default DateCalendar;
