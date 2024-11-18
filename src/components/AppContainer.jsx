import React, { useEffect, useState } from "react";
import FoodMenu from "../jsons/food_menu.json";
import AppHeading from "./AppHeading";
import AppSettings from "./AppSettings";
import AppTable from "./AppTable";
import TableBillItems from "./TableBillItems";
import AllBills from "./AllBills";
import TakeOrders from "./TakeOrders";
import GenerateBill from "./GenerateBill";
import AppLogin from "./AppLogin";
import { v4 as uuidv4 } from "uuid";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getFormattedDate, getFormattedTime } from '../helpers/Helpers';
import "./App.css";

const lsKey = process.env.REACT_APP_LOCAL_STORAGE_KEY;

const authDetails = {
  user: {
    name: "",
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
  },
  restaurant: {
    name: "",
    phoneNumber: "",
    emailId: "",
    address: "",
  },
  isAuth: true,
};

const resetAuthDetails = {
  user: {
    name: "",
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
  },
  restaurant: {
    name: "",
    phoneNumber: "",
    emailId: "",
    address: "",
  },
  isAuth: true,
};

const AppContainer = () => {
  const [authInfo, setAuthInfo] = useState(authDetails);
  const [isAuthSettingsModalShow, setIsAuthSettingsModalShow] = useState(false);

  const [table, setTable] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [tableEditIndex, setTableEditIndex] = useState(null);

  const [foodMenuList, setFoodMenuList] = useState([]);

  const [eachTableOrdersInfo, setEachTableOrdersInfo] = useState(null);

  const [editTableFoodMenu, setEditTableFoodMenu] = useState(null);

  const [generateTableBill, setGenerateTableBill] = useState(null);

  const checkAuth = () => {
    const getAuthInfo = localStorage.getItem(lsKey + "_auth_info_") || null;
    if (getAuthInfo) {
      setAuthInfo(JSON.parse(getAuthInfo));
    } else {
      setAuthInfo(resetAuthDetails);
    }
  };

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
            setEachTableOrdersInfo(null);
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
            setEachTableOrdersInfo(null);
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
        setEachTableOrdersInfo(null);
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
    //setEachTableOrdersInfo(null);
  };

  const emitOnAddFoodToTableHandler = (table, food, isEditFood = false) => {
    if (
      table.id !== "" &&
      table.id !== null &&
      food.id !== "" &&
      food.id !== null
    ) {
      const getTableIndex = tableList.findIndex((item) => item.id === table.id);
      const getFoodMenuIndex = foodMenuList.findIndex(
        (item) => item.id === parseInt(food.id)
      );

      if (getTableIndex !== -1 && getFoodMenuIndex !== -1) {
        const getFood = foodMenuList[getFoodMenuIndex];
        const getTable = tableList[getTableIndex];

        // Create a deep copy of tableList and the relevant nested objects
        const tempTableList = tableList.map((table) => ({
          ...table,
          orders: [...table.orders], // Copy orders array for each table
        }));

        let tempTableOrders = tempTableList[getTableIndex].orders;
        const getExistingFoodMenuIndex = tempTableOrders.findIndex(
          (item) => item.id === parseInt(food.id)
        );

        if (getExistingFoodMenuIndex !== -1) {
          if (isEditFood) {
            tempTableOrders[getExistingFoodMenuIndex].qty = parseFloat(
              food.qty
            );
          } else {
            tempTableOrders[getExistingFoodMenuIndex].qty =
              parseFloat(tempTableOrders[getExistingFoodMenuIndex].qty) +
              parseFloat(food.qty);
          }
        } else {
          tempTableOrders.push({ ...getFood, qty: food.qty });
          tempTableList[getTableIndex].bookDate = getFormattedDate();
          tempTableList[getTableIndex].bookTime = getFormattedTime();
        }

        tempTableList[getTableIndex].orders = tempTableOrders;
        tempTableList[getTableIndex].bill = calculateEachTableBill(
          tempTableList[getTableIndex].orders
        );

        // Uncomment these lines to explicitly update state
        setEachTableOrdersInfo(tempTableList[getTableIndex]);
        setTableList(tempTableList);
        saveTableInfoInLocalStorage(tempTableList);
        console.log("TABLE");
        console.log(tableList);

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
          // Uncomment this for success notification
          toast.success(`Table - ${getTable.no}, Order received successfully!`);
        });
      } else {
        toast.error("Oops!! Something went wrong!");
      }
    } else {
      toast.error("Oops!! Something went wrong!");
    }
  };

  const emitOnFoodMenuItemDeleteHandler = (orderTableId, orderFoodMenuId) => {
    if (orderTableId && orderFoodMenuId) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this menu?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          const getTableIndex = tableList.findIndex(
            (item) => item.id === orderTableId
          );

          if (getTableIndex !== -1) {
            // Create a deep copy of tableList and the relevant nested objects
            const tempTableList = tableList.map((table) => ({
              ...table,
              orders: [...table.orders], // Deep copy of orders array
            }));

            // Get the specific table and update its orders
            const getTable = tempTableList[getTableIndex];
            const updatedTableOrderList = getTable.orders.filter(
              (food) => food.id !== orderFoodMenuId
            );

            // Update the orders and recalculate the bill for the specific table
            tempTableList[getTableIndex].orders = updatedTableOrderList;
            tempTableList[getTableIndex].bill = calculateEachTableBill(
              updatedTableOrderList
            );

            // Update the state with the new table list and table info
            setEachTableOrdersInfo(tempTableList[getTableIndex]);
            setTableList(tempTableList);
            saveTableInfoInLocalStorage(tempTableList);
          } else {
            toast.error("Oops!! Something went wrong!");
          }
        }
      });
    } else {
      toast.error("Oops!! Something went wrong!");
    }
  };

  const emitOnFoodMenuItemEditHandler = (orderTableId, orderFoodMenuId) => {
    if (orderTableId && orderFoodMenuId) {
      const getTableIndex = tableList.findIndex(
        (item) => item.id === orderTableId
      );
      if (getTableIndex !== -1) {
        // Create a deep copy of tableList and the relevant nested objects
        const tempTableList = tableList.map((table) => ({
          ...table,
          orders: [...table.orders], // Deep copy of orders array
        }));
        const getTable = tempTableList[getTableIndex];
        const getFoodItem = getTable?.orders.find(
          (item) => item.id === orderFoodMenuId
        );
        if (getFoodItem) {
          setEditTableFoodMenu({
            tableId: getTable.id,
            foodMenuId: orderFoodMenuId,
            qty: getFoodItem?.qty,
            action: "edit",
          });
        } else {
          toast.error("Oops!! Something went wrong!");
        }
      } else {
        toast.error("Oops!! Something went wrong!");
      }
    } else {
      toast.error("Oops!! Something went wrong!");
    }
  };

  const calculateEachTableBill = (eachTableOrders) => {
    let total = 0;
    if (Array.isArray(eachTableOrders) && eachTableOrders.length > 0) {
      eachTableOrders.forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.qty);
      });
    }
    return Math.round(total.toFixed(2));
    //return total.toFixed(2);
  };

  const emitOnViewTableOrdersHandlers = (tableId) => {
    let getTableIndex = tableList.findIndex((item) => item.id === tableId);
    if (getTableIndex !== -1) {
      setEachTableOrdersInfo(tableList[getTableIndex]);
      setEditTableFoodMenu({
        tableId: tableList[getTableIndex]?.id,
        action: "view",
      });
    } else {
      toast.error("Oops!! Something went wrong2!");
    }
  };

  const emitOnGenerateBillHandler = (tableId) => {
    if (tableId) {
      const getTableIndex = tableList.findIndex((item) => item.id === tableId);
      if (getTableIndex !== -1) {
        const tempTableList = tableList.map((table) => ({
          ...table,
          orders: [...table.orders],
        }));
        const getTableWithOrders = tempTableList[getTableIndex];
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
          setGenerateTableBill(getTableWithOrders);
          toast.success(
            `Table - ${getTableWithOrders.no}, Bill has Generated successfully!`
          );
        });
      } else {
        toast.error("Oops!! Something went wrong!");
      }
    } else {
      toast.error("Oops!! Something went wrong!");
    }
  };

  const emitOnCloseGenerateBillModalHandler = () => {
    setGenerateTableBill(null);
  };

  const emitOnPaymentReceivedOrderCloseHandler = (tableId) => {
    if (tableId) {
      Swal.fire({
        title: "Are you sure?",
        text: "You have received the payment & close the order?",
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
            const tempTableList = tableList.map((table) => ({
              ...table,
              orders: [...table.orders],
            }));
            tempTableList[getTableIndex].orders = [];
            tempTableList[getTableIndex].bill = 0;
            setTableList(tempTableList);
            setEachTableOrdersInfo(null);
            emitOnEditTableModalCloseHandler();
            emitOnCloseGenerateBillModalHandler();
            saveTableInfoInLocalStorage(tempTableList);
            Swal.fire({
              icon: "success",
              title: "Done!",
              text: "Order has been successfully closed",
              showConfirmButton: true,
            });
          } else {
            toast.error("Oops!! Something went wrong!");
          }
        }
      });
    } else {
      toast.error("Oops!! Something went wrong!");
    }
  };

  const emitOnDoLoginHandler = (authLoginInfoObj) => {
    if (
      authLoginInfoObj?.user?.username === process.env.REACT_APP_USERNAME &&
      authLoginInfoObj?.user?.password === process.env.REACT_APP_PASSWORD
    ) {
      const tempAuthInfo = { ...authLoginInfoObj };
      tempAuthInfo.isAuth = false;
      localStorage.setItem(lsKey + "_auth_info_", JSON.stringify(tempAuthInfo));
      setAuthInfo(tempAuthInfo);
    } else {
      toast.error("Oops!! Username & Password combination is wrong");
    }
  };

  const emitOnAuthSettingsHandler = () => {
    setIsAuthSettingsModalShow(true);
  };

  const emitOnCloseSettingsModalHandler = () => {
    setIsAuthSettingsModalShow(false);
  };

  const emitOnSaveSettingsHandler = (updatedSettingsInfo) => {
    const tempAuthInfo = { ...updatedSettingsInfo };
    localStorage.setItem(lsKey + "_auth_info_", JSON.stringify(tempAuthInfo));
    setAuthInfo(tempAuthInfo);
    setIsAuthSettingsModalShow(false);
    toast.success("Settings are saved successfully");
  };

  const saveTableInfoInLocalStorage = (tableInfo) => {
    localStorage.setItem(lsKey + "_tables_", JSON.stringify(tableInfo));
  };

  const emitOnAuthlogoutHandler = () => {
    localStorage.setItem(
      lsKey + "_auth_info_",
      JSON.stringify(resetAuthDetails)
    );
    setAuthInfo(resetAuthDetails);
    toast.success("You have successfully logged out");
  };

  useEffect(() => {
    checkAuth();
  }, []);

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
            <AppSettings
              sendAuthInfo={authInfo}
              onAuthlogout={emitOnAuthlogoutHandler}
              onAuthSettings={emitOnAuthSettingsHandler}
              sendAuthSettingsModalState={isAuthSettingsModalShow}
              onCloseSettingsModal={emitOnCloseSettingsModalHandler}
              onSaveSettings={emitOnSaveSettingsHandler}
            />
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
                  sendEditTableFoodMenu={editTableFoodMenu}
                />
              </Col>
            </Row>
            {eachTableOrdersInfo && eachTableOrdersInfo !== null && (
              <Row className="mt-3">
                <Col>
                  <TableBillItems
                    sendEachTableOrders={eachTableOrdersInfo}
                    onCancelAllOrders={emitOnCancelAllOrdersHandler}
                    onFoodMenuItemDelete={emitOnFoodMenuItemDeleteHandler}
                    onFoodMenuItemEdit={emitOnFoodMenuItemEditHandler}
                    onGenerateBill={emitOnGenerateBillHandler}
                  />
                </Col>
              </Row>
            )}
            <Row className="mt-3 d-none">
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
              onViewTableOrders={emitOnViewTableOrdersHandlers}
            />
          </Col>
        </Row>
      </Container>
      <GenerateBill
        sendGenerateTableBill={generateTableBill}
        onCloseGenerateBillModal={emitOnCloseGenerateBillModalHandler}
        onPaymentReceivedOrderClose={emitOnPaymentReceivedOrderCloseHandler}
        sendAuthDetails={authInfo}
      />
      <AppLogin sendAuthDetails={authInfo} onDoLogin={emitOnDoLoginHandler} />
    </>
  );
};

export default AppContainer;
