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
import React, { Component, useEffect, useState } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "../components/Card/Card.jsx";
import { StatsCard } from "../components/StatsCard/StatsCard.jsx";
import { Tasks } from "../components/Tasks/Tasks.jsx";
import jwt_decode from 'jwt-decode';

import {
  dataPie,
  legendPie,

  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "../variables/Variables.jsx";

import axios from 'axios';

 const SupplierDashboard = ()=>{
   const [productCount, setProductCount]=useState("")
   const [revenue, setRevenue]= useState("")

   const token = localStorage.getItem("token")
   const decode = jwt_decode(token);


   useEffect(()=>{
     getProductData()
     income()
   },[])

   const getProductData = () =>{
     axios.
     get('/api/supplier/product/'+decode.id)
     .then(products=>{
       console.log(products.data.length);
       setProductCount(products.data.length)
     })
   }

   const income = ()=>{
     axios.get('/supplierRevenue/'+decode.id)
     .then(rev=>{
       setRevenue(rev.data)
     })
   }


    return (
      <div>
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Total Products"
                statsValue={productCount}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Total Revenue"
                statsValue= {revenue}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>

            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-user text-info" />}
                statsText="Total Orders"
                statsValue="Text"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          {/*
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Total Revenue"
                category="24 Hours performance"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={graphPlot}
                      type="Bar"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }

              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Revenue by category"
                category="District Wise"
                stats="Campaign sent 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={piePlot} type="Pie" />
                  </div>
                }

              />
            </Col>
          </Row>


          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row>
            */}
        </Grid>
      </div>
      </div>
    );

}

export default SupplierDashboard;
