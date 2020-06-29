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
import moment from 'moment';
import { NotificationManager } from 'react-notifications';

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
	const [ revenue, setRevenue ] = useState('');
	const [ order, setOrder ] = useState('');
	const [ graphPlot, setGraphPlot ] = useState({});
	const [ topProducts, setTopProducts ] = useState([]);
	const [fulfilOrder, setFulfilOrder] = useState();
	const [startDate, setStartDate] = useState(
    moment('01-01-2019').format('Y-MM-DD')
  );
  const [endDate, setEndDate] = useState(moment().format('Y-MM-DD'));
	const token = localStorage.getItem('token');
	const decode = jwt_decode(token);

	useEffect(() => {
		getProductData();
		totalOrders();
		graphData();
		top();
	}, []);

	const getProductData = () => {
		let checkStore = decode.store.toLowerCase().toString();
    console.log("new value of store", checkStore);
		axios.get('/api/leftOrdermerchantShopify/' + checkStore).then((res) => {
			setFulfilOrder(res.data.length);
		});
	};


	const totalOrders = () => {
		let checkStore = decode.store.toLowerCase().toString();
    console.log("new value of store", checkStore);
		axios.get('/MerchantDashboardOrder/' + checkStore).then((ord) => {
			console.log('orders are', ord.data);
			setOrder(ord.data);
		});
	};

	const graphData = () => {
		let checkStore = decode.store.toLowerCase().toString();
    console.log("new value of store", checkStore);
		axios.get('/merchantDasboardGraph/' + checkStore).then((response) => {
			let data = {
				labels: response.data.date,
				series: [ response.data.revenue ]
			};
			let income = response.data.revenue.reduce((a,b)=>a+b, 0)
			setRevenue(income)
			setGraphPlot(data);
		});
	};



	const top = () => {
		let checkStore = decode.store.toLowerCase().toString();
    console.log("new value of store", checkStore);
		axios.get('/merchantTopProducts/' + checkStore).then((response) => {
			 setTopProducts(response.data);
			//console.log("top dashboard product", response.data);
		});
	};



	const sortByDate = async () => {
		let checkStore = decode.store.toLowerCase().toString();

		let dates={
			start: startDate,
			end: endDate
		}
		console.log({dates});
		await axios.get('/merchantDasboardRevenueGraphByDates/' + checkStore+'/'+ startDate+'/'+endDate).then((response) => {
			if (response.data.date.length!=0) {
				let data = {
					labels: response.data.date,
					series: [ response.data.revenue ]
				};
				setGraphPlot(data);
			}
			else {
				NotificationManager.error('No Revenue Found');

			}

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
					<div
		        style={{
		          textAlign: 'right',
		          alignSelf: 'right',
		          display: 'flex',
		          justifyContent: 'space-between',
		          marginTop: '-20px',
		        }}
		      >
		        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 18 }}>
		          <input
		            required
		            className=' border focus:outline-none text-sm  rounded-full w-full p-0 px-3 text-grey-darker'
		            id='date'
		            type='date'
		            required
		            placeholder='Start from'
		            autoComplete='bday-day'
		            max={new Date()}
		            min={new Date('20-02-2019')}
		            value={startDate}
		            onChange={(e) => setStartDate(e.target.value)}
		            style={{ height: 45 }}
		          />

		          <input
		            required
		            placeholder='To date'
		            className=' border focus:outline-none text-sm  rounded-full w-full p-0 px-3 text-grey-darker'
		            id='date'
		            type='date'
		            required
		            autoComplete='bday-day'
		            max={new Date()}
		            min={new Date('20-02-2019')}
		            value={endDate}
		            onChange={(e) => setEndDate(e.target.value)}
		            style={{
		              height: 45,
		              marginLeft: '20px',
		            }}
		          />
		          <div
		            style={{
		              backgroundColor: 'grey',
		              width: '140px',
		              height: '40px',
		              display: 'flex',
		              alignItems: 'center',
		              justifyContent: 'center',
		              borderRadius: 10,
		              marginLeft: '20px',
		              cursor: 'pointer',
		            }}
		            onClick={() => sortByDate()}
		          >
		            Get
		          </div>
		        </div>
						</div>
						<br/>
						<Card
							statsIcon='fa fa-history'
							id='chartHours'
							title='Revenue Chart'
							stats='Updated'
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
					<Col lg={4} sm={6}>
						<StatsCard
							bigIcon={<i className='fa fa-user text-info' />}
							statsText='Total Orders'
							statsValue={order}
							statsIcon={<i className='fa fa-refresh' />}
							statsIconText='Updated'
						/>
					</Col>
					<Col lg={4} sm={6}>
						<StatsCard
							bigIcon={<i className='fa fa-user text-info' />}
							statsText='Total Revenue'
							statsValue={revenue}
							statsIcon={<i className='fa fa-refresh' />}
							statsIconText='Updated'
						/>
					</Col>
					<Col lg={4} sm={6}>
						<StatsCard
							bigIcon={<i className='fa fa-user text-info' />}
							statsText='Orders Fulfill Left'
							statsValue={fulfilOrder}
							statsIcon={<i className='fa fa-refresh' />}
							statsIconText='Updated'
						/>
					</Col>
				</Row>

				<Row>
				<Card
					title='Top Selling Products'
					ctTableFullWidth
					ctTableResponsive
					content={
						<Table striped hover size='sm'>
							<thead>

							</thead>
							<tbody>
								{topProducts.map((item, key) => {
									return (
										<tr key={key}>
										<td style={{width:"100px"}}>{item.productImage.length!=0 ? (
											<img
												className='product-logo'
												src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`}
											/>
										) : (
											'No Image Available'
										)}</td>
											<td>{item.name}</td>
											<td>{item.sku}</td>
											<td>{item.count} Order</td>
											<td>${item.price}</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					}
				/>

				</Row>
			</Grid>
		</div>
		</div>
	);
};

export default MerchantDashboard;
