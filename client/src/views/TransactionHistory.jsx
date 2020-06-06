import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import Card from '../components/Card/Card.jsx';
import CsvDownloader from 'react-csv-downloader';
import moment from 'moment';
const SupplierList = () => {
  const [orders, setOrders] = useState([]);
  const [expand, setExpand] = useState('');
  const [expand2, setExpand2] = useState('');
  const [startDate, setStartDate] = useState(
    moment('01-01-2019').format('Y-MM-DD')
  );
  const [context, setContext] = useState('supplier');
  const [endDate, setEndDate] = useState(moment().format('Y-MM-DD'));
  useEffect(() => {
    getSupplierData();
  }, []);

  const getSupplierData = async () => {
    axios.get('/api/customOrderDetails').then((res) => {
      setOrders(res.data);
      // console.log(res.data);
    });
  };
  const sortByDate = () => {
    let newOrders = [];
    orders.forEach((order) => {
      if (
        moment(order.order_date).format('Y-MM-DD') >= startDate &&
        moment(order.order_date).format('Y-MM-DD') <= endDate
      ) {
        newOrders.push(order);
      }
    });
    setOrders(newOrders);
  };

  return (
    <div className='content'>
      <div
        style={{
          textAlign: 'right',
          alignSelf: 'right',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-20px',
          padding: 10,
          // backgroundColor: 'grey',
          // maxWidth: 500,
          // alignSelf: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'center',
            backgroundColor: 'grey',
            // padding: 10,
            // paddingLeft: 20,
            // paddingRight: 20,
            borderRadius: 20,
            minHeight: 50,
          }}
        >
          <div
            style={{
              backgroundColor: context === 'supplier' ? 'blue' : 'grey',
              color: context === 'supplier' ? 'white' : 'black',
              padding: 10,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              paddingLeft: 20,
              paddingRight: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setContext('supplier')}
          >
            Supplier Transaction History
          </div>
          <div
            style={{
              backgroundColor: context === 'merchant' ? 'blue' : 'grey',
              color: context === 'merchant' ? 'white' : 'black',
              padding: 10,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              paddingRight: 20,
              paddingLeft: 20,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              justifyContent: 'center',
            }}
            onClick={() => setContext('merchant')}
          >
            Merchant Transaction History
          </div>
        </div>
      </div>
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table striped hover size='sm'>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Product Image</th>
                      <th>Order Id</th>
                      <th>Merchant Id</th>
                      <th>Supplier Id</th>
                      <th>Customer</th>
                      <th>SKU</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((item, key) => {
                      return (
                        <>
                          <tr key={key}>
                            <td>{key + 1}</td>
                            <td style={{ width: '20%' }}>
                              {item.productImage ? (
                                <img
                                  className='product-logo'
                                  src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`}
                                />
                              ) : (
                                'No Image Available'
                              )}
                            </td>
                            <td
                              onClick={() => {
                                setExpand(item.orderId);
                                setExpand2('');
                              }}
                              style={{ color: '#5B8DF7', cursor: 'pointer' }}
                            >
                              {item.orderId}
                            </td>
                            <td>{item.merchantName}</td>
                            <td>{item.supplier_id}</td>
                            <td
                              onClick={() => {
                                setExpand2(item.orderId);
                                setExpand('');
                              }}
                              style={{ color: '#5B8DF7', cursor: 'pointer' }}
                            >
                              {item.customer_name.name}
                            </td>
                            <td>{item.sku}</td>
                            <td>${item.total_price}</td>
                          </tr>

                          {expand === item.orderId ? (
                            <tr key={9898989}>
                              <td></td>
                              <td colSpan='3'>
                                <td>Product Price : {item.product_price}</td>
                              </td>
                              <td colSpan='3'>
                                <td>
                                  Shipping Price: {item.shipping_price || 'NA'}
                                </td>
                              </td>
                            </tr>
                          ) : null}
                          {expand2 === item.orderId ? (
                            <tr key={9898989}>
                              <td></td>
                              <td colSpan='7'>
                                <th>Customer Details</th>
                                <tr>Name : {item.customer_name.name}</tr>
                                <tr>Email : {item.customer_name.email}</tr>
                                <tr>Phone : {item.customer_name.phone}</tr>
                                <tr>Address : {item.customer_name.address}</tr>
                                <tr>
                                  City : {item.customer_name.city}
                                  {item.customer_name.zip}
                                </tr>
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

export default SupplierList;
