import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FiSettings, FiLogOut } from "react-icons/fi";

const AppSettings = ({
  sendAuthInfo,
  onAuthlogout,
  onAuthSettings,
  sendAuthSettingsModalState,
  onCloseSettingsModal,
  onSaveSettings,
}) => {
  const [authDetails, setAuthDetails] = useState(null);
  const submitTriggerButtonHandler = () => {
    document.getElementById("formHiddenSubmitBtn").click();
  };
  const formSubmitHandler = (e) => {
    e.preventDefault();
    onSaveSettings(authDetails);
  };
  useEffect(() => {
    setAuthDetails(sendAuthInfo);
  }, [sendAuthInfo]);
  return (
    <>
      <Row>
        <Col md={10} className="text-align-right">
          <label className="login-user">
            {authDetails?.user?.name && `Hello, ${authDetails.user.name}`}
          </label>
          <br />
          <span className="login-resturant">
            {authDetails?.restaurant?.name && `${authDetails.restaurant.name}`}
          </span>
        </Col>
        <Col md={2} className="text-align-right">
          <DropdownButton id="dropdown-basic-button" title={<FiSettings />}>
            <Dropdown.Item href="#/settings" onClick={onAuthSettings}>
              Settings
            </Dropdown.Item>
            <Dropdown.Item href="#/logout" onClick={onAuthlogout}>
              <FiLogOut className="icon-adjust-2" /> Logout
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      <Modal
        backdrop="static"
        keyboard={false}
        show={sendAuthSettingsModalState}
        onHide={onCloseSettingsModal}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiSettings style={{ marginTop: "-5px" }} /> Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formSubmitHandler}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="authName">
                  <label>
                    <strong>Your Name:</strong>
                  </label>
                  <Form.Control
                    type="text"
                    name="auth_name"
                    placeholder="Your Name"
                    value={authDetails?.user?.name}
                    required
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        user: { ...authDetails.user, name: e.target.value },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="restaurantName">
                  <label>
                    <strong>Restaurant Name:</strong>
                  </label>
                  <Form.Control
                    type="text"
                    name="auth_restaurant_name"
                    placeholder="Restaurant Name"
                    value={authDetails?.restaurant?.name}
                    required
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        restaurant: {
                          ...authDetails.restaurant,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="restaurantPhoneNumber">
                  <label>
                    <strong>Restaurant Phone Number:</strong>
                  </label>
                  <Form.Control
                    type="number"
                    name="auth_restaurant_phone_number"
                    placeholder="Restaurant Phone Number"
                    value={authDetails?.restaurant?.phoneNumber}
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        restaurant: {
                          ...authDetails.restaurant,
                          phoneNumber: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="restaurantEmailId">
                  <label>
                    <strong>Restaurant Email-Id:</strong>
                  </label>
                  <Form.Control
                    type="text"
                    name="auth_restaurant_email_id"
                    placeholder="Restaurant Email-Id"
                    value={authDetails?.restaurant?.email}
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        restaurant: {
                          ...authDetails.restaurant,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="restaurantAddress">
                  <label>
                    <strong>Restaurant Address:</strong>
                  </label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="auth_restaurant_address"
                    placeholder="Restaurant Address"
                    value={authDetails?.restaurant?.address}
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        restaurant: {
                          ...authDetails.restaurant,
                          address: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              id="formHiddenSubmitBtn"
              variant="secondary"
              className="d-none"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitTriggerButtonHandler}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppSettings;
