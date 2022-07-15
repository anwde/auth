import React from "react";
import { Card, CardGroup, Button, Progress } from "reactstrap";

const EarningCards = () => {
  return (
    <div>
      <CardGroup>
        <Card className="p-2 p-lg-3">
          <div className="p-lg-3 p-2">
            <div className="d-flex align-items-center">
              <Button
                color="danger"
                className="btn btn-circle text-white btn-lg flex-shrink-0"
              >
                <i className="ti-clipboard"></i>
              </Button>
              <div className="ml-4 w-100 mr-3">
                <h4 className="font-light">Total Projects</h4>
                <Progress value="4" color="danger" max="5" width="100%" />
              </div>
              <div className="ml-auto">
                <h2 className="display-7 mb-0">23</h2>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-2 p-lg-3">
          <div className="p-lg-3 p-2">
            <div className="d-flex align-items-center">
              <Button
                color="info"
                className="btn btn-circle text-white btn-lg flex-shrink-0"
              >
                <i className="ti-wallet"></i>
              </Button>
              <div className="ml-4 w-100 mr-3">
                <h4 className="font-light">Total Earnings</h4>
                <Progress value="3" color="info" max="5" />
              </div>
              <div className="ml-auto">
                <h2 className="display-7 mb-0">76</h2>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-2 p-lg-3">
          <div className="p-lg-3 p-2">
            <div className="d-flex align-items-center">
              <Button
                color="warning"
                className="btn btn-circle text-white btn-lg flex-shrink-0"
              >
                <i className="fas fa-dollar-sign"></i>
              </Button>
              <div className="ml-4 w-100 mr-3">
                <h4 className="font-light">Total Earnings</h4>
                <Progress value="4" color="warning" max="5" />
              </div>
              <div className="ml-auto">
                <h2 className="display-7 mb-0">83</h2>
              </div>
            </div>
          </div>
        </Card>
      </CardGroup>
    </div>
  );
};

export default EarningCards;
