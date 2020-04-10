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
const scopes = 'read_products, write_products, read_orders, write_orders, read_assigned_fulfillment_orders';
const forwardingAddress = "https://demo-mojito.herokuapp.com";
let hmacc, tokenn;
let shop;
let topic = 'orders/create'
const Orders = require('./model/Orders');
const Products = require('./model/Products');
const ProductCopy = require('./model/ProductCopy');

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

//Shopify install and token generate route

app.get('/shopify', (req, res) => {
  console.log("inside /shopify");
   shop = req.query.shop;
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
				  request.get('https://demo-mojito.herokuapp.com/webhook')
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
     try {
        const makeCopy = new ProductCopy(shopResponse);
        const savedCopy = makeCopy.save();
        console.log("saved Copy of Shopify product is", savedCopy)
      }
      catch (error) {
        console.log("shopify saved product copy is", error);
      }
	  })
	  .catch((error) => {
	    console.log(error);
	  });

})

//get product list from shopify
app.get('/shopifyProduct/:VendorString', (req, res)=>{

  const shopRequestUrl = 'https://'+req.params.VendorString+'.myshopify.com/admin/api/2020-01/products.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': req.params.VendorString+'.myshopify.com',
    'X-Shopify-API-Version': '2020-01'
  };
  request.get(shopRequestUrl, {headers: shopRequestHeaders})
  .then(data=>{
    //console.log(data, "product is")
    res.send(data);
  })
  .catch(error=>{
    console.log("shopify product error", error);
  })
})

