import React, { useState } from "react";
import {
  Card,
  CardBody,
  Form,
  Input,
  Row,
  Col,
  Button,
  CardTitle,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import Message from "./Message";

import user1 from "../../../assets/images/users/1.jpg";
import user2 from "../../../assets/images/users/2.jpg";

const Chat = (props) => {
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
    <Card>
      <div className="p-3 bg-info">
        <CardTitle className="text-white mb-0 text-uppercase">
          Recent Chats
        </CardTitle>
      </div>
      <CardBody>
        <div className="chat-box" style={{ height: "440px" }}>
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
      </CardBody>
    </Card>
  );
};
export default Chat;
