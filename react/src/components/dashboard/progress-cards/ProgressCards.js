import React from "react";
import { Card, CardBody, Row, Col, CardTitle } from "reactstrap";

const PostCard = () => {
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Wizard Page                                                            */
    /*--------------------------------------------------------------------------------*/
    <Row>
      <Col md={6} lg={3}>
        <Card>
          <CardBody>
            <CardTitle className="text-uppercase">New Clients</CardTitle>
            <div className="d-flex align-items-center mb-2 mt-4">
              <h2 className="mb-0 display-5"><i className="icon-people text-info"></i></h2>
              <div className="ml-auto">
                <h2 className="mb-0 display-6"><span className="font-weight-normal">23</span></h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md={6} lg={3}>
        <Card>
          <CardBody>
            <CardTitle className="text-uppercase">New Projects</CardTitle>
            <div className="d-flex align-items-center mb-2 mt-4">
              <h2 className="mb-0 display-5"><i className="icon-folder text-primary"></i></h2>
              <div className="ml-auto">
                <h2 className="mb-0 display-6"><span className="font-weight-normal">169</span></h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md={6} lg={3}>
        <Card>
          <CardBody>
            <CardTitle className="text-uppercase">Open Projects</CardTitle>
            <div className="d-flex align-items-center mb-2 mt-4">
              <h2 className="mb-0 display-5"><i className="icon-folder-alt text-danger"></i></h2>
              <div className="ml-auto">
                <h2 className="mb-0 display-6"><span className="font-weight-normal">311</span></h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md={6} lg={3}>
        <Card>
          <CardBody>
            <CardTitle className="text-uppercase">New Invoices</CardTitle>
            <div className="d-flex align-items-center mb-2 mt-4">
              <h2 className="mb-0 display-5"><i className="ti-wallet text-success"></i></h2>
              <div className="ml-auto">
                <h2 className="mb-0 display-6"><span className="font-weight-normal">117</span></h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default PostCard;