//update request shopify product
app.put('/ShopifyProduct/:VendorString/:id', (req, res)=>{
  console.log("token is", tokenn)
  console.log(req.body)
   const shopRequestUrl = 'https://'+req.params.VendorString+'.myshopify.com/admin/api/2020-01/products/'+req.params.id+'.json';
   console.log("url is", shopRequestUrl);
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': req.params.VendorString+'.myshopify.com',
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

app.delete('/shopifyProduct/:VendorString/:id', (req, res)=>{
  const shopRequestUrl = 'https://'+req.params.VendorString+'.myshopify.com/admin/api/2020-01/products/'+req.params.id+'.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': req.params.VendorString+'.myshopify.com',
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

//get Orders list

app.get('/orders/:VendorString', (req, res)=>{
  const shopRequestUrl = 'https://'+req.params.VendorString+'.myshopify.com/admin/api/2020-01/orders.json'
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': req.params.VendorString+'.myshopify.com',
    'X-Shopify-API-Version': '2020-01'
  };

  request.get(shopRequestUrl, {headers: shopRequestHeaders})
  .then(data=>{
    res.send(data)
    console.log(data)
  })
  .catch(error=>{
    console.log("order details eroor is", error)
  })
})

//fulfill single orders
app.post('/orders/:VendorString/:id', (req, res)=>{
  console.log(req.params.id)
  const shopRequestUrl = 'https://'+req.params.VendorString+'.myshopify.com/admin/api/2020-01/orders/'+req.params.id+'/fulfillments.json'
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': req.params.VendorString+'.myshopify.com',
    'X-Shopify-API-Version': '2020-01'
  };

  request.post(shopRequestUrl, {headers: shopRequestHeaders, json:req.body})
  .then(data=>{
    res.send(data)
    console.log(data)
  })
  .catch(error=>{
    console.log("ordre fulfil order is", error);
  })
})

//get fulfilled Orders
app.get('/fulfilledOrders/:VendorString', (req, res)=>{
  const shopRequestUrl = 'https://'+req.params.VendorString+'.myshopify.com/admin/api/2020-01/orders.json?status=closed' ;
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': req.params.VendorString+'.myshopify.com',
    'X-Shopify-API-Version': '2020-01'
  }
  request.get(shopRequestUrl, {headers:shopRequestHeaders})
  .then(data=>{
    console.log(data)
    res.send(data)
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
			address: `https://demo-mojito.herokuapp.com/store/${shop}/orders/create`,
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


app.get('/ordersData', async(req, res)=>{
  // const shopRequestUrl = `https://demo-mojito.myshopify.com/admin/api/2020-01/orders/count.json` ;
  // const shopRequestHeaders = {
  //   'X-Shopify-Access-Token': tokenn,
  //   'Content-Type': 'application/json',
  //   'X-Shopify-Hmac-Sha256': hmacc,
  //   'X-Shopify-Shop-Domain': shop,
  //   'X-Shopify-API-Version': '2020-01'
  // }
  // request.get(shopRequestUrl, {headers:shopRequestHeaders})
  // .then(data=>{
  //   console.log(data)
  //   res.send(data)
  // })

  try {
    const data = await Orders.find({})
    console.log(data.length)
    res.status(200).json(data.length)
  } catch (error) {
    console.log(error, "orderData api");
  }
})


app.get('/revenue', async(req, res)=>{
  const priceCal = [];
  const data = await Orders.find({});

  data.forEach((item, i) => {
    priceCal.push(item.price)
  });

const sumPrice = priceCal.reduce((a,b)=>a+b, 0)
res.status(200).json(sumPrice)
console.log("price cal array is", sumPrice)

})

//
// app.get('/timeGraph', async (req, res)=>{
//   const timeData = []
//   const data = await Orders.find({})
//
//   data.forEach((item, i) => {
//     timeData.push(item.created_on.toDateString())
//   });
//   var uniqueItems = Array.from(new Set(timeData))
//   console.log("filter Array", uniqueItems);
//   res.status(200).json(uniqueItems);
// })





//Revenue per day
app.get('/newTimeGraph', async (req, res)=>{
  const timeData = []; //Date and price
  let newAray = []
  const priceArray = [];
  let tempprice =[];
  let tempVariable;
  let calAdd =0;

  const data = await Orders.find({})

  data.forEach((item, i) => {
    newAray.push(item.created_on.toDateString())
  });

  //var uniqueItems = Array.from(new Set(newAray)) // distinct value of dates

  data.forEach((item, i) => {
    timeData.push({date:item.created_on.toDateString(),
                  price: item.price})
  });

newAray = [...new Set(newAray)];


  newAray.forEach((item, i) => {
    console.log({item})
    timeData.forEach((dash, i) => {
      if (item==dash.date) {
        calAdd+=dash.price
      }

    });
    priceArray.push(calAdd)
    //console.log("add sum is", calAdd)
  });
  let graphData = {
    date:newAray,
    price:priceArray
  }
  res.status(200).json(graphData)
  //console.log("Final Array is", graphData)

})

//Revenue by State

app.get('/statePie', async (req, res)=>{
  const stateData = []; //Date and price
  let stateArray = []
  const priceArray = [];

  const data = await Orders.find({})


  data.forEach((item, i) => {
    stateData.push({state:item.customer.city,
                  price: item.price})
  });

  var holder = {};

  stateData.forEach(function(d) {
    if (holder.hasOwnProperty(d.state)) {
      holder[d.state] = holder[d.state] + d.price;
    } else {
      holder[d.state] = d.price;
    }
  });

  var obj2 = [];

  for (var prop in holder) {
    obj2.push({ state: prop, price: holder[prop] });
  }

  //console.log({obj2});

  obj2.forEach((item, i) => {
    stateArray.push(item.state)
    priceArray.push(item.price)
  });


  let pieData = {
    state:stateArray,
    price:priceArray
  }
   res.status(200).json(pieData)
   //console.log("Final Array is", pieData)

})

app.get('/categoryRevenue', async (req, res)=>{
let obj = []
let categoryArray =[]
let priceArray=[]
let finalArray=[]
  const data = await Orders.find({})

  data.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku!==undefined) {
        obj.push({
          sku:sss.sku,
          price:parseInt(sss.price)
        })
      }
    });

  });

  var holder = {};

  obj.forEach(function(d) {
    if (holder.hasOwnProperty(d.sku)) {
      holder[d.sku] = holder[d.sku] + d.price;
    } else {
      holder[d.sku] = d.price;
    }
  });

  var obj2 = [];

  for (var prop in holder) {
    obj2.push({ sku: prop, price: holder[prop] });
  }

  console.log({obj2});

const productData =  await Products.find({})
productData.forEach((sk, i) => {
  obj2.forEach((cat, i) => {
    if (sk.code===cat.sku) {
      categoryArray.push({category:sk.category, price:cat.price})
    }
  });

});
var holder1 ={}

categoryArray.forEach(function(d) {
  if (holder1.hasOwnProperty(d.category)) {
    holder1[d.category] = holder1[d.category] + d.price;
  } else {
    holder1[d.category] = d.price;
  }
});


for (var prop in holder1) {
  finalArray.push({ category: prop, price: holder1[prop] });
}

let arrCategory=[]
let arrRevenue =[]

finalArray.forEach((sepArray, i) => {
  arrCategory.push(sepArray.category)
  arrRevenue.push(sepArray.price)
});


let categoryRevenue =  {
  category:arrCategory,
  revenue:arrRevenue
}

res.status(200).json(categoryRevenue);

})

