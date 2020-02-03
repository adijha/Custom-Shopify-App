const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');

//Import Route
const authRoute = require('./routes/auth');
const postroute = require('./routes/posts');

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));


//connect Db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
	console.log('Db is connected')
);

//Middleware
app.use(express.json());
//Route Middleware
app.use('/shopify', authRoute);
app.use('/shopify', postroute);

app.use(express.static('client/build'));
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'client', build, index.html));
});

app.listen(process.env.PORT || 5000, () => console.log('server is listening on 5000...'));
