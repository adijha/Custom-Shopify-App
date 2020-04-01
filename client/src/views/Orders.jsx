import React, {useState, useEffect} from "react";
import axios from 'axios'
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";
import jwt_decode from 'jwt-decode';



const Orders = ()=>{

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
  axios.get('/orders/'+VendorString)
  .then(data=>{
    console.log("data is orders", data.data.orders)
    setOrderDetails(data.data.orders)
  })
}

const handleClick = (data) =>{
console.log("data is", data)

  const line_items_Array = []

  data.line_items.forEach((item, i) => {
    line_items_Array.push({
      id:item.id
    })
  });

  console.log("line_items_Array is", line_items_Array)

  const fulfilObject =
    {
  "fulfillment": {
    "location_id": 35210428495,
    "tracking_number": null,
    "line_items": line_items_Array
  }
}


axios.post('/orders/'+VendorString+'/'+data.id, fulfilObject)
.then(response=>{
  if (response.status == 200) {
    console.log("orders fulfiled", response)
    setMsg("Order Fulfilled Successfully")
    getOrderDetails();
  }


})
  // const orderArray = [];
  //
  // orderDetails.forEach((item, i) => {
  //   orderArray.push({
  //     id: item.id
  //   })
  // });

  //console.log("order Array is ", orderArray);
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
                          <td><button classsName="btn btn-primary" style={{background:"White", color:"black", border:"1px solid lightblue" }} onClick={()=>handleClick(item)}>Fulfill</button></td>
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

export default Orders;
