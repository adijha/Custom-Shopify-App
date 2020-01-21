require('dotenv').config();

const path = require('path');

const express = require('express');
const session = require('express-session');
const colors = require('colors');
const mongoose = require('mongoose');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const forwardingAddress = 'https://cryptic-brushlands-45627.herokuapp.com'; // Replace this with your HTTPS Forwarding address

// db
const connectDB = require('./connectDB');

connectDB();

// middlewares
app.use(express.json());

app.get('/get', (req, res) => {
	res.send('hi there!');
});

app.get('/shopify', (req, res) => {
	scopes = [ 'write_customers', 'read_customers' ];

	console.log('install route call-->');
	const shop = req.query.shop;
	if (shop) {
		const state = nonce();
		const redirectUri = forwardingAddress + '/shopify/callback';
		const installUrl =
			'https://' +
			shop +
			'/admin/oauth/authorize?client_id=' +
			apiKey +
			'&scope=' +
			scopes +
			'&state=' +
			state +
			'&redirect_uri=' +
			redirectUri;

		res.cookie('state', state);

		res.redirect(installUrl);
	} else {
		return res
			.status(400)
			.send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
	}
});

//callback route -->
app.get('/shopify/callback', (req, res) => {
	console.log('callback route call -->');
	let { shop, hmac, code, state } = req.query;
	Gshop = shop;
	Ghmac = hmac;
	const stateCookie = cookie.parse(req.headers.cookie).state;

	if (state !== stateCookie) {
		return res.status(403).send('Request origin cannot be verified');
	}

	if (shop && hmac && code) {
		// DONE: Validate request is from Shopify
		const map = Object.assign({}, req.query);
		delete map['signature'];
		delete map['hmac'];
		const message = querystring.stringify(map);
		const providedHmac = Buffer.from(hmac, 'utf-8');
		const generatedHash = Buffer.from(crypto.createHmac('sha256', apiSecret).update(message).digest('hex'), 'utf-8');
		let hashEquals = false;

		try {
			hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
		} catch (e) {
			hashEquals = false;
		}

		if (!hashEquals) {
			return res.status(400).send('HMAC validation failed');
		}

		// DONE: Exchange temporary code for a permanent access token

		const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
		const accessTokenPayload = {
			client_id: apiKey,
			client_secret: apiSecret,
			code
		};
		request
			.post(accessTokenRequestUrl, { json: accessTokenPayload })
			.then((accessTokenResponse) => {
				accessToken = accessTokenResponse.access_token;
				res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

				// res.sendFile('index.html', { root: __dirname });
			})
			.catch((error) => {
				// res.sendFile("index.html");
				res.send(error);
				console.log('182-->', error);
			});

		// makeWebook();
	} else {
		res.status(400).send('Required parameters missing');
	}
});

app.get('/customers', async (req, res) => {
	// console.log(tokenRem);
	console.log(`${accessToken}, tokenRem`.brightMagenta);

	// console.log(Ghmac);
	console.log(`${Ghmac}, hmacREM`.brightMagenta);

	// console.log(Gshop);
	console.log(`${Gshop}, shopREM`.brightMagenta);

	// console.log(tokenRem, hmacRem, shopRem, 'vars'.cyan);
	let url = 'https://' + Gshop + '/admin/api/2019-10/customers/count.json';

	let options = {
		method: 'GET',
		url: url,
		json: true,
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Access-Token': accessToken,
			'X-Shopify-Hmac-Sha256': Ghmac,
			'X-Shopify-Shop-Domain': Gshop,
			'X-Shopify-API-Version': '2019-10'
		}
	};

	request(options)
		.then((resc) => {
			console.log(resc);
			res.send('good');
		})
		.catch((err) => {
			console.error(err);
			res.send('somehow good');
		});
});

const port = process.env.PORT || 8000;

// if (process.env.NODE_ENV === 'production') {
app.use(express.static('client/build'));
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
// }

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
