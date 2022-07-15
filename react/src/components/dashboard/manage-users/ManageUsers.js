import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "react-table-v6/react-table.css";
import * as data from "./ManageUserData";
import ReactTable from "react-table-v6";

const ManageUsers = () => {
  const [modal, setModal] = useState(false);
  const [obj, setObj] = useState({});
  const [jsonData, setJsonData] = useState(data.dataTable);

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let id = event.target.id.value;
    let name = event.target.name.value;
    let designation = event.target.designation.value;
    let location = event.target.location.value;
    let age = event.target.age.value;
    let newObj = JSON.parse(JSON.stringify(jsonData));
    newObj[id] = [name, designation, location, age];
    setJsonData(newObj);
    setModal(!modal);
  };

  const data2 = jsonData.map((prop, key) => {
    return {
      id: key,
      name: prop[0],
      designation: prop[1],
      location: prop[2],
      age: prop[3],
      actions: (
        // we've added some custom button actions
        <div className="text-center">
          {/* use this button to add a edit kind of action */}
          <Button
            onClick={() => {
              let obj = data2.find((o) => o.id === key);
              setModal(!modal);
              setObj(obj);
            }}
            color="info"
            outline
            size="sm"
            round="true"
            icon="true"
            className="btn-circle"
          >
            <i className="ti-pencil-alt" />
          </Button>
        </div>
      ),
    };
  });
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-1                                                            */
    /*--------------------------------------------------------------------------------*/
    <Card>
      <CardBody>
        <CardTitle className="text-uppercase mb-3 pb-1">Manage Users</CardTitle>
        <Modal isOpen={modal} toggle={toggle.bind(null)}>
          <ModalHeader toggle={toggle.bind(null)}>Modal title</ModalHeader>
          <ModalBody>
            <Form onSubmit={(event) => handleSubmit(event)}>
              <Input type="hidden" name="id" id="id" defaultValue={obj.id} />
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={obj.name}
                />
              </FormGroup>
              <FormGroup>
                <Label for="designation">Designation</Label>
                <Input
                  type="text"
                  name="designation"
                  id="designation"
                  defaultValue={obj.designation}
                />
              </FormGroup>
              <FormGroup>
                <Label for="location">Location</Label>
                <Input
                  type="text"
                  name="location"
                  id="location"
                  defaultValue={obj.location}
                />
              </FormGroup>
              <FormGroup>
                <Label for="age">Age</Label>
                <Input type="text" name="age" id="age" defaultValue={obj.age} />
              </FormGroup>
              <FormGroup>
                <Button color="primary" type="submit">
                  Save
                </Button>
                <Button
                  color="secondary"
                  className="ml-1"
                  onClick={toggle.bind(null)}
                >
                  Cancel
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
        <ReactTable
          columns={[
            {
              Header: "FirstName",
              accessor: "name",
            },
            {
              Header: "Designation",
              accessor: "designation",
            },
            {
              Header: "Location",
              accessor: "location",
            },
            {
              Header: "Age",
              accessor: "age",
            },
            {
              Header: "Actions",
              accessor: "actions",
              sortable: false,
              filterable: false,
            },
          ]}
          defaultPageSize={8}
          showPaginationBottom={true}
          className="-striped -highlight"
          data={data2}
          filterable
        />
      </CardBody>
    </Card>
  );
};

export default ManageUsers;
