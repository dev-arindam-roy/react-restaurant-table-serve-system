import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { toWords } from "number-to-words";
import { formatNumberWord } from "../helpers/Helpers";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const TableBillItems = ({
  sendEachTableOrders,
  onCancelAllOrders,
  onFoodMenuItemDelete,
  onFoodMenuItemEdit,
  onGenerateBill,
}) => {
  const [eachTableOrders, setEachTableOrders] = useState(null);
  const [eachTableTotalBillAmount, setEachTableTotalBillAmount] = useState(0);
  // Calculate total amount based on the latest orders
  const calculateEachTableTotalAmount = (eachTableDetails) => {
    let total = 0;
    if (
      eachTableDetails &&
      Array.isArray(eachTableDetails.orders) &&
      eachTableDetails.orders.length > 0
    ) {
      eachTableDetails.orders.forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.qty);
      });
    }
    return total.toFixed(2);
  };

  useEffect(() => {
    //console.log(sendEachTableOrders);
    if (sendEachTableOrders) {
      setEachTableOrders(sendEachTableOrders);

      //Recalculate the total amount whenever sendEachTableOrders changes
      const newTotalAmount = calculateEachTableTotalAmount(sendEachTableOrders);
      setEachTableTotalBillAmount(newTotalAmount);
    }
  }, [sendEachTableOrders]);
  return (
    <>
      <Card>
        <Card.Header>
          <strong>
            Table - {eachTableOrders?.no}, Order Items - &nbsp;
            {eachTableOrders && eachTableOrders.orders
              ? eachTableOrders?.orders.length
              : 0}
          </strong>
        </Card.Header>
        <Card.Body>
          {eachTableOrders &&
          eachTableOrders.orders &&
          eachTableOrders?.orders.length > 0 ? (
            <table
              className="table table-sm table-striped table-hover"
              style={{ fontFamily: "monospace" }}
            >
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Menu Item</th>
                  <th>Price</th>
                  <th>QTY</th>
                  <th>Total</th>
                  <th style={{ width: "65px", textAlign: "right" }}>#</th>
                </tr>
              </thead>
              <tbody>
                {eachTableOrders &&
                  eachTableOrders?.orders &&
                  eachTableOrders?.orders.length > 0 &&
                  eachTableOrders.orders.map((item, index) => {
                    return (
                      <tr key={"table-order-item-" + index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.qty}</td>
                        <td>
                          {(
                            parseFloat(item.price) * parseFloat(item.qty)
                          ).toFixed(2)}
                        </td>
                        <td style={{ width: "65px", textAlign: "right" }}>
                          <FiEdit
                            className="icon-action-btn text-success"
                            onClick={() =>
                              onFoodMenuItemEdit(eachTableOrders.id, item.id)
                            }
                          />
                          <FiTrash2
                            className="icon-action-btn text-danger"
                            style={{ marginLeft: "8px" }}
                            onClick={() =>
                              onFoodMenuItemDelete(eachTableOrders.id, item.id)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4}>Total Bill Amount:</th>
                  <th colSpan={2}>{eachTableTotalBillAmount}</th>
                </tr>
                <tr>
                  <th colSpan={4}>Total Payable Amount:</th>
                  <th colSpan={2}>{Math.round(eachTableTotalBillAmount)}</th>
                </tr>
                <tr>
                  <th colSpan={6}>
                    In Words:{" "}
                    {formatNumberWord(toWords(eachTableTotalBillAmount))}
                  </th>
                </tr>
              </tfoot>
            </table>
          ) : (
            <p className="alert alert-danger">Table Not In Active State</p>
          )}
        </Card.Body>
        {eachTableOrders &&
          eachTableOrders.orders &&
          eachTableOrders?.orders.length > 0 && (
            <Card.Footer>
              <Row>
                <Col className="text-start">
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => onGenerateBill(eachTableOrders.id)}
                  >
                    Generate Bill
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => onCancelAllOrders(eachTableOrders.id)}
                  >
                    Calcell All Orders
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          )}
      </Card>
    </>
  );
};

export default TableBillItems;
