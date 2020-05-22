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
  const [fulfill, setFulfill] = useState('');

  let merchantId = props.match.params.id;

  useEffect(() => {
    getMerchant();
  }, []);

  const getMerchant = () => {
    let merchantId = props.match.params.id;

    axios.get('/api/merchant/'+merchantId).then((res) => {
        console.log(res.data);
        setDetail(res.data)
    });

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
                </ul>
              </div>
          )}
        )}
    </div>

    </div>
  );
};

export default MerchantAccountDetail;
