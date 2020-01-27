/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useState,useEffect} from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import Card from "../components/Card/Card.jsx";

const SupplierList = () => {

const [suppliers, setSuppliers] = useState([])


useEffect(()=>{
  getSupplierData();
},[])

const getSupplierData = () =>{

  axios.
  get('/shopify/')
  .then(list=>{
    console.log("api data", list)
    setSuppliers(list.data)
  })
}



    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Supplier List"
                category={"Total Suppliers :"+ suppliers.length}
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover size="sm">
                    <thead >
                      <tr>
                        <th>Id</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.supplier_id}</td>
                            <td>{item.email}</td>
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

}

export default SupplierList;
