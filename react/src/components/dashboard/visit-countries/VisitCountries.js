import React from "react";
import { Card, CardBody, CardTitle, Progress } from "reactstrap";

const VisitCountries = () => {
  return (
    <Card>
      <CardBody>
        <CardTitle className="text-uppercase">
          Visit From the countries
        </CardTitle>
        <div className="">
          <ul className="list-style-none country-state mt-4">
            <li className="mb-4">
              <h2 className="mb-0">6350</h2>
              <div className="d-flex align-items-center">
                <small>From India</small>
                <div className="ml-auto">
                  48% <i className="fas fa-level-up-alt text-success"></i>
                </div>
              </div>
              <Progress value="48" color="success"></Progress>
            </li>
            <li className="mb-4">
              <h2 className="mb-0">3250</h2>
              <div className="d-flex align-items-center">
                <small>From UAE</small>
                <div className="ml-auto">
                  98% <i className="fas fa-level-up-alt text-success"></i>
                </div>
              </div>
              <Progress value="65" color="info"></Progress>
            </li>
            <li className="mb-4">
              <h2 className="mb-0">1250</h2>
              <div className="d-flex align-items-center">
                <small>From Australia</small>
                <div className="ml-auto">
                  75% <i className="fas fa-level-down-alt text-danger"></i>
                </div>
              </div>
              <Progress value="75" color="dark"></Progress>
            </li>
            <li className="mb-4">
              <h2 className="mb-0">1350</h2>
              <div className="d-flex align-items-center">
                <small>From China</small>
                <div className="ml-auto">
                  12% <i className="fas fa-level-up-alt text-success"></i>
                </div>
              </div>
              <Progress value="12" color="danger"></Progress>
            </li>
            <li className="mb-4">
              <h2 className="mb-0">6350</h2>
              <div className="d-flex align-items-center">
                <small>From Albania</small>
                <div className="ml-auto">
                  78% <i className="fas fa-level-up-alt text-success"></i>
                </div>
              </div>
              <Progress value="78" color="warning"></Progress>
            </li>
            <li className="mb-4">
              <h2 className="mb-0">3250</h2>
              <div className="d-flex align-items-center">
                <small>From Argentina</small>
                <div className="ml-auto">
                  45% <i className="fas fa-level-up-alt text-success"></i>
                </div>
              </div>
              <Progress value="45" color="info"></Progress>
            </li>
            <li>
              <h2 className="mb-0">1250</h2>
              <div className="d-flex align-items-center">
                <small>From Malawi</small>
                <div className="ml-auto">
                  20% <i className="fas fa-level-down-alt text-danger"></i>
                </div>
              </div>
              <Progress value="20" color="primary"></Progress>
            </li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};

export default VisitCountries;
