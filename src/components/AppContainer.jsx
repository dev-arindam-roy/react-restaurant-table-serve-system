import React, { useEffect, useState } from "react";
import FoodMenu from "../jsons/food_menu.json";
import AppHeading from "./AppHeading";
import AppSettings from "./AppSettings";
import AppTable from "./AppTable";
import TableBillItems from "./TableBillItems";
import AllBills from "./AllBills";
import TakeOrders from "./TakeOrders";
import { v4 as uuidv4 } from "uuid";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./App.css";

const lsKey = process.env.REACT_APP_LOCAL_STORAGE_KEY;

const AppContainer = () => {
  const [table, setTable] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [tableEditIndex, setTableEditIndex] = useState(null);

  const [foodMenuList, setFoodMenuList] = useState([]);

  const emitOnAddTableHandler = () => {
    let createTable = {
      id: uuidv4(),
      no: tableList.length + 1,
      name: "Table- " + (tableList.length + 1),
      customerName: "",
      customerPhoneNumber: "",
      bookDate: "",
      bookTime: "",
      orders: [],
      bill: 0,
    };
    setTable(createTable);
    const updatedTableList = [...tableList, createTable];
    setTableList(updatedTableList);
    saveTableInfoInLocalStorage(updatedTableList);
    Swal.fire({
      title: "Please wait...",
      html: "System is <strong>processing</strong> your request",
      timer: 2000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      Swal.close();
      toast.success("A new table created successfully!");
    });
  };

  const emitOnEditTableHandler = (keyIndex, tableId) => {
    setTableEditIndex(keyIndex);
    let editTableInfo = tableList.find(
      (item) => item.id.toLowerCase() === tableId.toLowerCase()
    );
    setTable(editTableInfo);
  };

  const emitOnUpdateTableHandler = (updatedTableInfo) => {
    let getUpdatedTableIndex = tableList.findIndex(
      (item) => item.id === updatedTableInfo.id
    );
    if (getUpdatedTableIndex !== -1) {
      tableList[getUpdatedTableIndex] = updatedTableInfo;
      emitOnEditTableModalCloseHandler();
      saveTableInfoInLocalStorage(tableList);
      Swal.fire({
        title: "Please wait...",
        html: "System is <strong>processing</strong> your request",
        timer: 2000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        Swal.close();
        toast.success("Table info updated successfully!");
      });
    } else {
      //error handling
    }
  };

  const emitOnCancelAllOrdersHandler = (tableId) => {
    if (tableId !== "" && tableId !== null) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to cancel all the orders for this table?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let getTableIndex = tableList.findIndex(
            (item) => item.id === tableId
          );
          if (getTableIndex !== -1) {
            tableList[getTableIndex].orders = [];
            tableList[getTableIndex].bill = 0;
            emitOnEditTableModalCloseHandler();
            saveTableInfoInLocalStorage(tableList);
            Swal.fire({
              title: "Please wait...",
              html: "System is <strong>processing</strong> your request",
              timer: 2000,
              timerProgressBar: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
              didOpen: () => {
                Swal.showLoading();
              },
            }).then(() => {
              Swal.close();
              toast.success("All orders are cancelled successfully!");
            });
          } else {
            toast.error("Oops!! Something went wrong!");
          }
        }
      });
    } else {
      //error handling
    }
  };

  const emitOnRemoveTableHandler = (tableId) => {
    if (tableId !== "" && tableId !== null) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this table?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let getTableIndex = tableList.findIndex(
            (item) => item.id === tableId
          );
          if (getTableIndex !== -1) {
            tableList[getTableIndex].orders = [];
            const updatedTableList = tableList.filter(
              (_, index) => index !== getTableIndex
            );
            setTableList(updatedTableList);
            emitOnEditTableModalCloseHandler();
            saveTableInfoInLocalStorage(updatedTableList);
            Swal.fire({
              title: "Please wait...",
              html: "System is <strong>processing</strong> your request",
              timer: 2000,
              timerProgressBar: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
              didOpen: () => {
                Swal.showLoading();
              },
            }).then(() => {
              Swal.close();
              toast.success("Table is removed successfully!");
            });
          } else {
            toast.error("Oops!! Something went wrong!");
          }
        }
      });
    } else {
      //error handling
    }
  };

  const emitOnDeleteAllTablesHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete all the tables?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setTableList([]);
        emitOnEditTableModalCloseHandler();
        saveTableInfoInLocalStorage([]);
        Swal.fire({
          title: "Please wait...",
          html: "System is <strong>processing</strong> your request",
          timer: 2000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          Swal.close();
          toast.success("All tables are removed successfully!");
        });
      }
    });
  };

  const emitOnEditTableModalCloseHandler = () => {
    setTableEditIndex(null);
    setTable(null);
  };

  const emitOnAddFoodToTableHandler = (table, food) => {
    if (
        table.id !== "" &&
        table.id !== null &&
        food.id !== "" &&
        food.id !== null
    ) {
      let getTableIndex = tableList.findIndex((item) => item.id === table.id);
      let getFoodMenuIndex = foodMenuList.findIndex((item) => item.id === parseInt(food.id));
      if (getTableIndex !== -1 && getFoodMenuIndex !== -1) {
        let getFood = foodMenuList[getFoodMenuIndex];
        let getTable = tableList[getTableIndex];
        let tempTableList = [...tableList];
        let tempTableOrders = tempTableList[getTableIndex].orders;
        let getExistingFoodMenuIndex = tempTableOrders.findIndex((item) => item.id === parseInt(food.id));
        if (getExistingFoodMenuIndex !== -1) {
            tempTableOrders[getExistingFoodMenuIndex].qty = parseFloat(tempTableOrders[getExistingFoodMenuIndex].qty) + parseFloat(food.qty);
        } else {
            tempTableOrders = [...tempTableOrders, {...getFood, qty: food.qty}];
        }
        tempTableList[getTableIndex].orders = tempTableOrders;
        tempTableList[getTableIndex].bill = calculateEachTableBill(tempTableList[getTableIndex].orders);
        setTableList(tempTableList);
        saveTableInfoInLocalStorage(tempTableList);
        Swal.fire({
            title: "Please wait...",
            html: "System is <strong>processing</strong> your request",
            timer: 2000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          }).then(() => {
            Swal.close();
            toast.success(`Table- ${getTable.no}, Order received successfully!`);
          });
      } else {
        toast.error("Oops!! Something went wrong1!");
      }
    } else {
      toast.error("Oops!! Something went wrong2!");
    }
  };

  const calculateEachTableBill = (eachTableOrders) => {
    let total = 0;
    if (Array.isArray(eachTableOrders) && eachTableOrders.length > 0) {
        eachTableOrders.forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.qty);
      });
    }
    return total.toFixed(2);
  }

  const saveTableInfoInLocalStorage = (tableInfo) => {
    localStorage.setItem(lsKey + "_tables_", JSON.stringify(tableInfo));
  };

  useEffect(() => {
    const loadTables = localStorage.getItem(lsKey + "_tables_");
    if (loadTables) {
      setTableList(JSON.parse(loadTables));
    }
  }, []);

  useEffect(() => {
    setFoodMenuList(FoodMenu);
  }, []);

  return (
    <>
      <Container fluid="xl" className="mt-3">
        <Row>
          <Col xs={12} sm={12} md={6} xl={6}>
            <AppHeading />
          </Col>
          <Col xs={12} sm={12} md={6} xl={6}>
            <AppSettings />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col xs={12} sm={12} md={7} xl={7}>
            <Row>
              <Col>
                <TakeOrders
                  sendTableList={tableList}
                  sendFoodMenu={foodMenuList}
                  onAddFoodToTable={emitOnAddFoodToTableHandler}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <TableBillItems />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <AllBills />
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={12} md={5} xl={5}>
            <AppTable
              onAddTable={emitOnAddTableHandler}
              onEditTable={emitOnEditTableHandler}
              sendTableList={tableList}
              sendIsEditTableModalShow={tableEditIndex !== null ? true : false}
              sendEditTableInfo={table}
              onUpdateTable={emitOnUpdateTableHandler}
              onEditTableModalClose={emitOnEditTableModalCloseHandler}
              onCancelAllOrders={emitOnCancelAllOrdersHandler}
              onRemoveTable={emitOnRemoveTableHandler}
              onDeleteAllTables={emitOnDeleteAllTablesHandler}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AppContainer;
