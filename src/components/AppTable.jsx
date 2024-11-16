import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { toWords } from "number-to-words";

const AppTable = ({
  onAddTable,
  sendTableList,
  onEditTable,
  onUpdateTable,
  sendIsEditTableModalShow,
  sendEditTableInfo,
  onEditTableModalClose,
  onCancelAllOrders,
  onRemoveTable,
  onDeleteAllTables,
}) => {
  const [allTables, setAllTables] = useState([]);
  const [updateTableInfo, setUpdateTableInfo] = useState(null);
  const [updateTabletotalAmount, setUpdateTabletotalAmount] = useState(0);
  const formSubmitButtonHandler = () => {
    document.getElementById("hiddenFormSubmitButton").click();
  };
  const formSubmitHandler = (e) => {
    e.preventDefault();
    onUpdateTable(updateTableInfo);
  };
  const editTableCloseModalHandler = () => {
    onEditTableModalClose();
  };
  const cancelAllOrdersButtonHandler = (tableId) => {
    onCancelAllOrders(tableId);
  };
  const removeTableButtonHandler = (tableId) => {
    onRemoveTable(tableId);
  };
  const calculateEachTableTotalAmount = () => {
    let total = 0;
    if (
        updateTableInfo &&
      Array.isArray(updateTableInfo.orders) &&
      updateTableInfo.orders.length > 0
    ) {
      updateTableInfo.orders.forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.qty);
      });
    }
    return total.toFixed(2);
  };
  const calculateBusyTables = () => {
    let busyTables = {totalNo: 0, totalBills: 0};
    if (allTables.length > 0) {
        allTables.forEach((itemObj) => {
            busyTables.totalNo += (itemObj?.orders.length > 0) ? 1 : 0;
            busyTables.totalBills += parseFloat(itemObj?.bill);
        });
    }
    return busyTables;
  }

  const busyTables = calculateBusyTables();

  useEffect(() => {
    const newTotalAmount = calculateEachTableTotalAmount();
    setUpdateTabletotalAmount(newTotalAmount);
  }, [updateTableInfo]);
  useEffect(() => {
    setAllTables(sendTableList);
  }, [sendTableList]);
  useEffect(() => {
    setUpdateTableInfo(sendEditTableInfo);
  }, [sendEditTableInfo]);
  return (
    <>
      <Card>
        <Card.Header>
          <Row>
            <Col>
              <label>
                <strong>Tables</strong>
              </label>{" "}
              - ({allTables.length})
            </Col>
            <Col className="text-align-right">
              {allTables.length > 0 && (
                <Button variant="danger" onClick={onDeleteAllTables}>
                  <FiTrash2 className="button-icon" />
                </Button>
              )}

              <Button variant="primary" className="mx-2" onClick={onAddTable}>
                <FiPlus className="button-icon" />
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {allTables.length > 0 ? (
            <Row>
              {allTables.map((item, index) => {
                return (
                  <Col
                    md={4}
                    className="table-box text-center mb-2"
                    key={"table-box" + index}
                  >
                    <div className="table-box-items" style={{backgroundColor: item?.orders.length > 0 ? '#cfffc1' : '#e8e6e6'}}>
                      <div className="table-no">
                        <label>{item?.name || "Table- " + (index + 1)}</label>
                      </div>
                      <div className="mt-2">
                        <p className="table-order">
                          <label>Items-</label> {item?.orders.length || 0}
                        </p>
                        <p className="table-bill">
                          <label>Bill-</label> {item?.bill || 0}
                        </p>
                      </div>
                      <div className="row">
                        <div className="col text-start">
                          <FiEdit onClick={() => onEditTable(index, item.id)} />
                        </div>
                        <div className="col text-end">
                          <FiTrash2
                            onClick={() => removeTableButtonHandler(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <p>No Tables Found! Please Add Table</p>
          )}
        </Card.Body>
        <Card.Footer>
            <Row>
                <Col>
                <label><strong>Busy Table:</strong> - {busyTables?.totalNo || 0}</label>
                 &nbsp; | <label><strong>OnGoing Bill Amounts:</strong> - Rs.{Math.round(busyTables.totalBills) || 0}</label>
                </Col>
            </Row>
        </Card.Footer>
      </Card>
      {/* Edit Table Modal */}
      <Modal
        backdrop="static"
        keyboard={false}
        size="xl"
        show={sendIsEditTableModalShow}
        onHide={editTableCloseModalHandler}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiEdit style={{ marginTop: "-5px" }} /> Edit Table
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formSubmitHandler}>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3" controlId="tableId">
                  <Form.Control
                    type="text"
                    name="table_id"
                    placeholder="Table Id"
                    value={updateTableInfo?.id || ""}
                    required
                    disabled
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="tableNumber">
                  <Form.Control
                    type="number"
                    step="1"
                    name="table_no"
                    placeholder="Table Number"
                    required
                    value={updateTableInfo?.no || ""}
                    onChange={(e) =>
                      setUpdateTableInfo({
                        ...updateTableInfo,
                        no: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="tableName">
                  <label>
                    <strong>Table Name:</strong>
                  </label>
                  <Form.Control
                    type="text"
                    name="table_name"
                    placeholder="Table Name"
                    value={updateTableInfo?.name || ""}
                    onChange={(e) =>
                      setUpdateTableInfo({
                        ...updateTableInfo,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="tableCustomerName">
                  <label>
                    <strong>Customer Name:</strong>
                  </label>
                  <Form.Control
                    type="text"
                    name="table_customer_name"
                    placeholder="Customer Name"
                    value={updateTableInfo?.customerName || ""}
                    onChange={(e) =>
                      setUpdateTableInfo({
                        ...updateTableInfo,
                        customerName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="tableCustomerPhoneNumber"
                >
                  <label>
                    <strong>Customer Phone Number:</strong>
                  </label>
                  <Form.Control
                    type="number"
                    name="table_customer_phonenumber"
                    placeholder="Customer Mobile Number"
                    value={updateTableInfo?.customerPhoneNumber || ""}
                    onChange={(e) =>
                      setUpdateTableInfo({
                        ...updateTableInfo,
                        customerPhoneNumber: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={7} style={{ fontFamily: "monospace" }}>
                <Card>
                  <Card.Header>
                    <label>
                      <strong>Orders</strong>
                    </label>
                  </Card.Header>
                  <Card.Body>
                    <table className="table table-sm table-border table-striped table-hover">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Food</th>
                          <th>Price x QTY</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {updateTableInfo &&
                        updateTableInfo.orders &&
                        updateTableInfo.orders.length > 0 ? (
                          updateTableInfo.orders.map((item, index) => (
                            <tr key={`order-row-${index}`}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              <td>
                                {parseFloat(item.price).toFixed(2)} x{" "}
                                {parseFloat(item.qty).toFixed(2)}
                              </td>
                              <td>
                                {(
                                  parseFloat(item.price).toFixed(2) *
                                  parseFloat(item.qty).toFixed(2)
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">No Orders Found</td>
                          </tr>
                        )}
                      </tbody>
                      {updateTableInfo &&
                        updateTableInfo.orders &&
                        updateTableInfo.orders.length > 0 && (
                          <tfoot>
                            <tr>
                              <td colSpan={3}>
                                <strong>Total Bill:</strong>
                              </td>
                              <td>
                                <strong>{updateTabletotalAmount}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={3}>
                                <strong>Total Payable:</strong>
                              </td>
                              <td>
                                <strong>
                                  {Math.round(updateTabletotalAmount)}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4}>
                                <strong>In Words:</strong>{" "}
                                {toWords(updateTabletotalAmount)}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                    </table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Button
              type="submit"
              id="hiddenFormSubmitButton"
              variant="secondary"
              className="d-none"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="container-fluid">
            <div className="row w-100">
              <div className="col text-start" style={{ paddingLeft: "0px" }}>
                <Button variant="primary" onClick={formSubmitButtonHandler}>
                  Save Changes
                </Button>
              </div>
              <div className="col text-end" style={{ paddingRight: "0px" }}>
                <Button
                  variant="warning"
                  onClick={() =>
                    cancelAllOrdersButtonHandler(updateTableInfo?.id || "")
                  }
                >
                  Cancel All Orders
                </Button>
                <Button
                  variant="danger"
                  style={{ marginLeft: "5px" }}
                  onClick={() =>
                    removeTableButtonHandler(updateTableInfo?.id || "")
                  }
                >
                  Remove Table
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppTable;
