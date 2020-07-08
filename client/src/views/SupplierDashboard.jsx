import React, { useEffect, useState } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col, Table } from 'react-bootstrap';

import { Card } from '../components/Card/Card.jsx';
import { StatsCard } from '../components/StatsCard/StatsCard.jsx';
import jwt_decode from 'jwt-decode';

import {
  optionsSales,
  responsiveSales,
} from '../variables/Variables.jsx';

import axios from 'axios';

const SupplierDashboard = () => {
  const [productCount, setProductCount] = useState('');
  const [revenue, setRevenue] = useState('');
  const [order, setOrder] = useState('');
  const [graphPlot, setGraphPlot] = useState({});
  const [topProducts, setTopProducts] = useState([]);

  const token = localStorage.getItem('token');
  const decode = jwt_decode(token);

  useEffect(() => {
    getProductData();
    income();
    totalOrders();
    graphData();
    top();
  }, []);

  const getProductData = () => {
    axios.get('/api/supplier/product/' + decode.id).then((products) => {
      console.log(products.data.length);
      setProductCount(products.data.length);
    });
  };

  const income = () => {
    axios.get('/supplierRevenue/' + decode.id).then((rev) => {
      setRevenue(rev.data);
    });
  };

  const totalOrders = () => {
    axios.get('/supplierOrders/' + decode.id).then((ord) => {
      console.log('orders are', ord.data);
      setOrder(ord.data);
    });
  };

  const graphData = () => {
    axios.get('/supplierGraphRevenue/' + decode.id).then((response) => {
      let data = {
        labels: response.data.date,
        series: [response.data.revenue],
      };
      setGraphPlot(data);
    });
  };

  const top = () => {
    axios.get('/topProducts/' + decode.id).then((response) => {
      setTopProducts(response.data);
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
                statsText='Total Products'
                statsValue={productCount}
                statsIcon={<i className='fa fa-refresh' />}
                statsIconText='Updated now'
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className='pe-7s-wallet text-success' />}
                statsText='Total Revenue'
                statsValue={
                  revenue
                    ? `$ ${new Intl.NumberFormat('en-US').format(
                        Number(revenue).toFixed(2)
                      )}`
                    : ' '
                }
                statsIcon={<i className='fa fa-calendar-o' />}
                statsIconText='Last day'
              />
            </Col>

            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className='fa fa-user text-info' />}
                statsText='Total Orders'
                statsValue={order}
                statsIcon={<i className='fa fa-refresh' />}
                statsIconText='Updated now'
              />
            </Col>
          </Row>

          <Row>
            <Col md={7}>
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
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
              />
            </Col>

            <Col md={5}>
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
                      {topProducts.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.sku}</td>
                            <td>{item.name}</td>
                            <td>
                              $
                              {new Intl.NumberFormat('en-US').format(
                                Number(item.price).toFixed(2)
                              )}
                            </td>

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
};

export default SupplierDashboard;
