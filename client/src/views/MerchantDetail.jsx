import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { NotificationManager } from 'react-notifications';
import Card from '../components/Card/Card.jsx';
import CustomButton from '../components/CustomButton/CustomButton';
import '../assets/css/supplierOrders.css';
import MerchantAccountDetail from './MerchantAccountDetail.jsx';
import moment from 'moment'
const MerchantDetail = () => {
  const [expand, setExpand] = useState('');
  const [merchantList, setMerchantList] = useState([]);
  const [fulfill, setFulfill] = useState('');
  const [orderDetail, setOrderDetail] = useState('');
  const [found, setFound] = useState('')

  useEffect(() => {
    getMerchant();
  }, []);

  const getMerchant = async () => {
    const res = await axios.get('/api/customMerchantDetail');
    res.data.sort((a,b)=> new Date(b.joiningDate)-new Date(a.joiningDate))
    if (res.data.length===0) {
      setFound("No Data Found")
    }
    else{
      setMerchantList(res.data);
      console.log(res.data);
      
    }

  };

  return (
    <div className='content'>
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title='Merchant List'
              category={'Total Merchant :' + merchantList.length}
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table hover size='sm'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Date of Joining</th>
                      <th>Current Plan</th>
                      <th>Total No. of Orders</th>
                      <th>Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>{found}</tr>
                    {merchantList.map((item, key) => {
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
                            <td>
                              {item.firstName || 'NA'} {item.lastName || ''}
                            </td>
                            <td>{item.email || 'NA'}</td>
                            <td>{moment(item.joiningDate).format("DD-MM-YYYY") || 'NA'}</td>
                            <td>{item.plan || 'NA'}</td>
                            <td>{item.count || 'NA'}</td>
                            <td>&#x24; {`${(new Intl.NumberFormat("en-US").format(item.price))}`|| 'NA'}</td>
                            <td>
                              <a href={'/admin/merchant/' + item.id}>
                                View More
                              </a>
                            </td>
                          </tr>
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

export default MerchantDetail;
