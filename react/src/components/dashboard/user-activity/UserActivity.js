import React from "react";
import { Card, CardTitle, Button } from "reactstrap";

import user2 from "../../../assets/images/users/2.jpg";
import user3 from "../../../assets/images/users/3.jpg";
import user4 from "../../../assets/images/users/4.jpg";
import img1 from "../../../assets/images/big/img1.jpg";
import img2 from "../../../assets/images/big/img2.jpg";
import img3 from "../../../assets/images/big/img3.jpg";

import PerfectScrollbar from "react-perfect-scrollbar";

const UserActivity = () => {
  return (
    <Card>
      <div className="p-3 bg-info">
        <CardTitle className="text-white mb-0 text-uppercase">
          User Activity
        </CardTitle>
      </div>
      <div
        className="p-3 scrollable overflow-hidden"
        style={{ height: "565px" }}
      >
        <PerfectScrollbar>
          <div className="steamline mt-0">
            <div className="sl-item">
              <div className="sl-left">
                <Button
                  color="success"
                  type="button"
                  className="btn-circle text-white"
                >
                  <i className="ti-user"></i>
                </Button>
              </div>
              <div className="sl-right overflow-hidden">
                <div>
                  <a href="/" className="link text-dark">
                    John Doe
                  </a>
                  <span className="sl-date ml-1">5 minutes ago</span>
                  <p className="mt-1 font-light">Contrary to popular belief</p>
                </div>
              </div>
            </div>
            <div className="sl-item">
              <div className="sl-left">
                <Button
                  type="button"
                  className="btn btn-info btn-circle btn-circle text-white"
                >
                  <i className="fas fa-image"></i>
                </Button>
              </div>
              <div className="sl-right overflow-hidden">
                <div>
                  <a href="/" className="link text-dark">
                    Hritik Roshan
                  </a>
                  <span className="sl-date ml-1">5 minutes ago</span>
                  <p className="mt-1 font-light">Lorem Ipsum is simply dummy</p>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <img src={img1} className="img-fluid" alt="img" />
                  </div>
                  <div className="col">
                    <img src={img2} className="img-fluid" alt="img" />
                  </div>
                  <div className="col">
                    <img src={img3} className="img-fluid" alt="img" />
                  </div>
                </div>
              </div>
            </div>
            <div className="sl-item">
              <div className="sl-left">
                <img src={user4} alt="user" className="rounded-circle" />
              </div>
              <div className="sl-right overflow-hidden">
                <div>
                  <a href="/" className="link text-dark">
                    Gohn Doe
                  </a>
                  <span className="sl-date ml-1">5 minutes ago</span>
                  <p className="mt-1 font-light">The standard chunk of ipsum</p>
                </div>
              </div>
            </div>
            <div className="sl-item">
              <div className="sl-left">
                <img src={user3} alt="user" className="rounded-circle" />
              </div>
              <div className="sl-right overflow-hidden">
                <div>
                  <a href="/" className="link text-dark">
                    Varun Dhavan
                  </a>
                  <span className="sl-date">5 minutes ago</span>
                  <p className="font-light">
                    Contrary to popular belief hi there..!
                  </p>
                </div>
              </div>
            </div>
            <div className="sl-item">
              <div className="sl-left">
                <img src={user2} alt="user" className="rounded-circle" />
              </div>
              <div className="sl-right overflow-hidden">
                <div>
                  <a href="/" className="link text-dark">
                    Tiger Sroff
                  </a>
                  <span className="sl-date ml-1">5 minutes ago</span>
                  <p className="mt-1 font-light">The generated lorem ipsum</p>
                  <Button color="success" outline className="btn-rounded">
                    Approve
                  </Button>
                  <Button color="danger" outline className="btn-rounded ml-2">
                    Refuse
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </Card>
  );
};

export default UserActivity;
