import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import Card from '../components/Card/Card.jsx';
import CsvDownloader from 'react-csv-downloader';
import moment from 'moment';
const SupplierList = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      name: 'Aditya Jha',
      email: 'mail@adijha.com',
      revenue: '160$',
      lastWeek: '130$',
      totalAmountPaid: '10$',
      totalDue: '20$',
      totalPayments: '50$',
    },
    {
      id: 2,
      name: 'Adi Jha',
      email: 'mal@adijha.com',
      revenue: '60$',
      lastWeek: '10$',
      totalAmountPaid: '9$',
      totalDue: '12$',
      totalPayments: '15$',
    },
    {
      id: 1,
      name: 'Atya Jha',
      email: 'mail@adia.com',
      revenue: '10$',
      lastWeek: '30$',
      totalAmountPaid: '0$',
      totalDue: '2$',
      totalPayments: '5$',
    },
  ]);
  const [expand, setExpand] = useState('');
  const [startDate, setStartDate] = useState(
    moment('01-01-2019').format('Y-MM-DD')
  );
  const [endDate, setEndDate] = useState(moment().format('Y-MM-DD'));
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    // getPaymentsData();
  }, []);

  const getPaymentsData = async () => {
    axios.get('/api/customOrderDetails').then((res) => {
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
  const markAsPaid = async () => {
    console.log(amount, id, method);
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
                            <td style={{ width: '20%' }}>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.revenue}</td>
                            <td>{item.lastWeek}</td>
                            <td>{item.totalAmountPaid}</td>
                            <td>{item.totalDue}</td>
                            <td>${item.totalPayments}</td>
                          </tr>

                          {expand === item.email ? (
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
                                      <option value='paypal'>Paypal</option>
                                      <option value='transferwise'>
                                        Transferwise
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
                                    onClick={() => markAsPaid()}
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
