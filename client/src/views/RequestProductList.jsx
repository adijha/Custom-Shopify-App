import React, { useState, useEffect } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { NotificationManager } from "react-notifications";
import Card from "../components/Card/Card.jsx";
import CustomButton from "../components/CustomButton/CustomButton";
import "../assets/css/supplierOrders.css";
import moment from "moment";

const RequestProductList = () => {
  const [requestList, setRequestList] = useState([]);
  const [found, setFound] = useState('')

  useEffect(() => {
    getMerchant();
  }, []);

  const getMerchant = async () => {
    const res = await axios.get("/api/getRequestProduct");
    let sortedArray = res.data.sort(
      (a, b) => new moment(b.date) - new moment(a.date)
    );
    if (sortedArray.length===0) {
      setFound("No Data Found")
    }
    else {
      setRequestList(sortedArray);
    }

  };

  return (
    <div className="content">
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Requested Product List"
              category={"Total Requested Product :" + requestList.length}
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Merchant Name</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>

                  <tr>{found}</tr>
                    {requestList.map((item, key) => {
                      return (
                        <>
                          <tr key={key}>
                            <td>{key + 1}</td>
                            <td>{item.merchantId || "NA"}</td>
                            <td>
                              {moment(item.date).format("YYYY-DD-MM") || "NA"}
                            </td>
                            <td>{item.name || "NA"}</td>
                            <td>
                              <a href={item.link} target="_blank">
                                {item.link}
                              </a>
                            </td>
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

export default RequestProductList;
