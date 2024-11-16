import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { toWords } from "number-to-words";

const TableBillItems = ({ sendEachTableOrders, onCancelAllOrders }) => {
  const [eachTableOrders, setEachTableOrders] = useState(null);
  const [eachTableTotalBillAmount, setEachTableTotalBillAmount] = useState(0);
  const calculateEachTableTotalAmount = () => {
    let total = 0;
    if (
      eachTableOrders &&
      Array.isArray(eachTableOrders.orders) &&
      eachTableOrders.orders.length > 0
    ) {
      eachTableOrders.orders.forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.qty);
      });
    }
    return total.toFixed(2);
  };
  useEffect(() => {
    const newTotalAmount = calculateEachTableTotalAmount();
    setEachTableTotalBillAmount(newTotalAmount);
  }, [eachTableOrders]);
  useEffect(() => {
    setEachTableOrders(sendEachTableOrders);
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
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4}>Total Bill Amount:</th>
                  <th>{eachTableTotalBillAmount}</th>
                </tr>
                <tr>
                  <th colSpan={4}>Total Payable Amount:</th>
                  <th>{Math.round(eachTableTotalBillAmount)}</th>
                </tr>
                <tr>
                  <th colSpan={5}>
                    In Words: {toWords(eachTableTotalBillAmount)}
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
                  <Button type="button" variant="success">
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