//Admin Top 10 selling Product

app.get('/topSelling', async (req, res)=>{

  let itemArray =[];

  const data = await Orders.find({});

  data.forEach((item, i) => {
      item.products.forEach((sss, i) => {
        if (sss.sku!==undefined) {
          itemArray.push({
            sku:sss.sku,
            count:sss.quantity
          })
        }
      });

    });

    var holder = {};

    itemArray.forEach(function(d) {
      if (holder.hasOwnProperty(d.sku)) {
        holder[d.sku] = holder[d.sku] + d.count;
      } else {
        holder[d.sku] = d.count;
      }
    });

    var obj2 = [];

    for (var prop in holder) {
      obj2.push({ sku: prop, count: holder[prop] });
    }
    //console.log({obj2});

    let calOrder =[]

    const productData = await Products.find({})

    //console.log(productData.length);

    obj2.forEach((arr, i) => {
      productData.forEach((product, j) => {
        if (product.code==arr.sku) {

          let countItem=product.price*arr.count

          calOrder.push(
            {name: product.name,
             sku: product.code,
           count: arr.count,
         price: product.price,
       revenue:countItem}
          )
        }
      });

    });
    //console.log({calOrder});
  let totalOrders =  calOrder.sort((a,b)=>b-a)
  let top10 = totalOrders.slice(0, 10);
  //console.log({totalOrders});
  res.status(200).json(top10)
})




//Admin Analytics 2
app.get('/orderTime',async (req, res)=>{

  let timeData = []

  const data = await Orders.find({});



  data.forEach((item, i) => {
    timeData.push({date:item.created_on.toDateString(),
                  count: 1})
  });



  console.log({timeData});

  var holder = {};

  timeData.forEach(function(d) {
    if (holder.hasOwnProperty(d.date)) {
      holder[d.date] = holder[d.date] + d.count;
    } else {
      holder[d.date] = d.count;
    }
  });

  var obj2 = [];

  for (var prop in holder) {
    obj2.push({ date: prop, count: holder[prop] });
  }
  //console.log({obj2});

  let timeArray =[]
  let countArray = []

  obj2.forEach((item, i) => {
    timeArray.push(item.date)
    countArray.push(item.count)
  });

  let finalObj = {
    date: timeArray,
    orders: countArray
  }
  console.log(finalObj);
  res.status(200).json(finalObj)
})


//State wise ordersData

