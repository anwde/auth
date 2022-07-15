import React from "react";
import {
    Card,
    CardBody,
    CardTitle,
} from 'reactstrap';

import PerfectScrollbar from "react-perfect-scrollbar";

const Feeds = () => {
    return (
        <Card>
            <CardBody>
                <CardTitle className="text-uppercase">Feeds</CardTitle>
                <div className="feed-widget scrollable" style={{ height: "475px" }}>
                    <PerfectScrollbar>
                        <ul className="list-style-none feed-body m-0 pb-0">
                            <li className="feed-item py-2 font-weight-light">
                                <div className="feed-icon bg-info"><i className="far fa-bell"></i></div> You have 4 pending tasks. <span className="ml-auto font-12 text-muted">Just Now</span>
                            </li>
                            <li className="feed-item py-2 font-weight-light">
                                <div className="feed-icon bg-success"><i className="ti-server"></i></div> Server #1 overloaded.<span className="ml-auto font-12 text-muted">2 Hours ago</span>
                            </li>
                            <li className="feed-item py-2 font-weight-light">
                                <div className="feed-icon bg-warning"><i className="ti-shopping-cart"></i></div> New order received.<span className="ml-auto font-12 text-muted">31 May</span>
                            </li>
                            <li className="feed-item py-2 font-weight-light">
                                <div className="feed-icon bg-danger"><i className="ti-user"></i></div> New user registered.<span className="ml-auto font-12 text-muted">30 May</span>
                            </li>
                            <li className="feed-item py-2 font-weight-light">
                                <div className="feed-icon bg-dark"><i className="far fa-bell"></i></div> New Version just arrived. <span className="ml-auto font-12 text-muted">Just Now</span>
                            </li>
                            <li className="feed-item py-2 font-weight-light">
                                <div className="feed-icon bg-info"><i className="ti-server"></i></div> You have 4 pending tasks.<span className="ml-auto font-12 text-muted">2 Hours ago</span>
                            </li>
                            <li className="feed-item py-2 font-weight-light">
                                <div className="feed-icon bg-danger"><i className="ti-shopping-cart"></i></div> New user registered.<span className="ml-auto font-12 text-muted">31 May</span>
                            </li>
                            <li className="feed-item py-2 font-weight-light">
                                <div className="feed-icon bg-primary"><i className="ti-user"></i></div> New Version just arrived.<span className="ml-auto font-12 text-muted">30 May</span>
                            </li>
                            <li className="feed-item py-2 font-weight-light">
                                <div className="feed-icon bg-warning"><i className="far fa-bell"></i></div> You have 4 pending tasks. <span className="ml-auto font-12 text-muted">4 May</span>
                            </li>
                        </ul>
                    </PerfectScrollbar>

                </div>
            </CardBody>
        </Card>
    );
}

export default Feeds;
