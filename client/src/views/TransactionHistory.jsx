import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import Card from '../components/Card/Card.jsx';
import moment from 'moment';
const SupplierList = () => {
  const [history, setHistory] = useState([]);
  const [context, setContext] = useState('supplier');
  useEffect(() => {
    getSupplierData();
  }, []);

  const getSupplierData = async () => {
    axios.get('/api/getTransaction').then((res) => {
      setHistory(res.data);
      // console.log(res.data);
    });
  };
  const getMerchantData = async () => {
    // axios.get('/api/getTransaction').then((res) => {
    //   // setHistory(res.data);
    //   console.log(res.data);
    // });
    setHistory([
      {
        amount_paid: 'no data',
        date: 'no data',
        transactionType: 'no data',
        merchant_id: 'no data',
        time: 'no data',
        trans_id: 'no data',
      },
    ]);
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
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'center',
            backgroundColor: 'grey',
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
            onClick={() => {
              setContext('supplier');
              getSupplierData();
            }}
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
            onClick={() => {
              setContext('merchant');
              getMerchantData();
            }}
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
                      <th>Date</th>
                      <th>Time</th>
                      <th>
                        {context === 'supplier'
                          ? 'Payment Method'
                          : 'Transaction Type'}
                      </th>
                      <th>Amount</th>
                      <th>Transaction Id</th>
                      <th>
                        {context === 'supplier' ? 'Supplier Id' : 'Merchant Id'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td style={{ width: '20%' }}>{item.date}</td>
                          <td>{item.time}</td>
                          <td>
                            {context === 'supplier'
                              ? item.pmethod
                              : item.transactionType}
                          </td>
                          <td>${item.amount_paid}</td>
                          <td>{item.trans_id}</td>
                          <td>
                            {context === 'supplier'
                              ? item.supplier_id
                              : item.merchant_id}
                          </td>
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
  );
};

export default SupplierList;
