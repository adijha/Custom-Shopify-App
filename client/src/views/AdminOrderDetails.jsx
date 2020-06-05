import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import Card from '../components/Card/Card.jsx';
import CsvDownloader from 'react-csv-downloader';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [expand, setExpand] = useState('');
  const [expand2, setExpand2] = useState('');

  useEffect(() => {
    getSupplierData();
  }, []);

  const getSupplierData = async () => {
    axios.get('/api/customOrderDetails').then((res) => {
      setSuppliers(res.data);
      // console.log(res.data);
    });
  };
  return (
    <div className='content'>
      <div
        style={{
          textAlign: 'right',
          alignSelf: 'right',
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '-20px',
        }}
      >
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
            marginBottom: '10px',
          }}
        >
          <CsvDownloader
            filename='AdminOrderDetails'
            separator=','
            wrapColumnChar="'"
            datas={suppliers}
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
                    {suppliers.map((item, key) => {
                      return (
                        <>
                          <tr key={key}>
                            <td>{key + 1}</td>
                            <td style={{ width: '15%' }}>
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
                              {item.customer_name}
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
                                <td>Customer Name : {item.customer_name}</td>
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
