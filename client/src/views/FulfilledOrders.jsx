import React, {useState, useEffect} from "react";
import axios from 'axios'
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";
import jwt_decode from 'jwt-decode';


const FulfilledOrders = ()=>{

const [orderDetails, setOrderDetails] = useState([])
const [msg, setMsg] = useState('')

useEffect(()=>{
getOrderDetails();
}, [])

const token = localStorage.getItem("token")
let decode = jwt_decode(token)
let str = decode.email;
  let VendorString = str.substring(0, str.lastIndexOf("@"));
  console.log(VendorString);


const getOrderDetails = ()=>{
  axios.get('/fulfilledOrders/'+VendorString)
  .then(data=>{
    console.log("data is fulfil orders", data.data.orders)
    setOrderDetails(data.data.orders)
  })
}






  return(
    <div>
    <div className="content">
    <div className="text-center" style={{color:"green"}}>{msg}</div>
      <Grid fluid>
        <Row>
          <Col md={12}>

            <Card
              title="Orders List"
              category={"Total Orders :"+ orderDetails.length}
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table striped hover >
                  <thead >
                    <tr>
                      <th>Id</th>
                      <th>Name & Quantity</th>
                      <th>Currency</th>
                      <th>Total Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{item.id}</td>
                          <td>
                          {item.line_items.map(data=>{
                            return(
                              <li>{data.name} -  {data.quantity}Qty.</li>
                            )
                          })}</td>
                          <td>{item.currency}</td>
                          <td>{item.total_price}</td>
                          <td>{item.financial_status}</td>
                          <td>{item.fulfillment_status}</td>
                        </tr>
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

  )
}

export default FulfilledOrders;
