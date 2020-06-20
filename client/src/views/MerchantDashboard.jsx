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
import React, { Component, useEffect, useState } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col, Table } from 'react-bootstrap';

import { Card } from '../components/Card/Card.jsx';
import { StatsCard } from '../components/StatsCard/StatsCard.jsx';
import { Tasks } from '../components/Tasks/Tasks.jsx';
import jwt_decode from 'jwt-decode';

import {
	dataPie,
	legendPie,
	dataSales,
	optionsSales,
	responsiveSales,
	legendSales,
	dataBar,
	optionsBar,
	responsiveBar,
	legendBar
} from '../variables/Variables.jsx';

import axios from 'axios';

const MerchantDashboard = () => {
	const [ productCount, setProductCount ] = useState('');
	const [ revenue, setRevenue ] = useState('');
	const [ order, setOrder ] = useState('');
	const [ graphPlot, setGraphPlot ] = useState({});
	const [ topProducts, setTopProducts ] = useState([]);

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
		axios.get('/merchantDasboardGraph/' + decode.store).then((response) => {
			let data = {
				labels: response.data.date,
				series: [ response.data.revenue ]
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
		<h2 className="text-center">Welcome Back</h2>
		<br/>
		<p className="text-center">Lets see what happened while you are away.</p>
		<br/>
		<div className='content'>
			<Grid fluid>
				<Row>
					<Col md={8}>
						<Card
							statsIcon='fa fa-history'
							id='chartHours'
							title='Revenue Chart'
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


				</Row>

			</Grid>
		</div>
		</div>
	);
};

export default MerchantDashboard;
