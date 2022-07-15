import React from "react";
import { Card, CardBody, Button, Row, Col } from "reactstrap";

import user1 from "../../../assets/images/users/1.jpg";
import user2 from "../../../assets/images/users/2.jpg";
import user3 from "../../../assets/images/users/3.jpg";
import user4 from "../../../assets/images/users/4.jpg";

const UserProfileCard = () => {
  return (
    <div className="w-100">
      <Card>
        <div className="p-4">
          <div className="d-flex flex-row">
            <div className="">
              <img
                src={user1}
                alt="user"
                className="rounded-circle"
                width="100"
              />
            </div>
            <div className="pl-4">
              <h3>Daniel Kristeen</h3>
              <h4>UIUX Designer</h4>
              <Button
                color="success"
                className="btn-rounded text-uppercase font-14"
              >
                <i className="ti-plus mr-2"></i> Follow
              </Button>
            </div>
          </div>
          <Row className="pt-2 mt-4">
            <Col className="border-right text-center">
              <h2 className="font-weight-light">14</h2>
              <h4 className="text-uppercase">Photos</h4>
            </Col>
            <Col className="border-right text-center">
              <h2 className="font-weight-light">54</h2>
              <h4 className="text-uppercase">Videos</h4>
            </Col>
            <Col className="text-center">
              <h2 className="font-weight-light">145</h2>
              <h4 className="text-uppercase">Tasks</h4>
            </Col>
          </Row>
        </div>
        <CardBody className="mt-4 border-top">
          <p className="text-center aboutscroll mb-3 pb-2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore ipsum dolor sit amet,
            consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
            labore
          </p>
          <hr />
          <h4 className="font-medium text-center">Followers</h4>
          <ul className="list-style-none list-icons d-flex flex-item text-center pt-2">
            <li className="col px-2">
              <a href="/">
                <img
                  src={user2}
                  alt="user"
                  className="rounded-circle"
                  width="50"
                />
              </a>
            </li>
            <li className="col px-2">
              <a href="/">
                <img
                  src={user3}
                  alt="user"
                  className="rounded-circle"
                  width="50"
                />
              </a>
            </li>
            <li className="col px-2">
              <a href="/">
                <img
                  src={user4}
                  alt="user"
                  className="rounded-circle"
                  width="50"
                />
              </a>
            </li>
            <li className="col px-2">
              <a href="/">
                <Button
                  color="info"
                  size="lg"
                  className="btn-circle d-flex align-items-center justify-content-center font-14"
                >
                  5 +
                </Button>
              </a>
            </li>
          </ul>
        </CardBody>
        <div className="p-2 border-top">
          <ul className="list-style-none list-icons d-flex flex-item text-center">
            <li className="col py-2">
              <a href="/" className="text-muted">
                <i className="fa fa-globe font-20"></i>
              </a>
            </li>
            <li className="col py-2">
              <a href="/" className="text-muted">
                <i className="fab fa-twitter font-20"></i>
              </a>
            </li>
            <li className="col py-2">
              <a href="/" className="text-muted">
                <i className="fab fa-facebook-square font-20"></i>
              </a>
            </li>
            <li className="col py-2">
              <a href="/" className="text-muted">
                <i className="fab fa-youtube font-20"></i>
              </a>
            </li>
            <li className="col py-2">
              <a href="/" className="text-muted">
                <i className="fab fa-linkedin font-20"></i>
              </a>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default UserProfileCard;
