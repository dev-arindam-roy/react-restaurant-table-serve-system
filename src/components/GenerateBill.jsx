import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toWords } from "number-to-words";
import { formatNumberWord, getFormattedTime } from "../helpers/Helpers";
import { FiArchive } from "react-icons/fi";

const GenerateBill = ({
  sendGenerateTableBill,
  onCloseGenerateBillModal,
  onPaymentReceivedOrderClose,
  sendAuthDetails,
}) => {
  const [generateTableBill, setGenerateTableBill] = useState(null);
  const [totalTableBill, setTotalTableBill] = useState(0);
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
  const printRef = useRef();
  const printHandler = useReactToPrint({
    content: () => printRef.current,
  });
  const screenShotHandler = () => {
    htmlToImage
      .toPng(document.getElementById("printArea"))
      .then(function (dataUrl) {
        download(
          dataUrl,
          new Date().toISOString().replace(/[:.]/g, "-") + ".png"
        );
      });
  };
  useEffect(() => {
    if (sendGenerateTableBill) {
      setGenerateTableBill(sendGenerateTableBill);
      const totalAmount = calculateEachTableTotalAmount(sendGenerateTableBill);
      setTotalTableBill(totalAmount);
    } else {
      setGenerateTableBill(null);
    }
  }, [sendGenerateTableBill]);
  return (
    <>
      <Modal
        backdrop="static"
        keyboard={false}
        size="lg"
        show={generateTableBill !== null ? true : false}
        onHide={onCloseGenerateBillModal}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiArchive style={{ marginTop: "-5px" }} /> Bill -{" "}
            <label>
              <strong>Rs.{Math.round(totalTableBill)}</strong>
            </label>
            <span
              style={{ fontSize: "14px", marginLeft: "10px", color: "#b3b3b3" }}
            >
              Table - {generateTableBill?.no}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body ref={printRef} id="printArea">
          <Card>
            <Card.Header style={{ paddingTop: "20px" }}>
              <Row>
                <Col
                  md={
                    generateTableBill?.customerName &&
                    generateTableBill.customerName !== ""
                      ? "7"
                      : "12"
                  }
                  style={{
                    textAlign: "center",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {sendAuthDetails?.restaurant && (
                    <p>
                      <label style={{ fontSize: "20px" }}>
                        <strong>{sendAuthDetails.restaurant.name}</strong>
                      </label>
                      {sendAuthDetails?.restaurant?.phoneNumber && (
                        <>
                          <br />
                          <label style={{ fontSize: "14px" }}>
                            <strong>Phone Number: </strong>
                            {sendAuthDetails.restaurant.phoneNumber}
                          </label>
                          <label
                            style={{ marginLeft: "15px", fontSize: "14px" }}
                          >
                            <strong>Email: </strong>
                            {sendAuthDetails.restaurant.email}
                          </label>
                        </>
                      )}
                      {sendAuthDetails?.restaurant?.address && (
                        <>
                          <br />
                          <label style={{ fontSize: "14px" }}>
                            <strong>Address: </strong>
                            {sendAuthDetails.restaurant.address}
                          </label>
                        </>
                      )}
                    </p>
                  )}
                </Col>
                <Col
                  md={5}
                  style={{ textAlign: "right" }}
                  className={
                    generateTableBill?.customerName &&
                    generateTableBill.customerName !== ""
                      ? "d-block"
                      : "d-none"
                  }
                >
                  <p style={{ fontSize: "14px" }}>
                    <label>
                      <strong>Customer Name:</strong>{" "}
                      {generateTableBill?.customerName}
                    </label>
                    <br />
                    <label>
                      <strong>Contact Number:</strong>{" "}
                      {generateTableBill?.customerPhoneNumber}
                    </label>
                    <br />
                    <label>
                      <strong>Table Booking:</strong>{" "}
                      {new Date(generateTableBill?.bookDate).toLocaleDateString(
                        "en-GB"
                      )}{" "}
                      {new Date(generateTableBill?.bookTime).toLocaleTimeString(
                        "en-US",
                        { hour: "numeric", minute: "2-digit", hour12: true }
                      )}
                    </label>
                  </p>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body style={{ fontFamily: "monospace" }}>
              <table className="table table-sm table-border table-striped table-hover">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Food</th>
                    <th>Price</th>
                    <th>QTY</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {generateTableBill &&
                  generateTableBill.orders &&
                  generateTableBill.orders.length > 0 ? (
                    generateTableBill.orders.map((item, index) => (
                      <tr key={`order-row-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{parseFloat(item.price).toFixed(2)}</td>
                        <td>{parseFloat(item.qty).toFixed(2)}</td>
                        <td style={{ textAlign: "right" }}>
                          {(
                            parseFloat(item.price).toFixed(2) *
                            parseFloat(item.qty).toFixed(2)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No Orders Found</td>
                    </tr>
                  )}
                </tbody>
                {generateTableBill &&
                  generateTableBill.orders &&
                  generateTableBill.orders.length > 0 && (
                    <tfoot>
                      <tr>
                        <td colSpan={4}>
                          <strong>Total Bill:</strong>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <strong>{totalTableBill}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4}>
                          <strong>Total Payable:</strong>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <strong>{Math.round(totalTableBill)}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5}>
                          <strong>In Words:</strong>{" "}
                          {formatNumberWord(toWords(totalTableBill))}
                        </td>
                      </tr>
                    </tfoot>
                  )}
              </table>
            </Card.Body>
            <Card.Footer style={{ paddingBottom: "20px" }}>
              <Row>
                <Col
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#ccc",
                  }}
                >
                  {new Date(getFormattedTime())
                    .toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                      hour12: true,
                    })
                    .replace(",", "")
                    .toLocaleUpperCase()}
                </Col>
                <Col
                  className="text-align-right"
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#ccc",
                    fontStyle: "oblique",
                  }}
                >
                  Thanks! Have a Nice Day. We are glad to serve you.
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <div className="container-fluid">
            <div className="row">
              <div className="col text-start" style={{ paddingLeft: "0px" }}>
                <Button type="button" variant="primary" onClick={printHandler}>
                  Take Print
                </Button>
                <Button
                  type="button"
                  variant="warning"
                  style={{ marginLeft: "6px" }}
                  onClick={screenShotHandler}
                >
                  Take Screenshot
                </Button>
              </div>
              <div className="col text-end" style={{ paddingRight: "0px" }}>
                <Button
                  type="button"
                  variant="success"
                  onClick={() =>
                    onPaymentReceivedOrderClose(generateTableBill.id)
                  }
                >
                  Payment Received & Order Close
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GenerateBill;
