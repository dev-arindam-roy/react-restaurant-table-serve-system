import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FiLogIn } from "react-icons/fi";

const AppLogin = ({ sendAuthDetails, onDoLogin }) => {
  const [authDetails, setAuthDetails] = useState(null);
  const signInButtonHandler = () => {
    document.getElementById("signInFormHiddenSubmitBtn").click();
  };
  const signinFormHandler = (e) => {
    e.preventDefault();
    onDoLogin(authDetails);
  };
  useEffect(() => {
    setAuthDetails(sendAuthDetails);
  }, [sendAuthDetails]);
  return (
    <>
      <Modal
        backdrop="static"
        keyboard={false}
        show={authDetails?.isAuth}
        dialogClassName="blur-backdrop"
        centered
        scrollable
      >
        <Modal.Header>
          <Modal.Title>
            <FiLogIn className="icon-adjust-2" /> Sign-In
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={signinFormHandler}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="authName">
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
                <Form.Group className="mb-3" controlId="authUserName">
                  <Form.Control
                    type="text"
                    name="auth_username"
                    placeholder="Username"
                    value={authDetails?.user?.username}
                    required
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        user: { ...authDetails.user, username: e.target.value },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="authPassword">
                  <Form.Control
                    type="password"
                    name="auth_password"
                    placeholder="Password"
                    value={authDetails?.user?.password}
                    required
                    onChange={(e) =>
                      setAuthDetails({
                        ...authDetails,
                        user: { ...authDetails.user, password: e.target.value },
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              id="signInFormHiddenSubmitBtn"
              variant="secondary"
              className="d-none"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={signInButtonHandler}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppLogin;
