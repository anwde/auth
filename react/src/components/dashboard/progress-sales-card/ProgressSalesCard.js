import React from "react";

import { Card, CardBody, Progress, CardTitle, Row, Col } from "reactstrap";

const ProgressSalesCard = () => {
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <div>
      <Row>
        <Col lg={3} md={6}>
          <Card>
            <CardBody>
              <CardTitle className="text-uppercase">Daliy Sales</CardTitle>
              <div className="text-right">
                <span className="text-muted font-light">Today's Income</span>
                <h2 className="mt-2 display-7">
                  <sup>
                    <i className="ti-arrow-up text-success"></i>
                  </sup>
                  $12,000
                </h2>
              </div>
              <span className="text-success">20%</span>
              <Progress color="success" value="25" />
            </CardBody>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card>
            <CardBody>
              <CardTitle className="text-uppercase">Weekly Sales</CardTitle>
              <div className="text-right">
                <span className="text-muted font-light">Weekly Income</span>
                <h2 className="mt-2 display-7">
                  <sup>
                    <i className="ti-arrow-down text-info"></i>
                  </sup>
                  $5,000
                </h2>
              </div>
              <span className="text-info">30%</span>
              <Progress color="info" value="30" />
            </CardBody>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card>
            <CardBody>
              <CardTitle className="text-uppercase">Monthly Sales</CardTitle>
              <div className="text-right">
                <span className="text-muted font-light">Monthly Income</span>
                <h2 className="mt-2 display-7">
                  <sup>
                    <i className="ti-arrow-down text-danger"></i>
                  </sup>
                  $10,000
                </h2>
              </div>
              <span className="text-danger">60%</span>
              <Progress color="danger" value="60" />
            </CardBody>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card>
            <CardBody>
              <CardTitle className="text-uppercase">Yearly Sales</CardTitle>
              <div className="text-right">
                <span className="text-muted font-light">Yearly Income</span>
                <h2 className="mt-2 display-7">
                  <sup>
                    <i className="ti-arrow-up text-inverse"></i>
                  </sup>
                  $9,000
                </h2>
              </div>
              <span className="text-dark">20%</span>
              <Progress color="dark" value="20" />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProgressSalesCard;
