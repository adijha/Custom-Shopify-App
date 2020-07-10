import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { NotificationManager } from 'react-notifications';
import Card from '../components/Card/Card.jsx';
import CustomButton from '../components/CustomButton/CustomButton';
import '../assets/css/supplierOrders.css';


const MerchantAccountDetail = (props) => {
  const token = localStorage.getItem('token');
  const decode = jwt_decode(token);

  const [expand, setExpand] = useState('');
  const [detail, setDetail] = useState([]);
  const [store, setStore] = useState("")
  const [fulfill, setFulfill] = useState('');
  const [orderDetail, setOrderDetail] = useState([])
  const [found , setFound] = useState('')
  let merchantId = props.match.params.id;

  useEffect(() => {
    getMerchant();
  }, []);

  const getMerchant =  async() => {
    let merchantId = props.match.params.id;

  const data = await axios.get('/api/merchant/'+merchantId)
    setDetail(data.data)
    console.log(data.data, "data");
  const fetchOrder =  await axios.get('/api/merchantOrderDetail/'+data.data[0].store.toLowerCase())
  if (fetchOrder.length!==0) {
    setOrderDetail(fetchOrder.data)
    console.log(fetchOrder);
  }
  else{
    setFound("No Order Found")
  }

};


  return (
    <div>
    <div className="">
           <h4 className="text-center">Merchant Profile Info</h4>
          {detail.map((item, i)=>{
            return(
              <div>
                <ul>
                <li className="Mdetail">Name: {item.first||'NA'} {item.lastName||''}</li>
                <li className="Mdetail">Email: {item.email}</li>
                <li className="Mdetail">Phone No.: {item.phone ||'NA'}</li>
                <li className="Mdetail">Store Link: <a href={`https://${item.store}.myshopify.com`} target="_blank">{`${item.store}.myshopify.com` ||'NA'}</a></li>

                </ul>
              </div>
          )}
        )}
    </div>
    <div className='content'>
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
            title="order Details"
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table hover size='sm'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Order</th>
                      <th>Revenue</th>

                    </tr>
                  </thead>
                  <tbody>
                  <tr className="text-center">{found}</tr>
                    {orderDetail.map((od, key) => {
                      return (
                        <>
                          <tr
                            key={key}

                          >
                            <td>{od.name || 'NA'}</td>
                            <td>{od.sku || 'NA'}</td>
                            <td>{od.count || 'NA'}</td>
                            <td>&#x24; {od.price || 'NA'}</td>
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
    </div>
  );
};

export default MerchantAccountDetail;
