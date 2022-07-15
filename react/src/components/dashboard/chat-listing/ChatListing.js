import React from "react";
import { Card, CardTitle, ListGroup, Button, ListGroupItem } from "reactstrap";

import user1 from "../../../assets/images/users/1.jpg";
import user2 from "../../../assets/images/users/2.jpg";
import user3 from "../../../assets/images/users/3.jpg";
import user4 from "../../../assets/images/users/4.jpg";
import user5 from "../../../assets/images/users/5.jpg";

const ChatListing = () => {
  return (
    <Card>
      <div className="p-3 bg-info">
        <CardTitle className="text-white mb-0 text-uppercase">
          Chat Listing
        </CardTitle>
      </div>
      <div className="p-3">
        <ListGroup flush className="chat-listing">
          <ListGroupItem tag="a" href="#" className="border-0 px-0 mb-3">
            <div className="d-flex align-items-center">
              <img
                src={user1}
                className="rounded-circle"
                width="40"
                alt="img"
              />
              <div className="ml-3">
                <h5 className="mb-0 text-dark">Varun Dhavan</h5>
                <small className="text-success">Online</small>
              </div>
              <div className="ml-auto chat-icon">
                <Button
                  color="success"
                  className="btn btn-success btn-circle text-white"
                >
                  <i className="fas fa-phone"></i>
                </Button>
                <Button color="info" className="btn btn-info btn-circle ml-2">
                  <i className="far fa-comments"></i>
                </Button>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem tag="a" href="#" className="border-0 px-0 mb-3">
            <div className="d-flex align-items-center">
              <img
                src={user2}
                className="rounded-circle"
                width="40"
                alt="img"
              />
              <div className="ml-3">
                <h5 className="mb-0 text-dark">Akshay Kumar</h5>
                <small className="text-muted">Offline</small>
              </div>
              <div className="ml-auto chat-icon">
                <Button
                  color="success"
                  className="btn btn-success btn-circle text-white"
                >
                  <i className="fas fa-phone"></i>
                </Button>
                <Button color="info" className="btn btn-info btn-circle ml-2">
                  <i className="far fa-comments"></i>
                </Button>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem tag="a" href="#" className="border-0 px-0 mb-3">
            <div className="d-flex align-items-center">
              <img
                src={user3}
                className="rounded-circle"
                width="40"
                alt="img"
              />
              <div className="ml-3">
                <h5 className="mb-0 text-dark">Shraddha Kapoor</h5>
                <small className="text-success">Online</small>
              </div>
              <div className="ml-auto chat-icon">
                <Button
                  color="success"
                  className="btn btn-success btn-circle text-white"
                >
                  <i className="fas fa-phone"></i>
                </Button>
                <Button color="info" className="btn btn-info btn-circle ml-2">
                  <i className="far fa-comments"></i>
                </Button>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem tag="a" href="#" className="border-0 px-0 mb-3">
            <div className="d-flex align-items-center">
              <img
                src={user4}
                className="rounded-circle"
                width="40"
                alt="img"
              />
              <div className="ml-3">
                <h5 className="mb-0 text-dark">Madhuri Dixit</h5>
                <small className="text-danger">Busy</small>
              </div>
              <div className="ml-auto chat-icon">
                <Button
                  color="success"
                  className="btn btn-success btn-circle text-white"
                >
                  <i className="fas fa-phone"></i>
                </Button>
                <Button color="info" className="btn btn-info btn-circle ml-2">
                  <i className="far fa-comments"></i>
                </Button>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem tag="a" href="#" className="border-0 px-0 mb-3">
            <div className="d-flex align-items-center">
              <img
                src={user5}
                className="rounded-circle"
                width="40"
                alt="img"
              />
              <div className="ml-3">
                <h5 className="mb-0 text-dark">Shaina Nehwal</h5>
                <small className="text-muted">Offline</small>
              </div>
              <div className="ml-auto chat-icon">
                <Button
                  color="success"
                  className="btn btn-success btn-circle text-white"
                >
                  <i className="fas fa-phone"></i>
                </Button>
                <Button color="info" className="btn btn-info btn-circle ml-2">
                  <i className="far fa-comments"></i>
                </Button>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem tag="a" href="#" className="border-0 px-0 mb-3">
            <div className="d-flex align-items-center">
              <img
                src={user3}
                className="rounded-circle"
                width="40"
                alt="img"
              />
              <div className="ml-3">
                <h5 className="mb-0 text-dark">Varun Dhavan</h5>
                <small className="text-success">Online</small>
              </div>
              <div className="ml-auto chat-icon">
                <Button
                  color="success"
                  className="btn btn-success btn-circle text-white"
                >
                  <i className="fas fa-phone"></i>
                </Button>
                <Button color="info" className="btn btn-info btn-circle ml-2">
                  <i className="far fa-comments"></i>
                </Button>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem tag="a" href="#" className="border-0 px-0 pb-0">
            <div className="d-flex align-items-center">
              <img
                src={user4}
                className="rounded-circle"
                width="40"
                alt="img"
              />
              <div className="ml-3">
                <h5 className="mb-0 text-dark">Varun Dhavan</h5>
                <small className="text-success">Online</small>
              </div>
              <div className="ml-auto chat-icon">
                <Button
                  color="success"
                  className="btn btn-success btn-circle text-white"
                >
                  <i className="fas fa-phone"></i>
                </Button>
                <Button color="info" className="btn btn-info btn-circle ml-2">
                  <i className="far fa-comments"></i>
                </Button>
              </div>
            </div>
          </ListGroupItem>
        </ListGroup>
      </div>
    </Card>
  );
};

export default ChatListing;
