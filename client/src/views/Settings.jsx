import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Modal from 'react-responsive-modal';
import '../assets/css/settings.css';
import { NotificationManager } from 'react-notifications'
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

			// console.log(res.data);
			setEmail(res.data.email)
			setId(res.data.supplier_id)
			setName(res.data.name)
			setLocation(res.data.location)
			// NotificationManager.error('user.alreadyExist')
		});
	};


	const updateSettings = async (e) => {
		e.preventDefault();

		try {
			let res = await axios
				.post('/settingsUpdate', { location, name, id })
			NotificationManager.success('Settings Updated Successfully')
		} catch (error) {
			NotificationManager.error('something unusual happened')
			console.error(error)
		}




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
