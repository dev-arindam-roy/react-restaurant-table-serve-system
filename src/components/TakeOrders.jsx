import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";
import { FiPlus, FiX } from "react-icons/fi";

const TakeOrders = ({ sendTableList, sendFoodMenu, onAddFoodToTable }) => {
  const [foods, setFoods] = useState([]);
  const [tables, setTables] = useState([]);
  const [addFoodMenu, setAddFoodMenu] = useState({ id: "", qty: "1" });
  const [selectTable, setSelectTable] = useState({ id: "" });

  const formSubmitHandler = (e) => {
    e.preventDefault();
    onAddFoodToTable(selectTable, addFoodMenu);
    setAddFoodMenu({ id: "", qty: "1" });
  };
  const resetFormHandler = () => {
    setAddFoodMenu({ id: "", qty: "1" });
    setSelectTable({ id: "" });
  };
  useEffect(() => {
    setFoods(sendFoodMenu);
  }, [sendFoodMenu]);
  useEffect(() => {
    setTables(sendTableList);
  }, [sendTableList]);
  return (
    <>
      <Card>
        <Card.Header>
          <strong>Take New Orders</strong>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formSubmitHandler}>
            <Row>
              <Col md={3}>
                <label>
                  <strong>Table:</strong>
                </label>
                <select
                  className="form-control"
                  required
                  value={selectTable.id}
                  onChange={(e) =>
                    setSelectTable({ ...selectTable, id: e.target.value })
                  }
                >
                  <option value="">-Select Table-</option>
                  {tables.length > 0 &&
                    tables.map((item, index) => {
                      return (
                        <option key={"table-option-" + index} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </Col>
              <Col md={4}>
                <label>
                  <strong>Food Menu:</strong>
                </label>
                <select
                  className="form-control"
                  required
                  value={addFoodMenu.id}
                  onChange={(e) =>
                    setAddFoodMenu({ ...addFoodMenu, id: e.target.value })
                  }
                >
                  <option value="">-Select Food-</option>
                  {foods.length > 0 &&
                    foods.map((item, index) => {
                      return (
                        <option
                          key={"foodmenu-option-" + index}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </Col>
              <Col md={2}>
                <label>
                  <strong>QTY:</strong>
                </label>
                <input
                  type="number"
                  min=".5"
                  step=".5"
                  className="form-control"
                  required
                  value={addFoodMenu.qty}
                  onChange={(e) =>
                    setAddFoodMenu({ ...addFoodMenu, qty: e.target.value })
                  }
                />
              </Col>
              <Col md={3} className="text-align-right">
                <Button
                  type="submit"
                  variant="primary"
                  style={{ marginTop: "22px" }}
                >
                  <FiPlus className="button-icon" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="mx-1"
                  style={{ marginTop: "22px" }}
                  onClick={resetFormHandler}
                >
                  <FiX className="button-icon" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
    </>
  );
};

export default TakeOrders;
