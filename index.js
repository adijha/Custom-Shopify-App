const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cookie = require('cookie');
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const csv=require('csvtojson')
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'read_products, write_products';
const forwardingAddress = "https://282c8a59.ngrok.io";
let hmacc,tokenn;
let shop=`demo-mojito.myshopify.com`;

//Import Route
 const authRoute = require('./routes/auth');
// const postroute = require('./routes/posts');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));


//connect Db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
	console.log('Db is connected')
);

app.use(fileUpload({
  useTempFiles : true,
   tempFileDir : '/tmp/'
}));
//Middleware
app.use(express.json());
//Route Middleware
app.use('/api', authRoute);
//app.use('/shopify', postroute);

//Shopify Install route
app.get('/shopify', (req, res) => {
const shop = req.query.shop;
if (shop) {
	const state = nonce();
	const redirectUri = forwardingAddress + '/shopify/callback';
	const installUrl = 'https://' + shop +
		'/admin/oauth/authorize?client_id=' + apiKey +
		'&scope=' + scopes +
		'&state=' + state +
		'&redirect_uri=' + redirectUri;

	res.cookie('state', state);
	res.redirect(installUrl);
} else {
	return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
}
});


app.get('/shopify/callback', (req, res) => {
const { shop, hmac, code, state } = req.query;
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
	const generatedHash = Buffer.from(
		crypto
			.createHmac('sha256', apiSecret)
			.update(message)
			.digest('hex'),
			'utf-8'
		);
	let hashEquals = false;

	try {
		hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
	} catch (e) {
		hashEquals = false;
	};

	if (!hashEquals) {
		return res.status(400).send('HMAC validation failed');
	}

	// DONE: Exchange temporary code for a permanent access token
	const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
	const accessTokenPayload = {
		client_id: apiKey,
		client_secret: apiSecret,
		code,
	};
	request.post(accessTokenRequestUrl, { json: accessTokenPayload })
			.then((accessTokenResponse) => {
				tokenn = accessTokenResponse.access_token;
				hmacc = hmac;
		// tokenn = accessTokenResponse.access_token;
				//return postRequest(tokenn, hmacc, shop)
				const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/products.json';
				const shopRequestHeaders = {
					'X-Shopify-Access-Token': tokenn,
				};
				request.get('https://282c8a59.ngrok.io', {headers: shopRequestHeaders})
				.then((shopResponse) => {
							res.send(shopResponse);
						})
						.catch(error=>{
							console.log(error)
						})
						//return postRequest(tokenn, hmacc, shop)				//	return tokenn, hmac, shop;
				// DONE: Use access token to make API call to 'shop' endpoint

			})
			.catch((error) => {
				res.send(error);
			});

} else {
	res.status(400).send('Required parameters missing');
}
});

app.post('/addToShopify', (req, res)=>{
	  const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/products.json';
	  const shopRequestHeaders = {
	    'X-Shopify-Access-Token': tokenn,
	    'Content-Type': 'application/json',
	    'X-Shopify-Hmac-Sha256': hmacc,
	    'X-Shopify-Shop-Domain': shop,
	    'X-Shopify-API-Version': '2020-01'
	  };

request.post(shopRequestUrl, { headers: shopRequestHeaders, json:req.body})
	  .then((shopResponse) => {
	    res.send("product added")
	  })
	  .catch((error) => {
	    console.log(error);
	  });
})

 if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
 }

app.listen(process.env.PORT || 5000, () => console.log('server is listening on 5000...'));
