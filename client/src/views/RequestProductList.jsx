import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { NotificationManager } from 'react-notifications';
import Card from '../components/Card/Card.jsx';
import CustomButton from '../components/CustomButton/CustomButton';
import '../assets/css/supplierOrders.css';

const RequestProductList = () => {
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    getMerchant();
  }, []);

  const getMerchant = async () => {
    const res = await axios.get('/api/getRequestProduct');
    setRequestList(res.data);
    console.log(res.data);
  };

  return (
    <div className='content'>
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title='Merchant List'
              category={'Total Merchant :' + requestList.length}
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table hover size='sm'>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Merchant Id</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestList.map((item, key) => {
                      return (
                        <>
                          <tr
                            key={key}
                            >
                            <td>
                              {key+1}
                            </td>
                            <td>{item.merchantId || 'NA'}</td>
                            <td>{item.date || 'NA'}</td>
                            <td>{item.name || 'NA'}</td>
                            <td>{item.description || 'NA'}</td>
                            <td><a href={item.link}>{item.link}</a></td>

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

export default RequestProductList;
