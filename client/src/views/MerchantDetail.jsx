import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { NotificationManager } from 'react-notifications';
import Card from '../components/Card/Card.jsx';
import CustomButton from '../components/CustomButton/CustomButton';
import '../assets/css/supplierOrders.css';
import MerchantAccountDetail from './MerchantAccountDetail.jsx'


const MerchantDetail = () => {
  const token = localStorage.getItem('token');
  const decode = jwt_decode(token);

  const [expand, setExpand] = useState('');
  const [merchantList, setMerchantList] = useState([]);
  const [fulfill, setFulfill] = useState('');
  const [orderDetail, setOrderDetail]=useState("")

  useEffect(() => {
    getMerchant();
  }, []);


  const getMerchant = async () => {
    const res = await axios.get('/api/customMerchantDetail')
    setMerchantList(res.data)

    };


  //   const fulfilObject = await {
  //     fulfillment: {
  //       location_id: 35210428495,
  //       tracking_number: fulfill,
  //       notify_customer: true
  //     }
  //   };
  //   try {
  //     let res = await axios.post('/suppOrderFulfill/' + data.store + "/" + data.id, fulfilObject);
  //     if (res.data.includes('success')) {
  //       NotificationManager.success('Fulfilled Successfully');
  //     }
  //   } catch (error) {
  //     NotificationManager.error('Something unusual happened');
  //   }
  // };

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
                    {merchantList.map((item, key) => {
                      return (
                        <>
                          <tr
                            key={key}

                          >
                            <td>{item.firstName || 'NA'} {item.lastName || ''}</td>
                            <td>{item.email || 'NA'}</td>
                            <td>{item.joiningDate || 'NA'}</td>
                            <td>{item.plan || 'NA'}</td>
                            <td>{item.count || 'NA'}</td>
                            <td>&#x24; {item.price || 'NA'}</td>
                            <td><a href={'/admin/merchant/'+item.id}>View More</a></td>
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
