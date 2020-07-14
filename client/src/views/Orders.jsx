import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import Card from '../components/Card/Card.jsx';
import jwt_decode from 'jwt-decode';
import { NotificationManager } from 'react-notifications';
import Checkout from './Checkout.jsx';
import StriprCheckout from 'react-stripe-checkout';
import moment from 'moment';

const Orders = () => {
  const [tab, setTab] = useState(1);
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderDetailsUn, setOrderDetailsUn] = useState([]);
  const [orderDetailsFu, setOrderDetailsFu] = useState([]);
  const [msg, setMsg] = useState('');
  const [found, setFound] = useState('');
  const [foundUn, setFoundUn] = useState('');
  const [foundFu, setFoundFu] = useState('');
  const [expand, setExpand] = useState('');
  // var stripe = Stripe('pk_test_pmfKOqLm5AdRbXBfsqNrWew8');
  //const [product, setProduct] = useState({})
  const [pPrice, setPPrice] = useState();
  const [pName, setPName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [custDetail, setCustDetail] = useState({});

  useEffect(() => {
    getOrderDetails();
    // getOrderDetailsFulfilled();
    // getOrderDetailsAll();
  }, []);

  const tokenData = localStorage.getItem('token');
  let decode = jwt_decode(tokenData);
  let str = decode.email;
  let storeName = `${decode.store}.myshopify.com`;
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
    console.log(
      'moment date, ',
      moment.utc('2020-06-30T21:09:43.000Z').format('YYYY-MM-DD,  h:mm:ss a')
    );

    await axios
      .get(
        '/api/merchantShopifyOrdersUnfulfilled/' +
          decode.store.toLowerCase().toString()
      )
      .then((data) => {
        console.log('data is orders unfulfilled', data.data);
        const sortedArray = data.data.allOrder.sort(
          (a, b) =>
            moment(a.date).format('YYYY-MM-DD,  h:mm:ss a') -
            moment(b.date).format('YYYY-MM-DD,  h:mm:ss a')
        );
        const sortedActivities = data.data.allOrder.sort(
          (a, b) => b.date - a.date
        );
        let sortData = data.data.allOrder.filter((allOrd) => {
          return moment(allOrd.date).subtract(1);
        });
        console.log('sortData', sortData);
        console.log('sortedArray', sortedArray);
        console.log('sortedActivities', sortedActivities);

        setOrderDetailsUn(data.data.unfulfilOrder);
        setOrderDetails(data.data.allOrder);
        setOrderDetailsFu(data.data.fulfilOrder);

        if (data.data.unfulfilOrder.length == 0) {
          setFoundUn('No Order Found');
        } else if (data.data.fulfilOrder.length == 0) {
          setFoundFu('No Order Found');
        } else if (data.data.allOrder.length == 0) {
          setFound('No Order Found');
        }

        // else{
        //   setFoundUn("No order found")
        // }
      });
  };

  const changeView = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    if (e.target.value === 'all') {
      setTab(1);
    } else if (e.target.value === 'unfulfil') {
      setTab(2);
    } else if (e.target.value === 'fulfil') {
      setTab(3);
    }
  };

  // const filterItems = (orderDetails.filter(plist=>{
  //     return plist.pStatus ==='Paid';
  //    }))

  const handleClick = (data) => {
    let obj = {
      orderId: orderId.toString(),
    };

    console.log('obj is', obj);
    axios
      .patch('/api/supplierOrderFromMerchant/' + data.orderId.toString())
      .then((res) => {
        if (res) {
          NotificationManager.success('Fulfilled Successfully');
          getOrderDetails();
          //console.log(filterItems.length, "length of filterItems")
        } else {
          NotificationManager.error('Something wrong');
        }
      });

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
    console.log('data is ', data);
console.log("DATAA", data);
    if (data.customer_detail.country.toLowerCase()==="usa") {
      setPName(data.productName);
      setPPrice(parseFloat(data.selliingPrice*data.quantity)+parseFloat(data.shippingCharge.usa));
      setCustDetail(data.customer_detail);
      setExpand(data.orderId);
      setOrderId(data.orderId);
    }
    else if (data.customer_detail.country.toLowerCase()==="canada") {
      setPName(data.productName);
      setPPrice(parseFloat(data.selliingPrice*data.quantity)+parseFloat(data.shippingCharge.canada));
      setCustDetail(data.customer_detail);
      setExpand(data.orderId);
      setOrderId(data.orderId);
    }
    else if (data.customer_detail.country.toLowerCase()==="australia") {
      setPName(data.productName);
      setPPrice(parseFloat(data.selliingPrice*data.quantity)+parseFloat(data.shippingCharge.australia));
      setCustDetail(data.customer_detail);
      setExpand(data.orderId);
      setOrderId(data.orderId);
    }
    else if (data.customer_detail.country.toLowerCase()==="unitedKingdom") {
      setPName(data.productName);
      setPPrice(parseFloat(data.selliingPrice*data.quantity)+parseFloat(data.shippingCharge.unitedKingdom));
      setCustDetail(data.customer_detail);
      setExpand(data.orderId);
      setOrderId(data.orderId);
    }
    else  {
      setPName(data.productName);
      setPPrice(parseFloat(data.selliingPrice*data.quantity)+parseFloat(data.shippingCharge.international));
      setCustDetail(data.customer_detail);
      setExpand(data.orderId);
      setOrderId(data.orderId);
    }
  };

  let handlePayment = async (token) => {
    let product = {
      name: pName,
      price: Math.round(pPrice),
      details: custDetail,
    };

    const body = await {
      token,
      product,
    };
    console.log('body is', body);
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
      'Content-Type': 'application/json',
    };
    let dateObj = { date: moment().format('DD-MM-YYYY') };

    return fetch('https://www.melisxpress.com/api/payment', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status === 200) {
          NotificationManager.success('Payment Done Successfully');

          axios
            .patch(
              '/api/supplierOrderFromMerchant/' + orderId.toString(),
              dateObj
            )
            .then((res) => {
              if (res) {
                NotificationManager.success('Fulfilled Successfully');
                setFoundFu('')
                getOrderDetails();

                //console.log(filterItems.length, "length of filterItems")
              } else {
                NotificationManager.error('Something wrong');
              }
            });
        }
      })
      .catch((err) => {
        console.log('last err', err);
      });
  };

  return (
    <div>
      <div className='content'>
        <div className='text-center' style={{ color: 'green' }}>
          {msg}
        </div>
        <br />
        <select onChange={(e) => changeView(e)}>
          <option value='all'>All Orders</option>
          <option value='unfulfil'>Unfulfilled</option>
          <option value='fulfil'>Fulfilled</option>
        </select>
        <br />
        <br />
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title='Orders List'
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

                    {tab === 1 ? (
                      <tbody>
                        <tr>{found}</tr>
                        {orderDetails.map((item, key) => {
                          return (
                            <>
                              <tr
                                key={key}
                                onClick={() => {
                                  if (expand === item.orderId) {
                                    setExpand(null);
                                  } else {
                                    setExpand(item.orderId);
                                  }
                                }}
                              >
                                <td>{key + 1}</td>
                                <td>{item.orderId}</td>
                                <td>
                                  {moment(item.date).format('DD-MM-YYYY')}
                                </td>
                                <td>{item.customer_detail.name}</td>
                                <td>{item.paymentMode || 'NA'}</td>
                                <td>{item.pStatus}</td>
                                <td>
                                  $
                                  {new Intl.NumberFormat('en-US').format(
                                    item.selliingPrice*item.quantity
                                  )}
                                </td>
                                <td>{item.customer_detail.country.toLowerCase()==="usa"?'$'+item.shippingCharge.usa:null}
                                {item.customer_detail.country.toLowerCase()==="canada"?'$'+item.shippingCharge.canada:null}
                                {item.customer_detail.country.toLowerCase()==="australia"?'$'+item.shippingCharge.australia:null}
                                {item.customer_detail.country.toLowerCase()==="unitedKingdom"?'$'+item.shippingCharge.unitedKingdom:null}
                                {(item.customer_detail.country.toLowerCase()==="usa"||"canada"||"australia"||"unitedKingdom")?'$'+item.shippingCharge.international:null}</td>

                                <td>
                                  {item.fulfillmentStatus === 'Fulfilled' ? (
                                    <span
                                      style={{
                                        backgroundColor: 'yellowgreen',
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '10%',
                                      }}
                                    >
                                      Fulfilled
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        backgroundColor: '#ffcccb',
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '10%',
                                      }}
                                    >
                                      Unfulfilled
                                    </span>
                                  )}
                                </td>
                              </tr>
                              {expand === item.orderId ? (
                                <tr key={9898989}>
                                  <td colSpan='1'>
                                    <th>Product Detail</th>
                                    <tr>
                                      {item.productImage.length > 0 ? (
                                        <img
                                          style={{ width: 100 }}
                                          className='product-logo'
                                          src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`}
                                        />
                                      ) : (
                                        'NA'
                                      )}
                                    </tr>
                                  </td>

                                  <td colSpan='2'>
                                    <tr>{item.productName}</tr>
                                  </td>

                                  <td colSpan='2'>
                                    <tr>{item.sku}</tr>
                                  </td>

                                  <td colSpan='1'>
                                    <tr>
                                      ${' '}
                                      {new Intl.NumberFormat('en-US').format(
                                        item.selliingPrice
                                      )}x{new Intl.NumberFormat('en-US').format(
                                        item.quantity
                                      )}
                                    </tr>
                                  </td>
                                </tr>
                              ) : null}
                            </>
                          );
                        })}
                      </tbody>
                    ) : null}

                    {tab === 2 ? (
                      <tbody>
                        <tr>{foundUn}</tr>
                        {orderDetailsUn.map((item, key) => {
                          return (
                            <>
                              <tr
                                key={key}
                                onClick={() => {
                                  if (expand === item.orderId) {
                                    setExpand(null);
                                  } else {
                                    handleClickTest(item)
                                    // setExpand(item.orderId);

                                    // setPName(item.productName);
                                    // setPPrice(item.item_price);
                                    // setCustDetail(item.customer_detail);
                                    // setOrderId(item.orderId);
                                  }
                                }}
                              >
                                <td>{key + 1}</td>
                                <td>{item.orderId}</td>
                                <td>
                                  {moment(item.date).format('DD-MM-YYYY')}
                                </td>
                                <td>{item.customer_detail.name}</td>
                                <td>{item.paymentMode || 'NA'}</td>
                                <td>{item.pStatus}</td>

                                <td>
                                $
                                {new Intl.NumberFormat('en-US').format(
                                  item.selliingPrice*item.quantity
                                )}
                                </td>
                                <td>{item.customer_detail.country.toLowerCase()==="usa"?'$'+item.shippingCharge.usa:null}
                                {item.customer_detail.country.toLowerCase()==="canada"?'$'+item.shippingCharge.canada:null}
                                {item.customer_detail.country.toLowerCase()==="australia"?'$'+item.shippingCharge.australia:null}
                                {item.customer_detail.country.toLowerCase()==="unitedKingdom"?'$'+item.shippingCharge.unitedKingdom:null}
                                {(item.customer_detail.country.toLowerCase()==="usa"||"canada"||"australia"||"unitedKingdom")?'$'+item.shippingCharge.international:null}</td>
                                <td>
                                {item.pStatus==="unpaid"?
                                <StriprCheckout
                                  stripeKey='pk_test_pmfKOqLm5AdRbXBfsqNrWew8'
                                  token={handlePayment}
                                  name='Pay for Order'
                                  amount={pPrice*100}
                                >
                                  {' '}
                                  <button className='btn btn-primary'>
                                    Pay
                                  </button>
                                </StriprCheckout>:"Unfulfilled"}

                                  {/*<button
                                classsName="btn btn-primary"
                                style={{
                                  background: "White",
                                  color: "black",
                                  border: "1px solid lightblue",
                                }}
                                onClick={() => handleClickTest(item)}
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
                                      {item.productImage.length > 0 ? (
                                        <img
                                          className='product-logo'
                                          src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`}
                                        />
                                      ) : (
                                        'NA'
                                      )}
                                    </tr>
                                  </td>

                                  <td colSpan='2'>
                                    <tr>{item.productName}</tr>
                                  </td>

                                  <td colSpan='2'>
                                    <tr>{item.sku}</tr>
                                  </td>

                                  <td colSpan='1'>
                                    <tr>
                                      ${item.selliingPrice}x{item.quantity}
                                    </tr>
                                  </td>
                                </tr>
                              ) : null}
                            </>
                          );
                        })}
                      </tbody>
                    ) : null}

                    {tab === 3 ? (
                      <tbody>
                        <tr>{foundFu}</tr>
                        {orderDetailsFu.map((item, key) => {
                          return (
                            <>
                              <tr
                                key={key}
                                onClick={() => {
                                  if (expand === item.orderId) {
                                    setExpand(null);
                                  } else {
                                    setExpand(item.orderId);
                                  }
                                }}
                              >
                                <td>{key + 1}</td>
                                <td>{item.orderId}</td>
                                <td>
                                  {moment(item.date).format('DD-MM-YYYY')}
                                </td>
                                <td>{item.customer_detail.name}</td>
                                <td>{item.paymentMode || 'NA'}</td>
                                <td>{item.pStatus}</td>
                                <td>$
                                {new Intl.NumberFormat('en-US').format(
                                  item.selliingPrice*item.quantity
                                )}</td>
                                <td>{item.customer_detail.country.toLowerCase()==="usa"?'$'+item.shippingCharge.usa:null}
                                {item.customer_detail.country.toLowerCase()==="canada"?'$'+item.shippingCharge.canada:null}
                                {item.customer_detail.country.toLowerCase()==="australia"?'$'+item.shippingCharge.australia:null}
                                {item.customer_detail.country.toLowerCase()==="unitedKingdom"?'$'+item.shippingCharge.unitedKingdom:null}
                                {(item.customer_detail.country.toLowerCase()==="usa"||"canada"||"australia"||"unitedKingdom")?'$'+item.shippingCharge.international:null}</td>
                                <td>Fulfilled</td>
                              </tr>


                              {expand === item.orderId ? (
                                <tr key={9898989}>
                                  <td colSpan='1'>
                                    <th>Product Detail</th>
                                    <tr>
                                      {item.productImage.length > 0 ? (
                                        <img
                                          className='product-logo'
                                          src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`}
                                        />
                                      ) : (
                                        'NA'
                                      )}
                                    </tr>
                                  </td>

                                  <td colSpan='2'>
                                    <tr>{item.productName}</tr>
                                  </td>

                                  <td colSpan='2'>
                                    <tr>{item.sku}</tr>
                                  </td>

                                  <td colSpan='1'>
                                    <tr>
                                      ${item.selliingPrice}x{item.quantity}
                                    </tr>
                                  </td>
                                </tr>
                              ) : null}
                            </>
                          );
                        })}
                      </tbody>
                    ) : null}
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
