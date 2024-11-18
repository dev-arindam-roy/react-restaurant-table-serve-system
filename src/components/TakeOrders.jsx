import React, { useEffect, useState } from "react";
import SelectDropDown from "../utils/SelectDropDown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";
import { FiPlus, FiX } from "react-icons/fi";

const TakeOrders = ({
  sendTableList,
  sendFoodMenu,
  onAddFoodToTable,
  sendEditTableFoodMenu,
}) => {
  //onload
  const [foods, setFoods] = useState([]);
  const [tables, setTables] = useState([]);

  //add & edit
  const [addFoodMenu, setAddFoodMenu] = useState({ id: "", qty: "1" });
  const [addTable, setAddTable] = useState({ id: "" });

  //check edit
  const [isEdit, setIsEdit] = useState(false);

  const selectTableHandleChange = (selectedTableObj) => {
    setAddTable({ id: selectedTableObj.value });
  };

  const selectFoodMenuHandleChange = (selectedFoodMenuObj) => {
    setAddFoodMenu({ ...addFoodMenu, id: selectedFoodMenuObj.value });
  };

  //form submit
  const formSubmitHandler = (e) => {
    e.preventDefault();
    onAddFoodToTable(addTable, addFoodMenu, isEdit);
    setAddFoodMenu({ id: "", qty: "1" });
    if (isEdit) {
      setAddTable({ id: "" });
    }
    setIsEdit(false);
  };

  //reset form
  const resetFormHandler = () => {
    setAddFoodMenu({ id: "", qty: "1" });
    setAddTable({ id: "" });
    setIsEdit(false);
  };

  /** Load food list */
  useEffect(() => {
    const foodArr = [];
    sendFoodMenu.forEach((item) => {
      foodArr.push({ value: item.id, label: item.name });
    });
    setFoods(foodArr);
  }, [sendFoodMenu]);

  /** Load table list */
  useEffect(() => {
    const tableArr = [];
    sendTableList.forEach((item) => {
      tableArr.push({ value: item.id, label: item.name });
    });
    setTables(tableArr);
  }, [sendTableList]);

  /** In edit mode & view mode pre-select table and food */
  useEffect(() => {
    if (sendEditTableFoodMenu && sendEditTableFoodMenu?.action) {
      setAddTable({ id: sendEditTableFoodMenu?.tableId });
      if (sendEditTableFoodMenu.action === "edit") {
        setAddFoodMenu({
          id: sendEditTableFoodMenu?.foodMenuId,
          qty: sendEditTableFoodMenu?.qty,
        });
        setIsEdit(true);
      }
      if (sendEditTableFoodMenu.action === "view") {
        setAddFoodMenu({
          id: "",
          qty: 1,
        });
        setIsEdit(false);
      }
    }
  }, [sendEditTableFoodMenu]);
  return (
    <>
      <Card>
        <Card.Header>
          <strong>Take New Orders {isEdit && " - Edit Menu"}</strong>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formSubmitHandler}>
            <Row>
              <Col md={3}>
                <label>
                  <strong>Table:</strong>
                </label>
                <SelectDropDown
                  name="table"
                  options={tables}
                  placeholder="Select Table"
                  isSearchable
                  value={
                    tables.find((table) => table.value === addTable.id) || null
                  }
                  //defaultValue={selectTable?.id}
                  onChange={selectTableHandleChange}
                  noOptionsMessage={() => "No Table Found"}
                  isDisabled={isEdit}
                  isClearable
                  required
                />
              </Col>
              <Col md={4}>
                <label>
                  <strong>Food Menu:</strong>
                </label>
                <SelectDropDown
                  name="foodmenu"
                  options={foods}
                  placeholder="Select Menu"
                  isSearchable
                  value={
                    foods.find((food) => food.value === addFoodMenu.id) || null
                  }
                  //defaultValue={addFoodMenu?.id}
                  onChange={selectFoodMenuHandleChange}
                  noOptionsMessage={() => "No Food Found"}
                  isDisabled={isEdit}
                  isClearable
                  required
                />
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
