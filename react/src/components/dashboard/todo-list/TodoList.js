import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardSubtitle,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

const TodoList = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      content: "Schedule meeting with",
      completed: false,
      labelname: "Panding",
      labelcolor: "info",
      date: "05 Jan 2020",
    },
    {
      id: 2,
      content: "Give Purchase report to",
      completed: false,
      labelname: "Rejected",
      labelcolor: "danger",
      date: "19 Fab 2020",
    },
    {
      id: 3,
      content: "Book flight for holiday",
      completed: false,
      labelname: "Completed",
      labelcolor: "success",
      date: "16 Mar 2019",
    },
    {
      id: 4,
      content: "Forward all tasks",
      completed: false,
      labelname: "Panding",
      labelcolor: "info",
      date: "30 April 2018",
    },
    {
      id: 5,
      content: "Recieve shipment",
      completed: false,
      labelname: "Rejected",
      labelcolor: "danger",
      date: "05 Feb 2020",
    },
    {
      id: 6,
      content: "Send payment today",
      completed: false,
      labelname: "Panding",
      labelcolor: "info",
      date: "11 Dec 2020",
    },
    {
      id: 7,
      content: "Important tasks",
      completed: false,
      labelname: "Pending",
      labelcolor: "info",
      date: "12 Nov 2019",
    },
  ]);

  const toggleComplete = (todoId) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) todo.completed = !todo.completed;
        return todo;
      })
    );
  };

  const deleteTodo = (todoId) => {
    setTodos(todos.filter((todo) => todo.id !== todoId));
  };

  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-4 && widget Page                                             */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <div className="px-3 py-4 border-bottom">
        <CardSubtitle className="mb-0 text-dark">This Months Task</CardSubtitle>
        <h4 className="text-uppercase font-medium mb-0">To Do List</h4>
      </div>
      <CardBody className="pt-0">
        <div className="todo-widget">
          <ListGroup
            className="list-task todo-list list-group mb-0"
            data-role="tasklist"
          >
            {todos.map((todo) => (
              <ListGroupItem
                className={
                  "border-0 list-group-item todo-item align-items-start pr-0 " +
                  (todo.completed ? "completed" : "")
                }
                key={todo.id}
              >
                <div>
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      checked={todo.complete}
                      id={todo.id}
                      className="custom-control-input"
                      data-toggle="checkbox"
                      onClick={(todoId) => toggleComplete(todo.id)}
                    />
                    <label
                      className="custom-control-label todo-label mr-3"
                      htmlFor={todo.id}
                    >
                      <span className="todo-desc font-medium">
                        {todo.content}
                      </span>
                      <div
                        className={
                          "ml-2 badge rounded-pill badge-" + todo.labelcolor
                        }
                      >
                        {todo.labelname}
                      </div>
                    </label>
                  </div>
                  <span className="text-muted ml-3 pl-2">{todo.date}</span>
                </div>
                <div className="ml-auto">
                  <a
                    href="/"
                    className="link"
                    onClick={(todoId) => deleteTodo(todo.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </a>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </CardBody>
    </Card>
  );
};

export default TodoList;
