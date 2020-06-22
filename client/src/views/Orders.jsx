import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";
import jwt_decode from "jwt-decode";
import { NotificationManager } from 'react-notifications';

const Orders = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [msg, setMsg] = useState("");
  const [found, setFound] = useState("")
  const [expand, setExpand] = useState('');

  useEffect(() => {
    getOrderDetails();
  }, []);

  const token = localStorage.getItem("token");
  let decode = jwt_decode(token);
  let str = decode.email;
  let storeName = `${decode.store}.myshopify.com`
  //let VendorString = str.substring(0, str.lastIndexOf("@"));
  //console.log(VendorString);

  const getOrderDetails = () => {
    console.log(decode.store);
    
    axios.get("/api/merchantShopifyOrders/" + decode.store.toLowerCase()).then((data) => {
      console.log("data is orders", data.data);
      if (data.data.length>0) {
        setOrderDetails(data.data);
      }
      else{
        setFound("No order found")
      }
    });
  };

  // const filterItems = (orderDetails.filter(plist=>{
  //     return plist.pStatus ==='Paid';
  //    }))

  const handleClick = (data) => {
    let obj = {
      orderId: data.orderId
    }

    console.log("obj is", obj);
    axios.patch('/api/supplierOrderFromMerchant', obj)
    .then (res=>{
      if (res.data.length>0) {
        NotificationManager.success('Fulfilled Successfully');
        getOrderDetails()
        //console.log(filterItems.length, "length of filterItems")
      }
     else {
      NotificationManager.error('Something wrong');
      }

    })
    //console.log("data is", data);
    // const line_items_Array = [];
    // data.line_items.forEach((item, i) => {
    //   line_items_Array.push({
    //     id: item.id,
    //   });
    // });
    //
    // console.log("line_items_Array is", line_items_Array);
    //
    // const fulfilObject = {
    //   fulfillment: {
    //     location_id: 35210428495,
    //     tracking_number: null,
    //     line_items: line_items_Array,
    //   },
    // };
    //
    // axios
    //   .post("/orders/" + storeName + "/" + data.id, fulfilObject)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log("orders fulfiled", response);
    //       setMsg("Order Fulfilled Successfully");
    //       getOrderDetails();
    //     }
    //  });
    // const orderArray = [];
    //
    // orderDetails.forEach((item, i) => {
    //   orderArray.push({
    //     id: item.id
    //   })
    // });

    //console.log("order Array is ", orderArray);
  };

  return (
    <div>
      <div className="content">
        <div className="text-center" style={{ color: "green" }}>
          {msg}
        </div>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Orders List"
                category={"Total Orders :" + orderDetails.length}
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Order Id</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Customer Payment</th>
                        <th>Melisxpress Payment</th>
                        <th>Cost</th>
                        <th>Shipping</th>
                        <th>Order Status</th>
                      </tr>
                    </thead>
                    <tbody>{found}</tbody>
                    <tbody>
                      {orderDetails.map((item, key) => {
                        return (
                          <>
                          <tr key={key}   onClick={() => {
                              if (expand === item.orderId) {
                                setExpand(null);
                              } else {
                                setExpand(item.orderId);
                              }
                            }}>
                            <td>{item.orderId}</td>
                            <td>{item.date}</td>
                            <td>{item.customer_detail.name}</td>
                            <td>{item.paymentMode||'NA'}</td>
                            <td>{item.pStatus}</td>
                            <td>${item.total_amount}</td>
                            <td>{item.shipping||'NA'}</td>
                            <td>
                              <button
                                classsName="btn btn-primary"
                                style={{
                                  background: "White",
                                  color: "black",
                                  border: "1px solid lightblue",
                                }}
                                onClick={() => handleClick(item)}
                              >
                                Fulfill
                              </button>
                            </td>
                          </tr>

                            {expand === item.orderId ? (
                              <tr key={9898989}>
                              <td colSpan='1'>
                              <th>Product Detail</th>
                              <tr>
                              {item.productImage.length>0?(<img
                                className='product-logo'
                                src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`
                              }/>):("NA")}
                              </tr>

                              </td>

                              <td colSpan='2'>
                              <tr>{item.productName}</tr>
                              </td>

                              <td colSpan='2'>
                              <tr>{item.sku}</tr>
                              </td>

                              <td colSpan='1'>
                              <tr>${item.item_price}x{item.quantity}</tr>
                              </td>
                              </tr>
                            ):(null)}

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
    </div>
  );
};

export default Orders;
