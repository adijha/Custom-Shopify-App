import React from 'react';
import './App.css';
import axios from 'axios';

function App() {
	const getdata = (params) => {
		axios
			.get('/customers')
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className='App'>
			<div className='login-btn' onClick={getdata}>
				get data
			</div>
		</div>
	);
}

export default App;
