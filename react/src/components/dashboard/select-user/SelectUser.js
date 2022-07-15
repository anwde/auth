import React, { useState } from "react";

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  Row,
  Col,
  Input,
  Form,
  Button,
} from "reactstrap";
import classnames from "classnames";

import PerfectScrollbar from "react-perfect-scrollbar";
import Message from "./Message";
import * as data from "./TableData";

import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import user1 from "../../../assets/images/users/1.jpg";
import user2 from "../../../assets/images/users/2.jpg";

const SelectUser = () => {
  //This is for the Delete row
  function onAfterDeleteRow(rowKeys) {
    alert("The rowkey you drop: " + rowKeys);
  }

  //This is for the Search item
  function afterSearch(searchText, result) {
    console.log("Your search text is " + searchText);
    console.log("Result is:");
    for (let i = 0; i < result.length; i++) {
      console.log(
        "Fruit: " +
          result[i].id +
          ", " +
          result[i].name +
          ", " +
          result[i].price
      );
    }
  }
  const options = {
    //afterInsertRow: onAfterInsertRow,  // A hook for after insert rows
    afterDeleteRow: onAfterDeleteRow, // A hook for after droping rows.
    afterSearch: afterSearch, // define a after search hook
  };
  const selectRowProp = {
    mode: "checkbox",
  };
  const cellEditProp = {
    mode: "click",
    blurToSave: true,
  };

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  // chat
  const [chats, setChats] = useState([
    {
      username: "Genelia",
      content: "Hi, All!",
      img: user1,
      id: 1,
    },
    {
      username: "Alice Chen",
      content: "Hi, How are you Sonu? ur next concert?",
      img: user1,
      id: 2,
    },
    {
      username: "Genelia",
      content: "Hi, Sonu and Genelia,",
      img: user1,
      id: 3,
    },
    {
      username: "KevHs",
      content: "Hi, How are you Sonu? ur next concert?",
      img: user2,
      id: 4,
    },
    {
      username: "Genelia",
      content: "So",
      img: user1,
      id: 5,
    },
    {
      username: "Genelia",
      content:
        "Chilltime is going to be an app for you to view videos with friends",
      img: user1,
      id: 6,
    },
    {
      username: "Genelia",
      content: "You can sign-up now to try out our private beta!",
      img: user1,
      id: 7,
    },
    {
      username: "Alice Chen",
      content: "Definitely! Sounds great!",
      img: user1,
      id: 8,
    },
  ]);

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const message = e.target.value;
    setMessage(message);
  };

  const submitMessage = (e) => {
    e.preventDefault();
    setChats(
      [
        ...chats,
        {
          username: "Genelia",
          content: <span>{message}</span>,
          img: user2,
          id: chats.length + 1,
        },
      ],
      setMessage("")
    );
  };
  const username = "Genelia";
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody className="bg-info text-white p-0">
        <Nav tabs className="select-user-tabs">
          <NavItem>
            <NavLink
              className={
                "cursor-pointer " + classnames({ active: activeTab === "1" })
              }
              onClick={() => {
                toggle("1");
              }}
            >
              <span className="hidden-sm-up">
                <h4>
                  <i className="ti-user"></i>
                </h4>
              </span>
              <span className="d-none d-md-block text-uppercase">
                Select Users
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={
                "cursor-pointer " + classnames({ active: activeTab === "2" })
              }
              onClick={() => {
                toggle("2");
              }}
            >
              <span className="hidden-sm-up">
                <h4>
                  <i className="ti-lock"></i>
                </h4>
              </span>
              <span className="d-none d-md-block text-uppercase">
                Set Permissions
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={
                "cursor-pointer " + classnames({ active: activeTab === "3" })
              }
              onClick={() => {
                toggle("3");
              }}
            >
              <span className="hidden-sm-up">
                <h4>
                  <i className="ti-receipt"></i>
                </h4>
              </span>
              <span className="d-none d-md-block text-uppercase">
                Message Users
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={
                "cursor-pointer " + classnames({ active: activeTab === "4" })
              }
              onClick={() => {
                toggle("4");
              }}
            >
              <span className="hidden-sm-up">
                <h4>
                  <i className="ti-check-box"></i>
                </h4>
              </span>
              <span className="d-none d-md-block text-uppercase">
                Save and Finish
              </span>
            </NavLink>
          </NavItem>
        </Nav>
      </CardBody>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <Row className="py-4 mt-3">
                <Col md={12}>
                  <div className="px-3">
                    <h3 className="font-weight-light">
                      Search Users to Manage
                    </h3>
                  </div>
                </Col>
              </Row>
              <div
                className="bg-light px-3 py-4 position-relative"
                style={{ height: "470px" }}
              >
                <PerfectScrollbar>
                  <div className="overflow-hidden">
                    <BootstrapTable
                      striped
                      hover
                      condensed
                      search={true}
                      data={data.JsonData}
                      deleteRow={true}
                      selectRow={selectRowProp}
                      insertRow={true}
                      options={options}
                      cellEdit={cellEditProp}
                      tableHeaderClass="mb-0"
                    >
                      <TableHeaderColumn width="100" dataField="name" isKey>
                        Name
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataField="gender">
                        Gender
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataField="company">
                        Company
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </div>
                </PerfectScrollbar>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <h3 className="font-weight-light mb-0">Set Users Role</h3>
                </CardBody>
                <div
                  className="bg-light px-5 py-3 position-relative"
                  style={{ height: "374px" }}
                >
                  <form>
                    <div className="custom-control custom-radio py-3">
                      <Input
                        type="radio"
                        id="admin"
                        name="role"
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" htmlFor="admin">
                        Admin
                      </label>
                    </div>
                    <div className="custom-control custom-radio py-3">
                      <Input
                        type="radio"
                        id="subscriber"
                        name="role"
                        className="custom-control-input"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="subscriber"
                      >
                        Subscriber
                      </label>
                    </div>
                    <div className="custom-control custom-radio py-3">
                      <Input
                        type="radio"
                        id="support"
                        name="role"
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" htmlFor="support">
                        Support Manager
                      </label>
                    </div>
                  </form>
                </div>
                <div className="d-flex align-items-center p-4 mt-2">
                  <h3 className="font-weight-light">No roles assigned</h3>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <Row>
            <Col sm="12">
              <Card body>
                <div className="chat-box" style={{ height: "413px" }}>
                  <PerfectScrollbar>
                    <ul className="chat-list">
                      {chats.map((chat, index) => (
                        <Message key={index} chat={chat} user={username} />
                      ))}
                    </ul>
                  </PerfectScrollbar>
                </div>
                <div className="border-top pt-4">
                  <Form onSubmit={(e) => submitMessage(e)}>
                    <Row>
                      <Col xs="9">
                        <div className="input-field mt-0 mb-0">
                          <Input
                            type="text"
                            placeholder="Type and enter"
                            className="form-control border-0"
                            value={message}
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                      <Col xs="3">
                        <Button
                          className="btn btn-circle btn-lg btn-success float-right text-white"
                          type="submit"
                          value="submit"
                        >
                          <i className="fas fa-paper-plane"></i>
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="4">
          <Row>
            <Col sm="12">
              <Card className="mb-0">
                <CardBody>
                  <h3 className="font-weight-light mb-0">
                    Save and you are done
                  </h3>
                </CardBody>
                <div
                  className="bg-light d-flex align-items-center justify-content-center px-5 py-3 position-relative"
                  style={{ height: "493px" }}
                >
                  <Button color="success" size="lg" className="btn-rounded">
                    Save & Finish
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </Card>
  );
};

export default SelectUser;
