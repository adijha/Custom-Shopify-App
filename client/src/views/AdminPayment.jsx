import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import Card from '../components/Card/Card.jsx';
import CsvDownloader from 'react-csv-downloader';
import { NotificationManager } from 'react-notifications';

import moment from 'moment';
const SupplierList = () => {
  const [payments, setPayments] = useState([]);
  const [expand, setExpand] = useState('');
  const [startDate, setStartDate] = useState(
    moment('01-01-2019').format('Y-MM-DD')
  );
  const [endDate, setEndDate] = useState(moment().format('Y-MM-DD'));
  const [amount, setAmount] = useState('0');
  const [method, setMethod] = useState('');
  const [id, setId] = useState('');
  const [transData, setTransdata] = useState([])


  useEffect(() => {
     getPaymentsData();
     getTransactionDetail()
  }, []);

  const getPaymentsData = async () => {
    axios.get('/api/adminPaymentSupplier').then((res) => {
      setPayments(res.data);
      // console.log(res.data);
    });
  };
  const sortByDate = () => {
    let newOrders = [];
    payments.forEach((order) => {
      if (
        moment(order.order_date).format('Y-MM-DD') >= startDate &&
        moment(order.order_date).format('Y-MM-DD') <= endDate
      ) {
        newOrders.push(order);
      }
    });
    setPayments(newOrders);
  };


  const markAsPaid = async (item) => {
    let d = moment().format('DD-MM-YY')
    let t = moment().format('h:mm:ss')
    let obj={
      supplier_id: item.id,
      trans_id: id,
      pmethod:method,
      amount_paid:amount,
      date:d,
      time:t
    }

    if (!item.amount) {
      if (parseInt(amount)>parseInt(item.revenue)) {
        console.log("if if cond", parseInt(amount), parseInt(item.revenue));

         NotificationManager.error('Entered paid amount is higher than dues');

      }
    }
    else if (parseInt(amount)+parseInt(item.amount)>parseInt(item.revenue)) {
      console.log("else if cond", parseInt(amount)+parseInt(item.amount), parseInt(item.revenue));

       NotificationManager.error('Total paid amount is higher than dues');

    } else if (parseInt(amount)+parseInt(item.amount)<parseInt(item.revenue)){
    await axios.post('/api/transactionDetail', obj)
    .then(res=>{
      try{
      if (res.data.includes('success')) {
        axios.get('/api/adminPaymentSupplier').then((res) => {
          setPayments(res.data);
          NotificationManager.success('Transaction Updated Successfully');
          // console.log(res.data);
        });
      }
    } catch (error) {
      NotificationManager.error('Something unusual happened');
    }
    })
  }
  };


  const getTransactionDetail =async ()=>{

  }

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
            <h5 style={{ marginTop: 15, color: 'white' }}>Show Payments</h5>
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
            datas={payments}
          >
            <h5 style={{ marginTop: 15, color: 'white' }}>Download CSV</h5>
          </CsvDownloader>
        </div>
      </div>
      <br/>
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
                      <th>id</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Total Revenue</th>
                      <th>Last Week Sales</th>
                      <th>Total Amount Paid</th>
                      <th>Total Due</th>
                      <th>Total Payments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((item, key) => {
                      return (
                        <>
                          <tr
                            key={key}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              expand ? setExpand('') : setExpand(item.email);
                            }}
                          >
                            <td>{key + 1}</td>
                            <td style={{ width: '20%' }}>{item.name||'NA'}</td>
                            <td>{item.email}</td>
                            <td>${item.revenue}</td>
                            <td>${item.lastWeek||0}</td>
                            <td>${item.amount || 0}</td>
                            <td>${item.revenue-(item.amount||0)}</td>
                            <td>${item.amount || 0}</td>
                          </tr>

                          {(expand === item.email && item.revenue!=0) ? (
                            <>
                              <tr key={9898989}>
                                <td></td>
                                <td colSpan='2' style={{ textAlign: 'left' }}>
                                  <div>
                                    Amount :
                                    <input
                                      required
                                      placeholder='in dollar'
                                      className=' border focus:outline-none text-sm  rounded-full w-full p-0 px-3 text-grey-darker'
                                      type='text'
                                      required
                                      value={amount}
                                      onChange={(e) =>
                                        setAmount(e.target.value)
                                      }
                                      style={{
                                        height: 45,
                                        marginLeft: '20px',
                                        width: 100,
                                      }}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      marginTop: 20,
                                      alignItems: 'center',
                                    }}
                                  >
                                    <p>Payments Method :</p>
                                    <select
                                      style={{
                                        marginLeft: 13,
                                        height: 45,
                                        color: 'grey',
                                        borderColor: '#999999',
                                      }}
                                      name='payments'
                                      id='payments'
                                      onChange={(e) =>
                                        setMethod(e.target.value)
                                      }
                                    >
                                      <option value=''>select mode</option>
                                      <option value='transferwise'>
                                        Transferwise
                                      </option>
                                      <option value='paypal'>
                                        Paypal
                                      </option>
                                    </select>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      marginTop: 20,
                                      alignItems: 'center',
                                    }}
                                  >
                                    <p>Transaction Id :</p>
                                    <input
                                      required
                                      className=' border focus:outline-none text-sm  rounded-full w-full p-0 px-3 text-grey-darker'
                                      id='date'
                                      type='text'
                                      required
                                      value={id}
                                      onChange={(e) => setId(e.target.value)}
                                      style={{
                                        height: 45,
                                        marginLeft: '20px',
                                        width: 100,
                                      }}
                                    />
                                  </div>
                                </td>

                                <td colSpan='2'>
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
                                    onClick={() => markAsPaid(item)}
                                  >
                                    <h5
                                      style={{ marginTop: 15, color: 'white' }}
                                    >
                                      Mark as Paid
                                    </h5>
                                  </div>
                                </td>
                                <td colSpan='3'></td>
                              </tr>
                            </>
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
