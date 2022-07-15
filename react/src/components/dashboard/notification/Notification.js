import React from "react";
import { Card, CardSubtitle, CardTitle } from "reactstrap";

import * as data from "./Data";

import PerfectScrollbar from "react-perfect-scrollbar";

const Notification = () => {
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Wizard Page                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <div className="p-3">
        <div className="d-flex align-items-center mb-2">
          <div>
            <CardTitle className="text-uppercase">Notification</CardTitle>
            <CardSubtitle className="mb-0">Last 5 Days</CardSubtitle>
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
      <div className="mailbox bg-light" style={{ height: "406px" }}>
        <PerfectScrollbar>
          <div className="message-center notifications">
            {/*<!-- Message -->*/}
            {data.notifications.map((notification, index) => {
              return (
                <span className="message-item" key={index}>
                  <span
                    className={
                      "btn btn-lg btn-circle btn-" + notification.iconbg
                    }
                  >
                    <i className={notification.iconclass} />
                  </span>
                  <div className="mail-contnet">
                    <h5 className="message-title">{notification.title}</h5>
                    <span className="mail-desc">{notification.desc}</span>
                    <span className="time text-dark font-medium">
                      {notification.time}
                    </span>
                  </div>
                </span>
              );
            })}
          </div>
        </PerfectScrollbar>
      </div>
    </Card>
  );
};

export default Notification;
