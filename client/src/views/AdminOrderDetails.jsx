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
          justifyContent: 'space-between',
          marginTop: '-20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 18 }}>
          <input
            required
            className=' border focus:outline-none text-sm  rounded-full w-full p-0 px-3 text-grey-darker'
            id='date'
            type='date'
            required
            placeholder='Start from'
            autoComplete='bday-day'
            max={new Date()}
            min={new Date('20-02-2019')}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ height: 45 }}
          />

          <input
            required
            placeholder='To date'
            className=' border focus:outline-none text-sm  rounded-full w-full p-0 px-3 text-grey-darker'
            id='date'
            type='date'
            required
            autoComplete='bday-day'
            max={new Date()}
            min={new Date('20-02-2019')}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              height: 45,
              marginLeft: '20px',
            }}
          />
          <div
            style={{
              backgroundColor: 'grey',
              width: '140px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              marginLeft: '20px',
              cursor: 'pointer',
            }}
            onClick={() => sortByDate()}
          >
            Get Orders
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'grey',
            width: '140px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            marginRight: '18px',
          }}
        >
          <CsvDownloader
            filename='AdminOrderDetails'
            separator=','
            wrapColumnChar="'"
            datas={orders}
          >
            <h5 style={{ marginTop: 15 }}>Download CSV</h5>
          </CsvDownloader>
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
                              {item.customer.name}
                            </td>
                            <td>{item.sku}</td>
                            <td>{item.total_price}</td>
                          </tr>

                          {expand === item.orderId ? (
                            <tr key={9898989}>
                              <td></td>
                              <td colSpan='3'>
                                <td>Product Price : {item.product_price}</td>
                              </td>
                              <td colSpan='3'>
                                <td>Shipping Price: {item.shipping_price}</td>
                              </td>
                            </tr>
                          ) : null}
                          {expand2 === item.orderId ? (
                            <tr key={9898989}>
                              <td></td>
                              <td colSpan='7'>
                                <th>Customer Details</th>
                                <tr>Name : {item.customer.name}</tr>
                                <tr>Email : {item.customer.email}</tr>
                                <tr>Phone : {item.customer.phone}</tr>
                                <tr>Address : {item.customer.address}</tr>
                                <tr>
                                  City : {item.customer.city}
                                  {item.customer.zip}
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