app.get('/stateOrderGraph', async (req, res)=>{

  const stateData = []; //Date and price
  let stateArray = []
  const countArray = [];

  const data = await Orders.find({})


  data.forEach((item, i) => {
    stateData.push({state:item.customer.city,
                  count:1})
  });

  console.log({stateData});
  var holder = {};

  stateData.forEach(function(d) {
    if (holder.hasOwnProperty(d.state)) {
      holder[d.state] = holder[d.state] + d.count;
    } else {
      holder[d.state] = d.count;
    }
  });

  var obj2 = [];

  for (var prop in holder) {
    obj2.push({ state: prop, count: holder[prop] });
  }

  console.log({obj2});

  obj2.forEach((item, i) => {
    stateArray.push(item.state)
    countArray.push(item.count)
  });
  //
  //
  let finalObj = {
    state:stateArray,
    order:countArray
  }
   res.status(200).json(finalObj)
  //  //console.log("Final Array is", pieData)
})


/*Supplier Analytics*/


//supplier revenue
app.get('/supplierRevenue/:id', async (req, res)=>{
  console.log("id is", req.params.id);
    let itemArray =[];

    const data = await Orders.find({});

    data.forEach((item, i) => {
        item.products.forEach((sss, i) => {
          if (sss.sku!==undefined) {
            itemArray.push({
              sku:sss.sku,
              count:sss.quantity
            })
          }
        });

      });

      var holder = {};

      itemArray.forEach(function(d) {
        if (holder.hasOwnProperty(d.sku)) {
          holder[d.sku] = holder[d.sku] + d.count;
        } else {
          holder[d.sku] = d.count;
        }
      });

      var obj2 = [];

      for (var prop in holder) {
        obj2.push({ sku: prop, count: holder[prop] });
      }

      let calPrice =[]
      const productData = await Products.find({"supplier_id":req.params.id})

      console.log(productData.length);

      obj2.forEach((arr, i) => {
        productData.forEach((product, j) => {
          if (product.code==arr.sku) {

            let countPrice=product.price*arr.count;

            calPrice.push(
              ~~countPrice
            )
          }
        });

      });
      console.log({calPrice});
      let income = calPrice.reduce((a, b)=>a+b, 0)
      console.log(income);
      res.status(200).json(income)
})

//supplier orders

app.get('/supplierOrders/:id', async (req, res)=>{

  console.log("id is", req.params.id);
    let itemArray =[];

    const data = await Orders.find({});

    data.forEach((item, i) => {
        item.products.forEach((sss, i) => {
          if (sss.sku!==undefined) {
            itemArray.push({
              sku:sss.sku,
              count:sss.quantity
            })
          }
        });

      });

      var holder = {};

      itemArray.forEach(function(d) {
        if (holder.hasOwnProperty(d.sku)) {
          holder[d.sku] = holder[d.sku] + d.count;
        } else {
          holder[d.sku] = d.count;
        }
      });

      var obj2 = [];

      for (var prop in holder) {
        obj2.push({ sku: prop, count: holder[prop] });
      }
      //console.log({obj2});

      let calOrder =[]

      const productData = await Products.find({"supplier_id":req.params.id})

      //console.log(productData.length);

      obj2.forEach((arr, i) => {
        productData.forEach((product, j) => {
          if (product.code==arr.sku) {

            let countItem=arr.count

            calOrder.push(
              countItem
            )
          }
        });

      });
      console.log({calOrder});
    let totalOrders =   calOrder.reduce((a,b)=>a+b, 0)
    console.log(totalOrders);
      res.status(200).json(totalOrders)
})

//Top selling Products

