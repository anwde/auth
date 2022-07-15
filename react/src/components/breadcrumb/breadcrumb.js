import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
class Breadcrumb extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    /**
     * props 有变化
     */
    UNSAFE_componentWillReceiveProps(props) {
        this.props = props;
    }
    render() {
        const data = this.props.server.breadcrumb||{};
        // console.log(data)
        return (
            <>
                {data.title ? (
                    <div
                        id="breadcrumb"
                        className="page-breadcrumb border-bottom"
                    >
                        <div className="row">
                            <div className="col-lg-3 col-md-4 col-xs-12 align-self-center">
                                <h5 className="font-medium text-uppercase mb-0">
                                    {data.title}
                                </h5>
                            </div>
                            <div className="col-lg-9 col-md-8 col-xs-12 align-self-center">
                                {data.buttons.map((val, key) => {
                                    //d-none 
                                    return (
                                        <Link
                                            className="btn btn-danger text-white float-right ml-3 d-md-block"
                                            onClick={val.onClick}
                                            key={key}
                                            to={val.url?val.url:'#!'}
                                        >
                                            {val.title}
                                        </Link>
                                    );
                                })}
                                <nav
                                    aria-label="breadcrumb"
                                    className="mt-2 float-md-right float-left"
                                >
                                    <ol className="breadcrumb mb-0 justify-content-end p-0">
                                        {data.lists.map((val, key) => {
                                            return (
                                                <li
                                                    className="breadcrumb-item"
                                                    key={key}
                                                >
                                                    <Link to={val.url}>
                                                        {val.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </>
        );
    }
}
export default connect((store) => ({ ...store }))(Breadcrumb);
