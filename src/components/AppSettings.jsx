import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FiSettings } from "react-icons/fi";

const AppSettings = () => {
  return (
    <>
      <Row>
        <Col md={10} className="text-align-right">
          <label className="login-user">Hello, Arindam</label>
          <br />
          <span className="login-resturant">Onex Resturant & Bar</span>
        </Col>
        <Col md={2} className="text-align-right">
          <DropdownButton id="dropdown-basic-button" title={<FiSettings />}>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
    </>
  );
};

export default AppSettings;