app.get('/topProducts/:id', async (req, res)=>{

  let itemArray =[];

  const data = await Orders.find({});

  data.forEach((item, i) => {
      item.products.forEach((sss, i) => {
        if (sss.sku!==undefined) {
          itemArray.push({
            sku:sss.sku,
            count:sss.quantity
          })
        }
      });

    });

    var holder = {};

    itemArray.forEach(function(d) {
      if (holder.hasOwnProperty(d.sku)) {
        holder[d.sku] = holder[d.sku] + d.count;
      } else {
        holder[d.sku] = d.count;
      }
    });

    var obj2 = [];

    for (var prop in holder) {
      obj2.push({ sku: prop, count: holder[prop] });
    }
    //console.log({obj2});

    let calOrder =[]

    const productData = await Products.find({"supplier_id":req.params.id})

    //console.log(productData.length);

    obj2.forEach((arr, i) => {
      productData.forEach((product, j) => {
        if (product.code==arr.sku) {

          let countItem=product.price*arr.count

          calOrder.push(
            {name: product.name,
             sku: product.code,
           count: arr.count,
         price: product.price,
       revenue:countItem}
          )
        }
      });

    });
    //console.log({calOrder});
  let totalOrders =  calOrder.sort((a,b)=>b-a)
  let top5 = totalOrders.slice(0, 5);
  //console.log({totalOrders});
  res.status(200).json(top5)
})

//Graph for supplier Revenue

app.get('/supplierGraphRevenue/:id', async (req, res)=>{

  console.log("id is", req.params.id);
    let itemArray =[];

    const data = await Orders.find({});

    data.forEach((item, i) => {
        item.products.forEach((sss, i) => {
          if (sss.sku!==undefined) {
            itemArray.push({
              sku:sss.sku,
              date: item.created_on.toDateString(),
              price: 0
            })
          }
        });

      });

  //console.log({itemArray});

  const productData = await Products.find({"supplier_id":req.params.id})
  let newArray = []

  itemArray.forEach((dash, i) => {
    productData.forEach((item, i) => {
      if (item.code === dash.sku) {
        newArray.push({
          date: dash.date,
          price: item.price
        })
      }
    });

  });


  var holder = {};

  newArray.forEach(function(d) {
    if (holder.hasOwnProperty(d.date)) {
      holder[d.date] = holder[d.date] + d.price;
    } else {
      holder[d.date] = d.price;
    }
  });

  var obj2 = [];

  for (var prop in holder) {
    obj2.push({ date: prop, price: holder[prop] });
  }

  let dateArray = []
  let revenueArray = []

  obj2.forEach((seperate, i) => {
    dateArray.push(seperate.date)
    revenueArray.push(seperate.price)

  });
  let finalGraphObj = {
    date: dateArray,
    revenue: revenueArray
  }
  //console.log({finalGraphObj});
  res.status(200).json(finalGraphObj);

})

//order create callback api
app.post('/store/:shop/:topic/:subtopic', async function(request, response) {

	const shop = request.params.shop;
	let topic = request.params.topic;
	const subtopic = request.params.subtopic;
	topic = topic + '/' + subtopic;
	console.log('topic -->', topic);
  console.log("request.body of Orders", request.body)
  const productDetails = [];
//console.log("order details", request.body);

  request.body.line_items.forEach((item, i) => {
    productDetails.push({
      id: item.product_id,
      name: item.name,
      quantity:item.quantity,
      price: item.price,
      sku:item.sku,
      store:item.vendor
    })
  });

    const orders = new Orders({
      product_name: request.body.id,
      currency:request.body.currency,
      price: request.body.total_price,
      created_on:request.body.created_at,
      products: productDetails,
      customer:{
        name:request.body.customer.first_name + request.body.customer.last_name,
        email:request.body.email,
        address:request.body.shipping_address.address1 + request.body.shipping_address.address2,
        city: request.body.shipping_address.city,
        zip:request.body.shipping_address.zip,
        phone:request.body.shipping_address.phone,
        state: request.body.shipping_address.province,
        country: request.body.shipping_address.country
      }
    })

    try{
      if (request.body) {
        console.log("order details custom is:", orders);
        const data = await orders.save()
        console.log("Orders Saved Successfully")
        response.end()
      }
    }
    catch(error){
      console.log("orders saved error", error)
    }


})



 if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
 }




app.listen(process.env.PORT || 5000, () => console.log('server is listening on 5000...'));
