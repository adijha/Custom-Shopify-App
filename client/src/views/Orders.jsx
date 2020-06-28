import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";
import jwt_decode from "jwt-decode";
import { NotificationManager } from 'react-notifications';
import Checkout from './Checkout.jsx'
import StriprCheckout from 'react-stripe-checkout'
const Orders = () => {
  const [tab, setTab] = useState(1)
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderDetailsUn, setOrderDetailsUn] = useState([]);
  const [orderDetailsFu, setOrderDetailsFu] = useState([]);
  const [msg, setMsg] = useState("");
  const [found, setFound] = useState("")
  const [foundUn, setFoundUn] = useState("")
  const [foundFu, setFoundFu] = useState("")
  const [expand, setExpand] = useState('');
// var stripe = Stripe('pk_test_pmfKOqLm5AdRbXBfsqNrWew8');
  const [product, setProduct] = useState({
    name: "test product ashish",
    price: 120
  })
  const [pPrice, setPPrice]=useState()
  const [pName, setPName] = useState("");
  const [orderId, setOrderId] = useState("")


  useEffect(() => {
    getOrderDetails();
    // getOrderDetailsFulfilled();
    // getOrderDetailsAll();
  }, []);

  const tokenData = localStorage.getItem("token");
  let decode = jwt_decode(tokenData);
  let str = decode.email;
  let storeName = `${decode.store}.myshopify.com`
  //let VendorString = str.substring(0, str.lastIndexOf("@"));
  //console.log(VendorString);

  // const getOrderDetailsAll = async () => {
  //   console.log(decode.store);
  //
  //     await axios.get("/api/merchantShopifyOrdersUnfulfilled/" + decode.store.toLowerCase().toString()).then((data) => {
  //       console.log("data is asll orders", data.data);
  //       setOrderDetails(data.data);
  //
  //       // if (data.data.length>0) {
  //       // }
  //       // else{
  //       //   setFound("No order found")
  //       // }
  //     });
  // };

  const getOrderDetails = async () => {
    console.log(decode.store);

      await axios.get("/api/merchantShopifyOrdersUnfulfilled/" + decode.store.toLowerCase().toString()).then((data) => {
        console.log("data is orders unfulfilled", data.data);


         if (data.data.unfulfilOrder.length==0) {
           setFoundUn("No Order Found")
         }
         else if (data.data.fulfilOrder.length==0) {
           setFoundFu("No Order Found")
         }
         else if (data.data.allOrder.length==0) {
           setFound("No Order Found")
         }

         setOrderDetailsUn(data.data.unfulfilOrder);
         setOrderDetails(data.data.allOrder);
         setOrderDetailsFu(data.data.fulfilOrder);
        // else{
        //   setFoundUn("No order found")
        // }
      });
  };
  // const getOrderDetailsFulfilled = async () => {
  //   console.log(decode.store);
  //
  //     await axios.get("/api/merchantShopifyOrdersUnfulfilled/" + decode.store.toLowerCase().toString()).then((data) => {
  //       console.log("data is orders", data.data);
  //       setOrderDetailsFu(data.data);
  //       //
  //       // if (data.data.length>0) {
  //       // }
  //       // else{
  //       //   setFoundFu("No order found")
  //       // }
  //     });
  // };

