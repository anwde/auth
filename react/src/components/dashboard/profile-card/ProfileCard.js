import React from "react";

import { Card, CardBody, Button, Row, Col } from "reactstrap";

import PerfectScrollbar from "react-perfect-scrollbar";

import img1 from "../../../assets/images/users/1.jpg";
import img2 from "../../../assets/images/users/2.jpg";
import img4 from "../../../assets/images/users/4.jpg";
import img5 from "../../../assets/images/users/5.jpg";

const ProfileCard = () => {
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <div className="p-4">
        <div className="d-flex flex-row">
          <div className="">
            <img src={img1} alt="user" className="rounded-circle" width="100" />
          </div>
          <div className="pl-4">
            <h3>Daniel Kristeen</h3>
            <h4>UIUX Designer</h4>
            <Button
              color="success"
              className="btn-rounded text-white text-uppercase font-14"
            >
              <i className="ti-plus mr-2"></i> Follow
            </Button>
          </div>
        </div>
        <Row className="mt-5">
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
      <CardBody className="border-top">
        <p className="text-center" style={{ height: "100px" }}>
          <PerfectScrollbar>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore ipsum dolor sit amet,
            consectetur adipisicing elit incididunt ut labore ipsum dolor sit
            amet. sit amet, consectetur adipisicing elit incididunt ut labore
            ipsum dolor sit amet
          </PerfectScrollbar>
        </p>
        <hr />
        <h4 className="font-medium text-center mt-3">Followers</h4>
        <ul className="list-style-none list-icons d-flex flex-item text-center pt-2">
          <li className="col px-2">
            <a href="/">
              <img
                src={img4}
                alt="user"
                className="rounded-circle"
                width="50"
              />
            </a>
          </li>
          <li className="col px-2">
            <a href="/">
              <img
                src={img5}
                alt="user"
                className="rounded-circle"
                width="50"
              />
            </a>
          </li>
          <li className="col px-2">
            <a href="/">
              <img
                src={img2}
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
                className="btn btn-circle text-white"
              >
                <span className="font-14">5+</span>
              </Button>
            </a>
          </li>
        </ul>
      </CardBody>
      <CardBody className="border-top py-3">
        <ul className="list-style-none list-icons d-flex flex-item text-center">
          <li className="col">
            <a href="/" className="text-muted">
              <i className="fa fa-globe font-20"></i>
            </a>
          </li>
          <li className="col">
            <a href="/" className="text-muted">
              <i className="fab fa-twitter font-20"></i>
            </a>
          </li>
          <li className="col">
            <a href="/" className="text-muted">
              <i className="fab fa-facebook-square font-20"></i>
            </a>
          </li>
          <li className="col">
            <a href="/" className="text-muted">
              <i className="fab fa-youtube font-20"></i>
            </a>
          </li>
          <li className="col">
            <a href="/" className="text-muted">
              <i className="fab fa-linkedin font-20"></i>
            </a>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};

export default ProfileCard;
