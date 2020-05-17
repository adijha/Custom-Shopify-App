import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { NotificationManager } from 'react-notifications';
import Card from '../components/Card/Card.jsx';
import CustomButton from '../components/CustomButton/CustomButton';
import '../assets/css/supplierOrders.css';
const SupplierOrders = () => {
  const token = localStorage.getItem('token');
  const decode = jwt_decode(token);
  const [expand, setExpand] = useState('');
  const [orderList, setOrderList] = useState([]);
  const [fulfill, setFulfill] = useState('');

  useEffect(() => {
    getOrderList();
  }, []);

  const getOrderList = () => {
    axios.get('/api/ordersList/' + decode.id).then((res) => {
      setOrderList(res.data);
    });
  };

  const updateFulfillment = async () => {
    try {
      let res = await axios.post('/fulfillOrder', { trackingId: fulfill });
      if (res.data.includes('success')) {
        NotificationManager.success('Fulfilled Successfully');
      }
    } catch (error) {
      NotificationManager.error('Something unusual happened');
    }
  };

  return (
    <div className='content'>
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title='Order List'
              category={'Total Orders :' + orderList.length}
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table hover size='sm'>
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
                            <td>{item.id || 'none'}</td>
                            <td>{item.sku || 'none'}</td>
                            <td>{item.customer.name || 'none'}</td>
                            <td>{item.paymentStatus || 'none'}</td>
                            <td>{item.fullfillmentStaus || 'none'}</td>
                            <td>{item.price || 'none'}</td>
                            <td>{item.invoice || 'none'}</td>
                          </tr>

                          {expand === item.id ? (
                            <tr key={9898989}>
                              <td colSpan='3'>
                                <th>Customer Details</th>
                                <tr>Name :- {item.customer.name}</tr>
                                <tr>Email :- {item.customer.email}</tr>
                                <tr>Phone :- {item.customer.phone}</tr>
                                <tr>
                                  Address :-{' '}
                                  {item.customer.address.slice(0, 22)}
                                </tr>
                                <tr>
                                  {item.customer.address.slice(
                                    22,
                                    item.customer.length
                                  )}
                                </tr>
                              </td>

                              <td colSpan='2'>
                                <th>Order Details</th>
                                <tr>Name :- {item.name}</tr>
                                <tr>Variant :- {item.email}</tr>
                                <tr>Quantity :- {item.quantity}</tr>
                                <tr>Paid :- {item.paid}</tr>
                              </td>
                              <td colSpan='2'>
                                <th>Fulfill Order</th>
                                <tr
                                  style={{
                                    display: 'flex',
                                    width: 230,
                                    alignItems: 'center',
                                  }}
                                >
                                  <input
                                    style={{
                                      width: 120,
                                      marginRight: 10,
                                      height: 35,
                                      marginTop: 10.5,
                                    }}
                                    type='text'
                                    name='track_details'
                                    placeholder='Tracking Id'
                                    onChange={(e) => setFulfill(e.target.value)}
                                  />

                                  <div
                                    className='meraButton'
                                    onClick={updateFulfillment}
                                  >
                                    Fulfill
                                  </div>
                                </tr>
                                <tr></tr>
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
