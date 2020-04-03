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

 const CopyDashboard = ()=>{
   const [count, setCount]=useState("")
   const [revenue, setRevenue] = useState("")
   const [graphPlot, setGraphPlot] = useState({});
   const [piePlot, setPiePlot] = useState({});
   const [mCount, setMCount] = useState("")
   const [categoryPie, setCategoryPie] = useState({})


   useEffect(()=>{
     fetchData();
     revenueData()
     fetchingRevenueGraph()
     fetchingRevenuePie()
     merchantCount()
     fetchingCategoryRevenue()
   },[])
  // createLegend(json) {
  //   var legend = [];
  //   for (var i = 0; i < json["names"].length; i++) {
  //     var type = "fa fa-circle text-" + json["types"][i];
  //     legend.push(<i className={type} key={i} />);
  //     legend.push(" ");
  //     legend.push(json["names"][i]);
  //   }
  //   return legend;
  // }

 const fetchData = ()=>{
  axios.get('/ordersData').
  then(data=>{
    setCount(data.data)
    console.log(data)
  })
}

const revenueData = ()=>{
  axios.get('/revenue')
  .then(da=>{
    console.log("revenue", da.data)
    setRevenue(da.data)
  })
}

const merchantCount = () =>{
  axios.get('/api/merchant')
  .then(data=>{
    console.log("merchant count", data.data.length)
    setMCount(data.data.length)

  })
}

const fetchingRevenueGraph = () =>{
  axios.get('/newTimeGraph')
  .then(response=>{
    var  data =  {
        labels: response.data.date,
        series: [response.data.price]
      };
    //console.log(newDataSales);
    setGraphPlot(data)

    let highValue = response.data.price.reduce((a, b)=>a+b, 0)
    console.log(~~highValue, "highValue");

    //console.log(datasales);
  })
}

const fetchingRevenuePie = () =>{
  axios.get('/statePie')
  .then(response=>{
    var  data =  {
        labels: response.data.state,
        series: response.data.price
      };
    console.log("pie chart data", data);
    setPiePlot(data)
    //console.log(datasales);
  })
}

const fetchingCategoryRevenue = () =>{
  axios.get('/categoryRevenue')
  .then(response=>{
    var data = {
      labels: response.data.category,
      series: response.data.revenue
    }
    setCategoryPie(data)

    console.log("Category wise Pie chart", data);
  })
}


var optionsGraphPlot = {
 high: 100000,
 low: 10,
 axisX: {
   labelInterpolationFnc: function(value, index) {
     return index % 2 === 0 ? value : null;
   }
 }
};

    return (
      <div>
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Total Orders"
                statsValue={count}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Revenue"
                statsValue= {revenue}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>

            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-user text-info" />}
                statsText="Merchants"
                statsValue={mCount}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
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
                      options={optionsGraphPlot}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }

              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Revenue"
                category="State Wise"
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
          <Col md={4}>
            <Card
              statsIcon="fa fa-clock-o"
              title="Revenue by category"
              category="Category Wise"
              stats="Campaign sent 2 days ago"
              content={
                <div
                  id="chartPreferences"
                  className="ct-chart ct-perfect-fourth"
                >
                  <ChartistGraph data={categoryPie} type="Pie" />
                </div>
              }

            />
          </Col>
        </Row>
          {/*

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

export default CopyDashboard;