const changeView = (e)=>{
  e.preventDefault()
  console.log(e.target.value);
  if(e.target.value==="all") {
   setTab(1);
  }
  else if(e.target.value==="unfulfil") {
    setTab(2);
  }
  else if (e.target.value==="fulfil") {
      setTab(3)
  }


}

  // const filterItems = (orderDetails.filter(plist=>{
  //     return plist.pStatus ==='Paid';
  //    }))

  const handleClick = (data) => {
    let obj = {
      orderId: data.orderId.toString()
    }

    console.log("obj is", obj);
    axios.patch('/api/supplierOrderFromMerchant/'+ data.orderId.toString())
    .then (res=>{
      if (res) {
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


      const handleClickTest = (data) => {
        let obj = {
          orderId: data.orderId.toString()
        }
        let newobj = {
          name:data.productName,
          price:parseInt(data.item_price)
        }
        setProduct(newobj)

        console.log("obj is", newobj);
        // axios.patch('/api/supplierOrderFromMerchant/'+ data.orderId.toString())
        // .then (res=>{
        //   if (res) {
        //     NotificationManager.success('Fulfilled Successfully');
        //     getOrderDetails()
        //     //console.log(filterItems.length, "length of filterItems")
        //   }
        //  else {
        //   NotificationManager.error('Something wrong');
        //   }

        //})
  }

  let handlePayment = async (token) =>{
    const body = {
      token,
      product
    }
    console.log("body is", body);
    console.log();
    // return await axios.post('/api/payment', body)
    // .then(response=>{
    //   console.log("response is", response);
    //
    // })
    // .catch(err=>{
    //   console.log("err", err);
    // })

    const headers = {
      "Content-Type": "application/json"
    }
    // return
    // axios({
    //         method: 'post',
    //         url: '.api/payment',
    //         data: body
    //       })
 return fetch('http://localhost:5000/api/payment', {
      method:"POST",
      headers,
      body: JSON.stringify(body)
    })
    .then(response=>{
      if (response.status===200) {
        NotificationManager.success('Fulfilled Successfully');
      }
    }).catch(err=>{
      console.log("last err", err);
    })

  }

  return (
    <div>
      <div className="content">
        <div className="text-center" style={{ color: "green" }}>
          {msg}
        </div>
        <br/>
        <select onChange={(e) => changeView(e)}>
          <option value="all">All Orders</option>
          <option value="unfulfil">Unfulfilled</option>
          <option value="fulfil">Fulfilled</option>
        </select>
        <br/>
        <br/>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Orders List"
                ctTableFullWidth
                ctTableResponsive
                content={


                  <Table striped hover>
                    <thead>
                      <tr>
                      <th>S.No</th>
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

                    {tab===1?
                    <tbody>
                    <tr>{found}</tr>
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
                            <td>{key+1}</td>
                            <td>{item.orderId}</td>
                            <td>{item.date}</td>
                            <td>{item.customer_detail.name}</td>
                            <td>{item.paymentMode||'NA'}</td>
                            <td>{item.pStatus}</td>
                            <td>${item.total_amount}</td>
                            <td>{item.shipping||'NA'}</td>
                            <td>
                            {`${item.pStatus==="Paid"}`? "Fulfilled":
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
                            }
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
                    :null}

                    {tab===2?
                    <tbody>
                    <tr>{foundUn}</tr>
                      {orderDetailsUn.map((item, key) => {
                        return (
                          <>
                          <tr key={key}   onClick={() => {
                              if (expand === item.orderId) {
                                setExpand(null);
                              } else {
                                setExpand(item.orderId);
                              }
                            }}>
                            <td>{key+1}</td>
                            <td>{item.orderId}</td>
                            <td>{item.date}</td>
                            <td>{item.customer_detail.name}</td>
                            <td>{item.paymentMode||'NA'}</td>
                            <td>{item.pStatus}</td>
                            <td>${item.total_amount}</td>
                            <td>{item.shipping||'NA'}</td>
                            <td onChange={(item)=>setProduct({name:item.productName, price:item.item_price})}><StriprCheckout  stripeKey = "pk_test_pmfKOqLm5AdRbXBfsqNrWew8" token={handlePayment} name="Pay for Order"

                            amount= {product.price*100} onChange={(item)=>setProduct({name:item.productName, price:item.item_price})}>
                            <button className="btn btn-primary" onChange={(item)=>setProduct({name:item.productName, price:item.item_price})}>Pay</button></StriprCheckout>
                              {/*<button
                                classsName="btn btn-primary"
                                style={{
                                  background: "White",
                                  color: "black",
                                  border: "1px solid lightblue",
                                }}
                                onClick={() => handleClick(item)}
                              >
                                Fulfill
                              </button>*/}

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
                    :null}

                    {tab===3?
                    <tbody>
                    <tr>{foundFu}</tr>
                      {orderDetailsFu.map((item, key) => {
                        return (
                          <>
                          <tr key={key}   onClick={() => {
                              if (expand === item.orderId) {
                                setExpand(null);
                              } else {
                                setExpand(item.orderId);
                              }
                            }}>
                            <td>{key+1}</td>
                            <td>{item.orderId}</td>
                            <td>{item.date}</td>
                            <td>{item.customer_detail.name}</td>
                            <td>{item.paymentMode||'NA'}</td>
                            <td>{item.pStatus}</td>
                            <td>${item.total_amount}</td>
                            <td>{item.shipping||'NA'}</td>
                            <td>

                                Fulfilled
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
                    :null}

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
