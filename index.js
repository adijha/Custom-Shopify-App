require('dotenv').config();

const path = require('path');

const express = require('express');

const colors = require('colors');
const mongoose = require('mongoose');
const app = express();

// db
const connectDB = require('./connectDB');

connectDB();

const supplierRoute = require('./routes/supplier');

// middlewares
app.use(express.json());

app.use('/supplier', supplierRoute);

app.get('/', (req, res) => {
	res.send('We are on home page');
});

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
