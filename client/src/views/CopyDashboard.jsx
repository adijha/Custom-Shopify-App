import React, { Component, useEffect, useState } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col, Table } from 'react-bootstrap';

import { Card } from '../components/Card/Card.jsx';
import { StatsCard } from '../components/StatsCard/StatsCard.jsx';
import { Tasks } from '../components/Tasks/Tasks.jsx';
import {
  dataPie,
  legendPie,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar,
} from '../variables/Variables.jsx';

import axios from 'axios';

const CopyDashboard = () => {
  const [count, setCount] = useState('');
  const [revenue, setRevenue] = useState('');
  const [graphPlot, setGraphPlot] = useState({});
  const [piePlot, setPiePlot] = useState({});
  const [mCount, setMCount] = useState('');
  const [categoryPie, setCategoryPie] = useState({});
  const [orderCount, setOrderCount] = useState({});
  const [stateOrder, setStateOrder] = useState({});
  const [sellingProducts, setSellingProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    fetchData();
    revenueData();
    fetchingRevenueGraph();
    fetchingRevenuePie();
    merchantCount();
    fetchingCategoryRevenue();
    getOrderCount();
    stateCountOrder();
    topProducts();
    getCategory();
  }, []);
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

  const getCategory = () => {
    axios.get('/api/totalCategory').then((data) => {
      console.log('category list is', data.data);
      setCategoryList(data.data);
    });
  };

  const fetchData = () => {
    axios.get('/ordersData').then((data) => {
      setCount(data.data);
      console.log(data);
    });
  };

  const revenueData = () => {
    axios.get('/revenue').then((da) => {
      console.log('revenue', da.data);
      setRevenue(da.data.toFixed(2));
    });
  };

  const merchantCount = () => {
    axios.get('/api/merchant').then((data) => {
      console.log('merchant count', data.data.length);
      setMCount(data.data.length);
    });
  };

  const fetchingRevenueGraph = () => {
    axios.get('/newTimeGraph').then((response) => {
      var data = {
        labels: response.data.date,
        series: [response.data.price],
      };
      //console.log(newDataSales);
      setGraphPlot(data);

      let highValue = response.data.price.reduce((a, b) => a + b, 0);
      console.log(~~highValue, 'highValue');

      //console.log(datasales);
    });
  };

  const fetchingRevenuePie = () => {
    axios.get('/statePie').then((response) => {
      var data = {
        labels: response.data.state,
        series: response.data.price,
      };
      console.log('pie chart data', data);
      setPiePlot(data);
      //console.log(datasales);
    });
  };

  const fetchingCategoryRevenue = () => {
    axios.get('/categoryRevenue').then((response) => {
      var data = {
        labels: response.data.category,
        series: response.data.revenue,
      };
      setCategoryPie(data);

      console.log('Category wise Pie chart', data);
    });
  };

  var optionsGraphPlot = {
    high: 100000,
    low: 10,
    axisX: {
      labelInterpolationFnc: function (value, index) {
        return index % 1 === 0 ? value : null;
      },
    },
  };

  var orderCountGraphPlot = {
    high: 40,
    low: 0,
    axisX: {
      labelInterpolationFnc: function (value, index) {
        return index % 1 === 0 ? value : null;
      },
    },
  };

  var stateOrderCountGraphPlot = {
    high: 90,
    low: 0,
    axisX: {
      labelInterpolationFnc: function (value, index) {
        return index % 1 === 0 ? value : null;
      },
    },
  };

  const getOrderCount = () => {
    axios.get('/orderTime').then((response) => {
      let data = {
        labels: response.data.date,
        series: [response.data.orders],
      };
      setOrderCount(data);
    });
  };

  const stateCountOrder = () => {
    axios.get('/stateOrderGraph').then((response) => {
      let data = {
        labels: response.data.state,
        series: [response.data.order],
      };
      setStateOrder(data);
    });
  };

  const topProducts = () => {
    axios.get('/topSelling').then((response) => {
      setSellingProducts(response.data);
    });
  };

  return (
    <div>
      <div className='content'>
        <Grid fluid>
          <Row>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className='pe-7s-server text-warning' />}
                statsText='Total Orders'
                statsValue={count}
                statsIcon={<i className='fa fa-refresh' />}
                statsIconText='Updated now'
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className='pe-7s-wallet text-success' />}
                statsText='Revenue'
                statsValue={`$ ${
                  revenue
                    ? new Intl.NumberFormat('en-US').format(
                        parseFloat(revenue).toFixed(2)
                      )
                    : ""
                }`}
                statsIcon={<i className='fa fa-calendar-o' />}
                statsIconText='Last day'
              />
            </Col>

            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className='fa fa-user text-info' />}
                statsText='Merchants'
                statsValue={mCount}
                statsIcon={<i className='fa fa-refresh' />}
                statsIconText='Updated now'
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon='fa fa-history'
                id='chartHours'
                title='Total Revenue'
                category='24 Hours performance'
                stats='Updated 3 minutes ago'
                content={
                  <div className='ct-chart'>
                    <ChartistGraph
                      data={graphPlot}
                      type='Bar'
                      options={optionsGraphPlot}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon='fa fa-clock-o'
                title='Revenue'
                category='State Wise'
                stats='Campaign sent 2 days ago'
                content={
                  <div
                    id='chartPreferences'
                    className='ct-chart ct-perfect-fourth'
                  >
                    <ChartistGraph data={piePlot} type='Pie' />
                  </div>
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Card
                statsIcon='fa fa-clock-o'
                title='Revenue by category'
                category='Category Wise'
                stats='Campaign sent 2 days ago'
                content={
                  <div
                    id='chartPreferences'
                    className='ct-chart ct-perfect-fourth'
                  >
                    <ChartistGraph data={categoryPie} type='Pie' />
                  </div>
                }
              />
            </Col>
            <Col md={8}>
              <Card
                statsIcon='fa fa-history'
                id='chartHours'
                title='Orders'
                category='Day Wise'
                stats='Updated 3 minutes ago'
                content={
                  <div className='ct-chart'>
                    <ChartistGraph
                      data={orderCount}
                      type='Line'
                      options={orderCountGraphPlot}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Card
                statsIcon='fa fa-history'
                id='chartHours'
                title='Orders'
                category='State Wise'
                stats='Updated 3 minutes ago'
                content={
                  <div className='ct-chart'>
                    <ChartistGraph
                      data={stateOrder}
                      type='Bar'
                      options={stateOrderCountGraphPlot}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Card
                title='Top Selling Products'
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover size='sm'>
                    <thead>
                      <tr>
                        <th>Sku</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Purchased in Nos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellingProducts.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.sku}</td>
                            <td>{item.name}</td>
                            <td>${item.price}</td>
                            <td>{item.count}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
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
};

export default CopyDashboard;
