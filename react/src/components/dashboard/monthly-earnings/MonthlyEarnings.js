import React from "react";

import { Card, CardBody, Button } from "reactstrap";

import user1 from "../../../assets/images/users/1.jpg";
import user2 from "../../../assets/images/users/2.jpg";
import user4 from "../../../assets/images/users/4.jpg";

const MonthlyEarnings = () => {
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <div className="p-4 border-bottom">
        <div className="d-flex align-items-center">
          <div>
            <h4 className="mb-0 font-light">Monthly Earnings</h4>
            <h2 className="mb-0 font-medium">$580.50</h2>
          </div>
          <div className="ml-auto">
            <select className="form-control">
              <option>January 2018</option>
              <option>February 2018</option>
              <option>March 2018</option>
            </select>
          </div>
        </div>
      </div>
      <CardBody className="bg-light">
        <div className="d-flex align-items-center py-3">
          <img src={user1} className="rounded-circle" width="60" alt="user" />
          <div className="ml-3">
            <h4 className="font-normal mb-0">Andrew Simon</h4>
            <span className="text-muted">10-11-2016</span>
          </div>
          <div className="ml-auto">
            <h2 className="mb-0 text-info font-medium">$46</h2>
          </div>
        </div>
        {/* 2 */}
        <div className="d-flex align-items-center py-3">
          <img src={user2} className="rounded-circle" width="60" alt="user" />
          <div className="ml-3">
            <h4 className="font-normal mb-0">John Deo</h4>
            <span className="text-muted">01-11-2018</span>
          </div>
          <div className="ml-auto">
            <h2 className="mb-0 text-info font-medium">$56</h2>
          </div>
        </div>
        {/* 4 */}
        <div className="d-flex align-items-center py-3">
          <img src={user4} className="rounded-circle" width="60" alt="user" />
          <div className="ml-3">
            <h4 className="font-normal mb-0">Emily Sion</h4>
            <span className="text-muted">14-04-2018</span>
          </div>
          <div className="ml-auto">
            <h2 className="mb-0 text-info font-medium">$12</h2>
          </div>
        </div>
        <Button
          color="info"
          className="btn-rounded py-2 font-14"
          size="sm"
          block
        >
          Withdrow Money
        </Button>
      </CardBody>
    </Card>
  );
};

export default MonthlyEarnings;
