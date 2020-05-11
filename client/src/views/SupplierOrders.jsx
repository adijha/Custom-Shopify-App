import React, { useState, useEffect } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Card from "../components/Card/Card.jsx";

const SupplierOrders = () => {
  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);
  const [expand, setExpand] = useState("");
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    getOrderList();
  }, []);

  const getOrderList = () => {
    axios.get("/api/ordersList/" + decode.id).then((res) => {
      setOrderList(res.data);
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
                              if (expand === item.id) {
                                setExpand(null);
                              } else {
                                setExpand(item.id);
                              }
                            }}
                          >
                            <td>{item.id || "none"}</td>
                            <td>{item.sku || "none"}</td>
                            <td>{item.customer.name || "none"}</td>
                            <td>{item.paymentStatus || "none"}</td>
                            <td>{item.fullfillmentStaus || "none"}</td>
                            <td>{item.price || "none"}</td>
                            <td>{item.invoice || "none"}</td>
                          </tr>

                          {expand === item.id ? (
                            <tr key={9898989}>
                              <td colSpan="4">
                                <th>Customer Setails</th>
                                <tr>Name :- {item.customer.name}</tr>
                                <tr>Email :- {item.customer.email}</tr>
                                <tr>Phone :- {item.customer.phone}</tr>
                                <tr>Address :- {item.customer.address}</tr>
                              </td>

                              <td colSpan="3">
                                <th>Order Details</th>
                                <tr>Name :- {item.name}</tr>
                                <tr>Varient :- {item.email}</tr>
                                <tr>Quantity :- {item.quantity}</tr>
                                <tr>Paid :- {item.paid}</tr>
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
