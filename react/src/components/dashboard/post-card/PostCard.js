import React from "react";
import { Card, CardBody, Row, Col, CardImg, CardSubtitle } from "reactstrap";

import img1 from "../../../assets/images/big/img1.jpg";
import img2 from "../../../assets/images/big/img2.jpg";
import img3 from "../../../assets/images/big/img3.jpg";

const PostCard = () => {
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Wizard Page                                                            */
    /*--------------------------------------------------------------------------------*/
    <Row>
      <Col lg={4}>
        <Card>
          <CardImg top width="100%" src={img1} alt="Card image cap" />
          <CardBody>
            <div className="d-flex align-items-center mb-3">
              <span className="text-muted">
                <i className="ti-calendar"></i> May 16
              </span>
              <div className="ml-3">
                <a href="/" className="link">
                  <i className="ti-heart"></i> 30
                </a>
              </div>
            </div>
            <h3>Top 20 Models are on the ramp</h3>
            <CardSubtitle className="text-dark mt-3">
              Titudin venenatis ipsum ac feugiat. Vestibulum ullamcorper quam.
            </CardSubtitle>
          </CardBody>
        </Card>
      </Col>
      <Col lg={4}>
        <Card>
          <CardImg top width="100%" src={img2} alt="Card image cap" />
          <CardBody>
            <div className="d-flex align-items-center mb-3">
              <span className="text-muted">
                <i className="ti-calendar"></i> May 16
              </span>
              <div className="ml-3">
                <a href="/" className="link">
                  <i className="ti-heart"></i> 30
                </a>
              </div>
            </div>
            <h3>Top 20 Models are on the ramp</h3>
            <CardSubtitle className="text-dark mt-3">
              Titudin venenatis ipsum ac feugiat. Vestibulum ullamcorper quam.
            </CardSubtitle>
          </CardBody>
        </Card>
      </Col>
      <Col lg={4}>
        <Card>
          <CardImg top width="100%" src={img3} alt="Card image cap" />
          <CardBody>
            <div className="d-flex align-items-center mb-3">
              <span className="text-muted">
                <i className="ti-calendar"></i> May 16
              </span>
              <div className="ml-3">
                <a href="/" className="link">
                  <i className="ti-heart"></i> 30
                </a>
              </div>
            </div>
            <h3>Top 20 Models are on the ramp</h3>
            <CardSubtitle className="text-dark mt-3">
              Titudin venenatis ipsum ac feugiat. Vestibulum ullamcorper quam.
            </CardSubtitle>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default PostCard;
