import React, { useState, useEffect } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Modal from "react-responsive-modal";

import Card from "../components/Card/Card.jsx";

const SupplierOrders = () => {
  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);
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
      id: "2148014227535",
      name: "New Product variants",
      quantity: 1,
      sku: "SKU1001",
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
                <Table striped hover size="sm">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>SKU</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>DElivery Add.</th>
                      <th>Track No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList.map((item, key) => {
                      return (
                        <>
                          <tr
                            key={key}
                            onClick={() => {
                              console.log("item", item.name);
                            }}
                          >
                            <td>{item.id}</td>
                            <td>{item.sku}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>

                            <td>
                              {item.customer.address},{item.customer.city}-
                              {item.customer.zip}, Mob. no.-
                              {item.customer.phone}
                            </td>

                            <td>
                              {" "}
                              <input type="text" name="track_details" />
                            </td>
                            <td>
                              <button className="btn btn-primary btn-sm">
                                Deliver
                              </button>
                            </td>
                          </tr>
                          <tr
                            key={key}
                            onClick={() => {
                              console.log("item", item.name);
                            }}
                          >
                            <td>Customer Details</td>
                            <td>Order Details</td>
                          </tr>
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
