import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Modal from 'react-responsive-modal';
import '../assets/css/settings.css';

import Card from '../components/Card/Card.jsx';
import CustomButton from '../components/CustomButton/CustomButton';

const SupplierOrders = () => {
	const [name, setName] = useState('');
	const [location, setLocation] = useState('');
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState('');

	const token = localStorage.getItem('token');
	const decode = jwt_decode(token);
	useEffect(() => {
		getSupplierProfile();
		setId(decode.id)
	}, []);

	const getSupplierProfile = () => {
		axios.get('/supplierProfile' + decode.id).then((res) => {
			console.log(res.data);

		});



		// axios.get('/stateOrderGraph')
		// 	.then(response => {
		// 		let data = {
		// 			labels: response.data.state,
		// 			series: [response.data.order]
		// 		}
		// 		console.log({ data })

		// 	})

	};

	const updateSettings = (e) => {
		e.preventDefault();

		const data = new FormData();
		data.append('supplier_id', decode.id);
		data.append('name', name);
		// data.append('id', id);
		data.append('email', email);
		data.append('location', location);
		data.append('password', password);

		console.log('data', data);
		axios
			.post('/api/settings', data)
			.then((item) => {
				if (item) {
					console.log(item.config);
					setStatus('Settings Updated Successfully');
				}
			})
			.catch((err) => {
				console.log('add product error is:', err.message);
			});
	};

	return (
		<div className='content'>
			<Grid fluid>
				<Row>
					<Col md={12}>
						<Card
							title='Accounts Settings'
							ctTableFullWidth
							ctTableResponsive
							content={
								<form onSubmit={updateSettings}>
									<div className='status text-center'>{status}</div>
									<div className='card card-input' style={{ marginTop: 30 }}>
										<div className='form-group'>
											<label for='product_email'>Email</label>
											<input
												type='email'
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className='form-control'
												id='product_email'
												placeholder='example@any.com'
												disabled="disabled"
											/>

										</div>
										<div className='form-group'>
											<label for='product_quantity'>Supplier ID</label>
											<input
												type='text'
												value={id}
												onChange={(e) => setId(e.target.value)}
												min='0'
												className='form-control'
												id='product_id'
												placeholder='@id'
												disabled="disabled"
											/>
										</div>
										<div className='form-group'>
											<label for='product_name'>Full Name</label>
											<input
												type='text'
												value={name}
												onChange={(e) => setName(e.target.value)}
												min='0'
												className='form-control'
												id='product_name'
												placeholder='Your Name'
												required
											/>
										</div>
										<div className='form-group'>
											<label for='product_location'>Location</label>

											<input
												type='text'
												value={location}
												onChange={(e) => setLocation(e.target.value)}
												min='0'
												className='form-control'
												id='product_location'
												placeholder='Short Address'
											/>
										</div>
										{/* <div className='form-group'>
											<label for='product_password'>Password</label>
											<input
												type='password'
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												className='form-control'
												id='product_password'
												placeholder='******'
											/>
										</div> */}
										<CustomButton round fill type='submit' name='button'>
											Update Profile
										</CustomButton>
									</div>
								</form>
							}
						/>
					</Col>
				</Row>
			</Grid>
		</div>
	);
};

export default SupplierOrders;
