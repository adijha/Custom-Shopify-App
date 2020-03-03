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
const scopes = 'read_products, write_products, read_orders';
const forwardingAddress = "https://c15f7817.ngrok.io";
let hmacc,tokenn;
let shop=`demo-mojito.myshopify.com`;
let topic = 'orders/create'
//Import Route
 const authRoute = require('./routes/auth');
// const postroute = require('./routes/posts');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));


//connect Db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
	console.log('Db is connected')
);

// app.use(fileUpload({
//   useTempFiles : true,
//    tempFileDir : '/tmp/'
// }));
//Middleware
app.use(express.json());
//Route Middleware
app.use('/api', authRoute);
//app.use('/shopify', postroute);

//Shopify Install route
app.get('/', (req, res)=>{
  console.log(" / hit ")
  request.get('https://26ebb261.ngrok.io/shopify?shop=demo-mojito.myshopify.com')
  .then(response=>{
    console.log(response)
  })
})
app.get('/shopify', (req, res) => {
  console.log("inside /shopify");
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
				  request.get('https://c15f7817.ngrok.io/webhook')
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

//Add product to shopify
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
	    console.log(shopResponse);
	  })
	  .catch((error) => {
	    console.log(error);
	  });

})

//get product list from shopify
app.get('/shopifyProduct', (req, res)=>{
  console.log(tokenn)
  const shopRequestUrl = 'https://demo-mojito.myshopify.com/admin/api/2020-01/products.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': shop,
    'X-Shopify-API-Version': '2020-01'
  };
  request.get(shopRequestUrl, {headers:shopRequestHeaders})
  .then(data=>{
    console.log(data, "product is")
    res.send(data);
  })
  .catch(error=>{
    console.log("shopify product error", error);
  })
})

//update request shopify product
app.put('/ShopifyProduct/:id', (req, res)=>{
  console.log("token is", tokenn)
  console.log(req.body)
   const shopRequestUrl = 'https://demo-mojito.myshopify.com/admin/api/2020-01/products/'+req.params.id+'.json';
   console.log("url is", shopRequestUrl);
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': shop,
    'X-Shopify-API-Version': '2020-01'
  };
  request.put(shopRequestUrl, {headers: shopRequestHeaders, json:req.body})
  .then(data=>{
    console.log("update shopify product is ", data)
    res.send(data)
  })
  .catch(error=>{
    console.log("shopify error update is", error)
  })
})

app.delete('/shopifyProduct/:id', (req, res)=>{
  const shopRequestUrl = 'https://demo-mojito.myshopify.com/admin/api/2020-01/products/'+req.params.id+'.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': shop,
    'X-Shopify-API-Version': '2020-01'
  };
  request.delete(shopRequestUrl, {headers: shopRequestHeaders})
  .then(data=>{
    console.log("delete shopify product is ", data)
    res.send(data)
  })
  .catch(error=>{
    console.log("shopify error delete is", error)
  })
})

//create webhook
app.get('/webhook', (req, res)=>{

	const webhookUrl = 'https://' + shop + '/admin/api/2020-01/webhooks.json';
	const webhookHeaders = {
		'X-Shopify-Access-Token': tokenn,
		'X-Shopify-Topic': 'orders/create',
		'X-Shopify-Hmac-Sha256': hmacc,
		'X-Shopify-Shop-Domain': shop,
		'X-Shopify-API-Version': '2020-01',
		'Content-Type': 'application/json'
	};
	const webhookPayload = {
		webhook: {
			topic: 'orders/create',
			address: `https://c15f7817.ngrok.io/store/${shop}/orders/create`,
			format: 'json'
		}
	};
	request
		.post(webhookUrl, {
			headers: webhookHeaders,
			json: webhookPayload
		})
		.then((shopResponse) => {
			console.log('webhook topic :');
			console.log("now save this")
			console.log("fial response is", shopResponse)
      res.send(shopResponse)

		})
		.catch((error) => {
			console.log('309 error-->', error);
		});

});

//order create callback api
app.post('/store/:shop/:topic/:subtopic', function(request, response) {
	const shop = request.params.shop;
	let topic = request.params.topic;
	const subtopic = request.params.subtopic;
	topic = topic + '/' + subtopic;
	console.log('topic -->', topic);

console.log("order details", request.body);
})

 if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
 }

app.listen(process.env.PORT || 5000, () => console.log('server is listening on 5000...'));
