import React, { useState, useEffect } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Modal from "react-responsive-modal";

import Card from "../components/Card/Card.jsx";

const SupplierOrders = () => {
  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);
  const [expand, setExpand] = useState("");
  const [orderList, setOrderList] = useState([
    {
      customer: {
        address: "28 A, N-3, Mojitolabs, DLF phase 2, Gurugramnull",
        city: "Gurugram",
        email: "devadityajha@gmail.com",
        name: "AdityaJha",
        phone: 7821915962,
        zip: 122010,
      },
      id: "21480142275",
      name: "New Product variants",
      quantity: 1,
      sku: "SKU1001",
      paymentStatus: "cod",
      fullfillmentStaus: "not yet",
      amount: "200",
      invoice: "null",
    },
    {
      customer: {
        address: "28 A, N-3, Mojitolabs, DLF phase 2, Gurugramnull",
        city: "Gurugram",
        email: "devadityajha@gmail.com",
        name: "AdityaJha",
        phone: 7821915962,
        zip: 122010,
      },
      id: "214801422753",
      name: "New Product variants",
      quantity: 1,
      sku: "SKU1001",
      paymentStatus: "cod",
      fullfillmentStaus: "not yet",
      amount: "200",
      invoice: "null",
    },
    {
      customer: {
        address: "28 A, N-3, Mojitolabs, DLF phase 2, Gurugramnull",
        city: "Gurugram",
        email: "devadityajha@gmail.com",
        name: "AdityaJha",
        phone: 7821915962,
        zip: 122010,
      },
      id: "2148014227535",
      name: "New Product variants",
      quantity: 1,
      sku: "SKU1001",
      paymentStatus: "cod",
      fullfillmentStaus: "not yet",
      amount: "200",
      invoice: "null",
    },
  ]);

  useEffect(() => {
    // getOrderList();
  }, []);

  const getOrderList = () => {
    axios.get("/api/ordersList/" + decode.id).then((data) => {
      setOrderList(data.data);
      console.log(data.data);
    });
  };

  return (
    <div className="content">
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Order List"
              category={"Total Orders :" + orderList.length}
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Order Id</th>
                      <th>SKU</th>
                      <th>Customer</th>
                      <th>Payment Status</th>
                      <th>Fulfillment Status</th>
                      <th>Total Amount</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList.map((item, key) => {
                      return (
                        <>
                          <tr
                            key={key}
                            onClick={() => {
                              setExpand(item.id);
                            }}
                          >
                            <td>{item.id}</td>
                            <td>{item.sku}</td>
                            <td>{item.customer.name}</td>
                            <td>{item.paymentStatus}</td>
                            <td>{item.fullfillmentStaus}</td>
                            <td>{item.amount}</td>
                            <td>{item.invoice}</td>
                          </tr>

                          {expand === item.id ? (
                            <tr
                              key={key}
                              onClick={() => {
                                setExpand(item.id);
                              }}
                            >
                              {/* <td colSpan="1"></td> */}
                              <td colSpan="3">
                                <th>Customer Setails</th>
                                <tr>Name :- {item.customer.name}</tr>
                                <tr>Email :- {item.customer.email}</tr>
                                <tr>Phone :- {item.customer.phone}</tr>
                                <tr>Address :- {item.customer.address}</tr>
                              </td>
                              <td></td>
                              <td colSpan="3">
                                <th>Order Details</th>
                                <tr>Name :- {item.name}</tr>
                                <tr>Varient :- {item.email}</tr>
                                <tr>Quantity :- {item.quantity}</tr>
                                <tr>Paid :- {item.address}</tr>
                              </td>
                            </tr>
                          ) : null}
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              }
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

export default SupplierOrders;
