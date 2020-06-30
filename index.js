const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cookie = require('cookie');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const csv = require('csvtojson');
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes =
  'read_products, write_products, read_orders, write_orders, read_assigned_fulfillment_orders';
const forwardingAddress = 'https://www.melisxpress.com';
let hmacc, tokenn;
// let shop;
let topic = 'orders/create';
const Orders = require('./model/Orders');
const Products = require('./model/Products');
const ProductCopy = require('./model/ProductCopy');
const User = require('./model/User');
const MerchantUser = require('./model/MerchantUser');
const Store = require('./model/Store');
const session = require('express-session');
const mongoConnect = require('connect-mongo')(session);
const moment = require('moment');

//connect Db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('Db is connected')
);

app.use(
  session({
    secret: 'mylittleSecrets.',
    resave: false,
    saveUninitialized: false,
    store: new mongoConnect({
      mongooseConnection: mongoose.connection,
    }),
  })
);
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

//Import Route
const authRoute = require('./routes/auth');
// const postroute = require('./routes/posts');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

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
  // console.log("inside /shopify");
  // shop = req.query.shop;
  let shop = req.query.shop;
  req.session.shop = req.query.shop;

  console.log('shop is ', shop);
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

    //res.cookie("state", state);
    res.cookie(req.session.shop, state);
    res.redirect(installUrl);
  } else {
    return res
      .status(400)
      .send(
        'Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request'
      );
  }
});

app.get('/shopify/callback', (req, res) => {
  let { shop, hmac, code, state } = req.query;
  //const stateCookie = cookie.parse(req.headers.cookie).state;
  const stateCookie = cookie.parse(req.headers.cookie)[`${shop}`];

  if (state !== stateCookie) {
    return res.status(403).send('Request origin cannot be verified');
  }

  console.log('makeWebook in callback', { shop, code, hmac });

  if (shop && hmac && code) {
    // DONE: Validate request is from Shopify
    const map = Object.assign({}, req.query);
    delete map['signature'];
    delete map['hmac'];
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, 'utf-8');
    const generatedHash = Buffer.from(
      crypto.createHmac('sha256', apiSecret).update(message).digest('hex'),
      'utf-8'
    );
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
    const accessTokenRequestUrl =
      'https://' + shop + '/admin/oauth/access_token';
    const accessTokenPayload = {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    };

    request
      .post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then((accessTokenResponse) => {
        // tokenn = accessTokenResponse.access_token;
        // hmacc = hmac;
        let token = accessTokenResponse.access_token;
        makeWebook(token, shop, hmac, code);
        Gtoken = accessTokenResponse.access_token;
        req.session.hmac = hmac;
        req.session.token = accessTokenResponse.access_token;
        req.session.code = code;
        res.redirect('https://www.melisxpress.com/login-merchant')
        //console.log("makeWebook in callback", {shop, token, hmac});

        // tokenn = accessTokenResponse.access_token;
        //return postRequest(tokenn, hmacc, shop)
        // const shopRequestUrl =
        //   "https://" + shop + "/admin/api/2020-01/products.json";
        // const shopRequestHeaders = {
        //   "X-Shopify-Access-Token": tokenn,
        // };
        // request
        //   .get("https://www.melisxpress.com/webhook")
        //   .then((shopResponse) => {
        //     res.send(shopResponse);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
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
app.post('/addToShopify/:storeName',async (req, res) => {

  let storeData = await Store.find({ name: req.params.storeName });
  // console.log(storeData, "found");
  // console.log(req.body);
  let obj = {
    product:{
      title: req.body.product.title,
      body_html: req.body.product.body_html,
      vendor: req.body.product.vendor,
      images:[ {"attachment":req.body.product.images}],
      product_type: req.body.product.product_type
    }

  }
  console.log(obj);
  if (storeData.length>0) {
    const shopRequestUrl =
      'https://' +req.params.storeName +'/admin/api/2020-01/products.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': storeData[0].token,
      'Content-Type': 'application/json',
      'X-Shopify-Hmac-Sha256': storeData[0].hmac,
      'X-Shopify-Shop-Domain': req.params.storeName,
      'X-Shopify-API-Version': '2020-01',
    };

    request
      .post(shopRequestUrl, { headers: shopRequestHeaders, json: obj })
      .then(async (shopResponse) => {
        try {
          const makeCopy = await new ProductCopy(shopResponse);
          const savedCopy = makeCopy.save();
          console.log('saved Copy of Shopify product is', savedCopy);
          res.send("success")
        } catch (error) {
          console.log('shopify saved product copy is', error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
    else {
      console.log("shopify add product error");
    }

});

//get product list from shopify
app.get('/shopifyProduct/:storeName', async (req, res) => {
  let storeData = await Store.find({ name: req.params.storeName });
  if (storeData.length > 0) {
    const shopRequestUrl =
      'https://' + req.params.storeName + '/admin/api/2020-01/products.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': storeData[0].token,
      'Content-Type': 'application/json',
      'X-Shopify-Hmac-Sha256': storeData[0].hmac,
      'X-Shopify-Shop-Domain': req.params.storeName,
      'X-Shopify-API-Version': '2020-01',
    };
    request
      .get(shopRequestUrl, { headers: shopRequestHeaders })
      .then((data) => {
        //console.log(data, "product is")
        res.send(data);
      })
      .catch((error) => {
        console.log('shopify product error', error);
      });
  } else {
    console.log('storeData not found');
  }
});

//update request shopify product
app.put('/ShopifyProduct/:storeName/:id', async (req, res) => {
  console.log(req.params, "shopify update");
  let storeData = await Store.find({ name: req.params.storeName });
  let obj = {
    product:{
      title: req.body.product.title,
      body_html: req.body.product.body_html,
      vendor: req.body.product.vendor,
      product_type: req.body.product.product_type
    }

  }
  if (storeData.length > 0) {

  console.log(req.body);
  const shopRequestUrl =
    'https://' +
    req.params.storeName +
    '/admin/api/2020-01/products/' +
    req.params.id +
    '.json';
  console.log('url is', shopRequestUrl);
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': storeData[0].token,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': storeData[0].hmac,
    'X-Shopify-Shop-Domain': req.params.storeName,
    'X-Shopify-API-Version': '2020-01',
  };
  request
    .put(shopRequestUrl, { headers: shopRequestHeaders, json: obj })
    .then((data) => {
      console.log('update shopify product is ', data);
      res.send("success");
    })
    .catch((error) => {
      console.log('shopify error update is', error);
    });
  }
  else {
    console.log("shopify product update error");
  }
});

app.delete('/shopifyProduct/:storeName/:id', async (req, res) => {
  let storeData = await Store.find({ name: req.params.storeName });
  if (storeData.length > 0) {
  const shopRequestUrl =
    'https://' +
    req.params.storeName +
    '/admin/api/2020-01/products/' +
    req.params.id +
    '.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': storeData[0].token,
    'Content-Type': 'application/json',
    'X-Shopify-Hmac-Sha256': storeData[0].hmac,
    'X-Shopify-Shop-Domain': req.params.storeName,
    'X-Shopify-API-Version': '2020-01',
  };
  request
    .delete(shopRequestUrl, { headers: shopRequestHeaders })
    .then((data) => {
      console.log('delete shopify product is ', data);
      res.send(data);
    })
    .catch((error) => {
      console.log('shopify error delete is', error);
    });
  } else {
    console.log('storeData not found');
  }
});

//get Orders list

app.get('/orders/:store', async (req, res) => {
  console.log('storeName', req.params.storeName);
  let storeData = await Store.find({ name: req.params.storeName });
  if (storeData.length > 0) {
    const shopRequestUrl =
      'https://' + req.params.storeName + '/admin/api/2020-01/orders.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': storeData[0].token,
      'Content-Type': 'application/json',
      'X-Shopify-Hmac-Sha256': storeData[0].hmac,
      'X-Shopify-Shop-Domain': req.params.storeName,
      'X-Shopify-API-Version': '2020-01',
    };

    request
      .get(shopRequestUrl, { headers: shopRequestHeaders })
      .then((data) => {
        res.send(data);
        console.log(data);
      })
      .catch((error) => {
        console.log('order details eroor is', error);
      });
  } else {
    console.log('no data found');
  }
});

//fulfill single orders
app.post('/updateOrdersTracking/:store/:id', async (req, res) => {

  let storeFullName = req.params.store+'.myshopify.com'
  console.log("storeFullName", storeFullName);

  let storeData = await Store.find({ name: storeFullName });
  console.log(req.params.id);
  console.log(req.body);

    if (storeData.length > 0) {

      const shopRequestUrl =
        'https://' +
        storeFullName +
        '/admin/api/2020-01/orders/' +
        req.params.id +
        '/fulfillments.json';

      const shopRequestHeaders = {
        'X-Shopify-Access-Token': storeData[0].token,
        'Content-Type': 'application/json',
        'X-Shopify-Hmac-Sha256': storeData[0].hmac,
        'X-Shopify-Shop-Domain': storeData[0].name,
        'X-Shopify-API-Version': '2020-01',
      };

  request.post(shopRequestUrl, { headers: shopRequestHeaders, json: req.body })
    .then((data) => {
      console.log("successfully track ", data);
      res.send('success')
    })
    .catch((error) => {
      console.log("error is update tracking", error);
    });
  } else {
    console.log('no data found in fulfil order api');
  }
});

//get fulfilled Orders
app.get('/fulfilledOrders/:storeName', async (req, res) => {
  let storeData = await Store.find({ name: req.params.storeName });
  if (storeData.length > 0) {
    const shopRequestUrl =
      'https://' +
      req.params.storeName +
      '/admin/api/2020-01/orders.json?status=closed';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': storeData[0].token,
      'Content-Type': 'application/json',
      'X-Shopify-Hmac-Sha256': storeData[0].hmac,
      'X-Shopify-Shop-Domain': req.params.storeName,
      'X-Shopify-API-Version': '2020-01',
    };
    request
      .get(shopRequestUrl, { headers: shopRequestHeaders })
      .then((data) => {
        console.log(data);
        res.send(data);
      });
  } else {
    console.log('no data found in fulfilled orders');
  }
});

//Make webhook create function
const makeWebook = (token, shop, hmac, code) => {
  // let shop = req.session.shop;
  // let token = req.session.token;
  // let hmac = req.session.hmac;
  let webhookObj = {
    token: token,
    name: shop,
    hmac: hmac,
    code: code,
  };

  console.log('makeWebook', { shop, code, hmac, token });

  const webhookUrl = 'https://' + shop + '/admin/api/2020-01/webhooks.json';

  const webhookHeaders = {
    'X-Shopify-Access-Token': token,
    'X-Shopify-Topic': 'orders/create',
    'X-Shopify-Hmac-Sha256': hmac,
    'X-Shopify-Shop-Domain': shop,
    'X-Shopify-API-Version': '2020-01',
    'Content-Type': 'application/json',
  };

  const webhookPayload = {
    webhook: {
      topic: 'orders/create',
      address: `https://www.melisxpress.com/store/${shop}/orders/create`,
      format: 'json',
    },
  };

  request
    .post(webhookUrl, {
      headers: webhookHeaders,
      json: webhookPayload,
    })

    .then((shopResponse) => {
      console.log('webhook topic :', topic);
      console.log('fial response is', shopResponse);

      Store.findOne(
        {
          name: shop,
        },
        function (err, data) {
          if (data) {
            console.log('store found in DB');
            // res.sendStatus(200).redirect('back');
            res.sendStatus(200);
            // res.redirect("back");
            Store.findOneAndUpdate(
              {
                name: shop,
              },
              {
                $set: {
                  data: webhookObj,
                  uninstalled: false,
                },
              },
              {
                new: true,
                useFindAndModify: false,
              },
              (err, data) => {
                if (!err) {
                  //   console.log("datacount + 1");
                } else {
                  console.log('238 err-->', err);
                }
              }
            );
          } else {
            console.log('store !found in DB');
            const store = new Store({
              token: token,
              name: shop,
              hmac: hmac,
              code: code,
            });
            store.save(function (err, data) {
              if (!err) {
                console.log(`${shop} data store to DB`, data);
              } else {
                console.log(err);
              }
            });
          }
        }
      );
    })
    .catch((error) => {
      console.log('309 error-->', error);
    });
};

//create webhook
app.get('/webhook', (req, res) => {
  console.log('inside webhook code');

  let shop = req.session.shop;
  let token = req.session.token;
  let hmac = req.session.hmac;

  console.log('makeWebook', { shop, token, hmac });

  console.log(
    'makeWebook object',
    (req.session.shop, req.session.token, req.session.hmac)
  );

  const webhookUrl = 'https://' + shop + '/admin/api/2020-01/webhooks.json';

  const webhookHeaders = {
    'X-Shopify-Access-Token': tokenn,
    'X-Shopify-Topic': 'orders/create',
    'X-Shopify-Hmac-Sha256': hmacc,
    'X-Shopify-Shop-Domain': shop,
    'X-Shopify-API-Version': '2020-01',
    'Content-Type': 'application/json',
  };

  const webhookPayload = {
    webhook: {
      topic: 'orders/create',
      address: `https://www.melisxpress.com/store/${shop}/orders/create`,
      format: 'json',
    },
  };
  request
    .post(webhookUrl, {
      headers: webhookHeaders,
      json: webhookPayload,
    })
    .then((shopResponse) => {
      console.log('webhook topic :');
      console.log('now save this');
      console.log('fial response is', shopResponse);
      res.send(shopResponse);
    })
    .catch((error) => {
      console.log('309 error-->', error);
    });
});

app.get('/ordersData', async (req, res) => {
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
    const data = await Orders.find({});
    const productData = await Products.find()
    let itemArray = []

    data.forEach((item, i) => {
      item.products.forEach((sss, i) => {
        if (sss.sku !== undefined) {
          itemArray.push({
            totalPrice: parseInt(item.price),
            name: sss.name,
            sku: sss.sku,
            price: sss.price,
            store: sss.store.toLowerCase()
          });
        }
      });
    });

    let makeOrderArray = []
    itemArray.forEach((item, i) => {
      productData.forEach((product, j) => {
        if (itemArray[i].sku===productData[j].code) {
          makeOrderArray.push(itemArray[i])
        }
      });

    });

    console.log(makeOrderArray.length);
    res.status(200).json(makeOrderArray.length);
  } catch (error) {
    console.log(error, 'orderData api');
  }
});

app.get('/revenue', async (req, res) => {
  const priceCal = [];
  const data = await Orders.find({});
  const productData = await Products.find()
  let itemArray = []

  data.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku !== undefined) {
        itemArray.push({
          totalPrice: parseInt(item.price),
          name: sss.name,
          sku: sss.sku,
          price: sss.price,
          store: sss.store.toLowerCase()
        });
      }
    });
  });
let makeOrderArray = []
itemArray.forEach((item, i) => {
  productData.forEach((product, j) => {
    if (itemArray[i].sku===productData[j].code) {
      makeOrderArray.push(itemArray[i])
    }
  });

});
console.log("makeOrderArray", makeOrderArray);
  makeOrderArray.forEach((item, i) => {
    priceCal.push(item.totalPrice);
  });

  const sumPrice = priceCal.reduce((a, b) => a + b, 0);
  res.status(200).json(sumPrice);
  console.log('price cal array is', sumPrice);
});

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
app.get('/newTimeGraph', async (req, res) => {
  const timeData = []; //Date and price
  let newAray = [];
  const priceArray = [];
  let tempprice = [];
  let tempVariable;
  let calAdd = 0;

  const data = await Orders.find({});

  data.forEach((item, i) => {
    newAray.push(item.created_on.toDateString());
  });

  //var uniqueItems = Array.from(new Set(newAray)) // distinct value of dates

  data.forEach((item, i) => {
    timeData.push({
      date: item.created_on.toDateString(),
      price: item.price,
    });
  });

  newAray = [...new Set(newAray)];

  newAray.forEach((item, i) => {
    console.log({ item });
    timeData.forEach((dash, i) => {
      if (item === dash.date) {
        calAdd += dash.price;
      }
    });
    priceArray.push(calAdd);
    //console.log("add sum is", calAdd)
  });
  let graphData = {
    date: newAray,
    price: priceArray,
  };
  res.status(200).json(graphData);
  //console.log("Final Array is", graphData)
});

//Revenue by State

app.get('/statePie', async (req, res) => {
  const stateData = []; //Date and price
  let stateArray = [];
  const priceArray = [];

  const data = await Orders.find({});

  data.forEach((item, i) => {
    stateData.push({
      state: item.customer.city,
      price: item.price,
    });
  });

  var holder = {};

  stateData.forEach(function (d) {
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
    stateArray.push(item.state);
    priceArray.push(item.price);
  });

  let pieData = {
    state: stateArray,
    price: priceArray,
  };
  res.status(200).json(pieData);
  //console.log("Final Array is", pieData)
});

app.get('/categoryRevenue', async (req, res) => {
  let obj = [];
  let categoryArray = [];
  let priceArray = [];
  let finalArray = [];
  const data = await Orders.find({});

  data.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku !== undefined) {
        obj.push({
          sku: sss.sku,
          price: parseInt(sss.price),
        });
      }
    });
  });

  var holder = {};

  obj.forEach(function (d) {
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

  console.log({ obj2 });

  const productData = await Products.find({ category: req.body.category });

  productData.forEach((sk, i) => {
    obj2.forEach((cat, i) => {
      if (sk.code === cat.sku) {
        categoryArray.push({ category: sk.category, price: cat.price });
      }
    });
  });
  var holder1 = {};

  categoryArray.forEach(function (d) {
    if (holder1.hasOwnProperty(d.category)) {
      holder1[d.category] = holder1[d.category] + d.price;
    } else {
      holder1[d.category] = d.price;
    }
  });

  for (var prop in holder1) {
    finalArray.push({ category: prop, price: holder1[prop] });
  }

  let arrCategory = [];
  let arrRevenue = [];

  finalArray.forEach((sepArray, i) => {
    arrCategory.push(sepArray.category);
    arrRevenue.push(sepArray.price);
  });

  let categoryRevenue = {
    category: arrCategory,
    revenue: arrRevenue,
  };

  res.status(200).json(categoryRevenue);
});

//Admin Top 10 selling Product

app.get('/topSelling', async (req, res) => {
  let itemArray = [];

  const data = await Orders.find({});

  data.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku !== undefined) {
        itemArray.push({
          sku: sss.sku,
          count: sss.quantity,
        });
      }
    });
  });

  var holder = {};

  itemArray.forEach(function (d) {
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

  let calOrder = [];

  const productData = await Products.find({});

  //console.log(productData.length);

  obj2.forEach((arr, i) => {
    productData.forEach((product, j) => {
      if (product.code === arr.sku) {
        let countItem = product.price * arr.count;

        calOrder.push({
          name: product.name,
          sku: product.code,
          count: arr.count,
          price: product.price,
          revenue: countItem,
        });
      }
    });
  });
  //console.log({calOrder});
  let totalOrders = calOrder.sort((a, b) => b - a);
  let top10 = totalOrders.slice(0, 10);
  //console.log({totalOrders});
  res.status(200).json(top10);
});

//Admin Analytics 2
app.get('/orderTime', async (req, res) => {
  let timeData = [];

  const data = await Orders.find({});

  data.forEach((item, i) => {
    timeData.push({
      date: item.created_on.toDateString(),
      count: 1,
    });
  });

  console.log({ timeData });

  var holder = {};

  timeData.forEach(function (d) {
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

  let timeArray = [];
  let countArray = [];

  obj2.forEach((item, i) => {
    timeArray.push(item.date);
    countArray.push(item.count);
  });

  let finalObj = {
    date: timeArray,
    orders: countArray,
  };
  console.log(finalObj);
  res.status(200).json(finalObj);
});

//State wise ordersData

app.get('/stateOrderGraph', async (req, res) => {
  const stateData = []; //Date and price
  let stateArray = [];
  const countArray = [];

  const data = await Orders.find({});

  data.forEach((item, i) => {
    stateData.push({
      state: item.customer.city,
      count: 1,
    });
  });

  console.log({ stateData });
  var holder = {};

  stateData.forEach(function (d) {
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

  console.log({ obj2 });

  obj2.forEach((item, i) => {
    stateArray.push(item.state);
    countArray.push(item.count);
  });
  //
  //
  let finalObj = {
    state: stateArray,
    order: countArray,
  };
  res.status(200).json(finalObj);
  //  //console.log("Final Array is", pieData)
});

/*Supplier Analytics*/

//supplier revenue
app.get('/supplierRevenue/:id', async (req, res) => {
  console.log('id is', req.params.id);
  let itemArray = [];

  const data = await Orders.find({});

  let dataTempArray = [];

  data.forEach((item, i) => {
    if (data[i].pStatus === 'Paid') {
      dataTempArray.push(data[i]);
    }
  });

  dataTempArray.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku !== undefined) {
        itemArray.push({
          sku: sss.sku,
          count: sss.quantity,
        });
      }
    });
  });

  var holder = {};

  itemArray.forEach(function (d) {
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

  let calPrice = [];
  const productData = await Products.find({ supplier_id: req.params.id });

  console.log(productData.length);

  obj2.forEach((arr, i) => {
    productData.forEach((product, j) => {
      if (product.code === arr.sku) {
        let countPrice = product.price * arr.count;

        calPrice.push(~~countPrice);
      }
    });
  });
  console.log({ calPrice });
  let income = calPrice.reduce((a, b) => a + b, 0);
  console.log(income);
  res.status(200).json(income);
});

//supplier orders

app.get('/supplierOrders/:id', async (req, res) => {
  console.log('id is', req.params.id);
  let itemArray = [];

  const data = await Orders.find({});

  let checkOrderStatus = [];

  data.forEach((item, i) => {
    if (data[i].pStatus === 'Paid') {
      checkOrderStatus.push(data[i]);
    }
  });

  checkOrderStatus.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku !== undefined) {
        itemArray.push({
          sku: sss.sku,
          count: sss.quantity,
        });
      }
    });
  });

  var holder = {};

  itemArray.forEach(function (d) {
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

  let calOrder = [];

  const productData = await Products.find({ supplier_id: req.params.id });

  //console.log(productData.length);

  obj2.forEach((arr, i) => {
    productData.forEach((product, j) => {
      if (product.code === arr.sku) {
        let countItem = arr.count;

        calOrder.push(countItem);
      }
    });
  });
  console.log({ calOrder });
  let totalOrders = calOrder.reduce((a, b) => a + b, 0);
  console.log(totalOrders);
  res.status(200).json(totalOrders);
});

//Top selling Products

app.get('/topProducts/:id', async (req, res) => {
  let itemArray = [];

  const data = await Orders.find({});

  let tempTopArray = [];

  data.forEach((item, i) => {
    if (data[i].pStatus === 'Paid') {
      tempTopArray.push(data[i]);
    }
  });

  tempTopArray.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku !== undefined) {
        itemArray.push({
          sku: sss.sku,
          count: sss.quantity,
        });
      }
    });
  });

  var holder = {};

  itemArray.forEach(function (d) {
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

  let calOrder = [];

  const productData = await Products.find({ supplier_id: req.params.id });

  //console.log(productData.length);

  obj2.forEach((arr, i) => {
    productData.forEach((product, j) => {
      if (product.code === arr.sku) {
        let countItem = product.price * arr.count;

        calOrder.push({
          name: product.name,
          sku: product.code,
          count: arr.count,
          price: product.price,
          revenue: countItem,
        });
      }
    });
  });
  //console.log({calOrder});
  let totalOrders = calOrder.sort((a, b) => b - a);
  let top5 = totalOrders.slice(0, 5);
  //console.log({totalOrders});
  res.status(200).json(top5);
});








//Graph for supplier Revenue

app.get('/supplierGraphRevenue/:id', async (req, res) => {
  console.log('id is', req.params.id);
  let itemArray = [];

  const data = await Orders.find({});

  let tempGraphArray = [];

  data.forEach((item, i) => {
    if (data[i].pStatus === 'Paid') {
      tempGraphArray.push(data[i]);
    }
  });

  tempGraphArray.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku !== undefined) {
        itemArray.push({
          sku: sss.sku,
          date: item.created_on.toDateString(),
          price: 0,
        });
      }
    });
  });

  //console.log({itemArray});

  const productData = await Products.find({ supplier_id: req.params.id });
  let newArray = [];

  itemArray.forEach((dash, i) => {
    productData.forEach((item, i) => {
      if (item.code === dash.sku) {
        newArray.push({
          date: dash.date,
          price: item.price,
        });
      }
    });
  });

  var holder = {};

  newArray.forEach(function (d) {
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

  let dateArray = [];
  let revenueArray = [];

  obj2.forEach((seperate, i) => {
    dateArray.push(seperate.date);
    revenueArray.push(seperate.price);
  });
  let finalGraphObj = {
    date: dateArray,
    revenue: revenueArray,
  };
  //console.log({finalGraphObj});
  res.status(200).json(finalGraphObj);
});


//merchant Orders count in Analytics parts
app.get('/MerchantDashboardOrder/:storeName', async (req, res) => {
  console.log('storeName', req.params.storeName);
    const orderData = await Orders.find();
    let newOrderArray = []
    orderData.forEach((item, i) => {
      item.products.forEach((product, j) => {
        if (product.sku !== undefined) {
          newOrderArray.push({
            orderId: item.product_name,
            sku: product.sku,
            store: product.store
          })
        }
      });
    });

    let tempArray = []
    newOrderArray.forEach((item, i) => {
      if (item.store.toLowerCase()===req.params.storeName) {
        tempArray.push({
          orderId: item.orderId,

          sku: item.sku,
          store: item.store,
        })
      }
    });

    let productData = await Products.find()
    let checkStore = []

  tempArray.forEach((item, i) => {
    productData.forEach((product, j) => {
      if (tempArray[i].sku===productData[j].code) {
        checkStore.push(tempArray[i])
      }
    });
  });

    // productData.forEach((product, i) => {
    //   checkStore.forEach((check, index) => {
    //     if (productData[i].code === checkStore[index].sku)
    //     {
    //       checkStore[index].productName = productData[i].name
    //     }
    //   });
    // });
  // let finalData = []
  //   checkStore.forEach((item, i) => {
  //     if (checkStore[i].pStatus==='unpaid') {
  //         finalData.push(checkStore[i])
  //     }
  //   });
    //console.log("final data array", checkStore.length);
    res.status(200).json(checkStore.length)
});


//merchant graphData
app.get('/merchantDasboardGraph/:storeName', async (req, res) => {
  console.log('storeName', req.params.storeName);
  const orderData = await Orders.find();

  let newOrderArray = [];

  orderData.forEach((item, i) => {
    item.products.forEach((product, j) => {
      if (product.sku !== undefined) {
        newOrderArray.push({
          orderId: item.product_name,
          price: item.price,
          created_on: item.created_on,
          store: product.store,
          sku: product.sku,


        })
      }
    });
  });



  let tempArray = []
  newOrderArray.forEach((item, i) => {
    if (item.store.toLowerCase()===req.params.storeName) {
      tempArray.push({
        orderId: item.orderId,
        price: item.price,
        created_on: item.created_on,
        store: item.store,
        sku: item.sku,
      })
    }
  });

  let productData = await Products.find()
  let checkStore = []

tempArray.forEach((item, i) => {
  productData.forEach((product, j) => {
    if (tempArray[i].sku===productData[j].code) {
      checkStore.push(tempArray[i])
    }
  });
});
console.log("checkStore in m Graoh", checkStore);

  // productData.forEach((product, i) => {
  //   checkStore.forEach((check, index) => {
  //     if (productData[i].code === checkStore[index].sku)
  //     {
  //       checkStore[index].productName = productData[i].name
  //     }
  //   });
  // });





  var holder = {};

  checkStore.forEach(function (d) {
    if (holder.hasOwnProperty(moment(d.created_on).format('MMM Do YY'))) {
      holder[moment(d.created_on).format('MMM Do YY')] =
        holder[moment(d.created_on).format('MMM Do YY')] + d.price;
    } else {
      holder[moment(d.created_on).format('MMM Do YY')] = d.price;
    }
  });

  var obj2 = [];

  for (var prop in holder) {
    obj2.push({ date: prop, price: holder[prop] });
  }
  console.log('obj2 in merchant graph', obj2);
  let dateArray = [];
  let revenueArray = [];

  obj2.forEach((item, i) => {
    dateArray.push(obj2[i].date);
    revenueArray.push(obj2[i].price);
  });

  let finalGraphObj = {
    date: dateArray,
    revenue: revenueArray,
  };
  console.log('finalGraphObj', finalGraphObj);
  res.send(finalGraphObj);
});

//merchant graphData by dates
app.get('/merchantDasboardRevenueGraphByDates/:storeName/:start/:end', async (req, res) => {
  console.log('req.body', req.params);
  console.log("start", req.params.start);
   const orderData = await Orders.find({"created_on": {"$gte": new Date(req.params.start), "$lt": new Date(req.params.end)}});
   console.log("sort date data ", orderData);

  let newOrderArray = [];

  orderData.forEach((item, i) => {
    item.products.forEach((product, j) => {
      if (product.sku !== undefined) {
        newOrderArray.push({
          orderId: item.product_name,
          price: item.price,
          created_on: item.created_on,
          store: product.store,
          sku: product.sku,


        })
      }
    });
  });



  let tempArray = []
  newOrderArray.forEach((item, i) => {
    if (item.store.toLowerCase()===req.params.storeName) {
      tempArray.push({
        orderId: item.orderId,
        price: item.price,
        created_on: item.created_on,
        store: item.store,
        sku: item.sku,
      })
    }
  });

  let productData = await Products.find()
  let checkStore = []

tempArray.forEach((item, i) => {
  productData.forEach((product, j) => {
    if (tempArray[i].sku===productData[j].code) {
      checkStore.push(tempArray[i])
    }
  });
});
console.log("checkStore in m Graoh", checkStore);

  var holder = {};

  checkStore.forEach(function (d) {
    if (holder.hasOwnProperty(moment(d.created_on).format('MMM Do YY'))) {
      holder[moment(d.created_on).format('MMM Do YY')] =
        holder[moment(d.created_on).format('MMM Do YY')] + d.price;
    } else {
      holder[moment(d.created_on).format('MMM Do YY')] = d.price;
    }
  });

  var obj2 = [];

  for (var prop in holder) {
    obj2.push({ date: prop, price: holder[prop] });
  }
  console.log('obj2 in merchant graph', obj2);
  let dateArray = [];
  let revenueArray = [];

  obj2.forEach((item, i) => {
    dateArray.push(obj2[i].date);
    revenueArray.push(obj2[i].price);
  });

  let finalGraphObj = {
    date: dateArray,
    revenue: revenueArray,
  };
  console.log('finalGraphObj', finalGraphObj);
  res.send(finalGraphObj);
});

//Top selling Products Merchants

app.get('/merchantTopProducts/:store', async (req, res) => {
  let itemArray = [];

  const data = await Orders.find({});

  let tempTopArray = [];
  //
  // data.forEach((item, i) => {
  //   if (data[i].pStatus === 'Paid') {
  //     tempTopArray.push(data[i]);
  //   }
  // });

  data.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku !== undefined) {
        itemArray.push({
          sku: sss.sku,
          count: sss.quantity,
          store: sss.store
        });
      }
    });
  });

  itemArray.forEach((item, i) => {
    if (item.store.toLowerCase()===req.params.store) {
      tempTopArray.push(itemArray[i])
    }
  });


  var holder = {};

  tempTopArray.forEach(function (d) {
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

  let calOrder = [];

  const productData = await Products.find();

  //console.log(productData.length);

  obj2.forEach((arr, i) => {
    productData.forEach((product, j) => {
      if (product.code === arr.sku) {
        let countItem = product.price * arr.count;

        calOrder.push({
          name: product.name,
          productImage: product.productImage,
          sku: product.code,
          count: arr.count,
          price: product.price,
          revenue: countItem,
        });
      }
    });
  });

  console.log("verify product selling",calOrder);
  //console.log({calOrder});
  let totalOrders = calOrder.sort((a, b) => b - a);
  let top5 = totalOrders.slice(0, 5);
  //console.log({totalOrders});
  res.status(200).json(top5);
});


//order create callback api
app.post('/store/:shop/:topic/:subtopic', async function (request, response) {
  const shop = request.params.shop;
  let topic = request.params.topic;
  const subtopic = request.params.subtopic;
  topic = topic + '/' + subtopic;
  console.log('topic -->', topic);
  console.log('request.body of Orders', request.body);
  const productDetails = [];
  //console.log("order details", request.body);

  request.body.line_items.forEach((item, i) => {
    productDetails.push({
      id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      sku: item.sku,
      store: item.vendor.toLowerCase(),
    });
  });

  const orders = new Orders({
    product_name: request.body.id,
    currency: request.body.currency,
    price: request.body.total_price,
    created_on: request.body.created_at,
    paymentMode: request.body.gateway,
    products: productDetails,
    customer: {
      name: request.body.customer.first_name + request.body.customer.last_name,
      email: request.body.email,
      address:
        request.body.shipping_address.address1 +
        request.body.shipping_address.address2,
      city: request.body.shipping_address.city,
      zip: request.body.shipping_address.zip,
      phone: request.body.shipping_address.phone,
      state: request.body.shipping_address.province,
      country: request.body.shipping_address.country,
      varient: request.body.varient,
      quantity: request.body.line_items.quantity,
      paid: request.body.total_price,
      fulfillmentStatus: "Unfulfilled",
    },
  });

  try {
    if (request.body) {
      console.log('order details custom is:', orders);
      const data = await orders.save();
      console.log('Orders Saved Successfully');
      response.end();
    }
  } catch (error) {
    console.log('orders saved error', error);
  }
});

//settings get
app.get('/supplierProfile:id', async (req, res) => {
  try {
    let supp = await User.findOne({ _id: req.params.id });
    res.send(supp);
  } catch (error) {
    console.error(error);
  }
});

//update settings
app.post('/settingsUpdate', async (req, res) => {
  console.log(req.body);
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  User.findOneAndUpdate(
    {
      supplier_id: req.body.id,
    },
    {
      name: req.body.name,
      location: req.body.location,
      phoneNo: req.body.phoneNo,
      businessName: req.body.businessName,
      password: hashPassword,
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err, result) => {
      if (!err) {
        res.sendStatus(200);
      } else {
        console.log('error ', err);
      }
    }
  );
});

app.post('/supplierPaymentUpdate', async (req, res) => {
  console.log(req.body);
  //hash the password

  // User.findOneAndUpdate(
  //   {
  //     supplier_id: req.body.id,
  //   },
  //   {
  //     pInfo:req.body.pInfo
  //   },
  //   {
  //     new: true,
  //     useFindAndModify: false,
  //   },
  //   (err, result) => {
  //     if (!err) {
  //       res.sendStatus(200);
  //     } else {
  //       console.log("error ", err);
  //     }
  //   }
  // );
});

// Merchant settings get
app.get('/merchantProfile:id', async (req, res) => {
  try {
    let mer = await MerchantUser.findOne({ _id: req.params.id });
    res.send(mer);
  } catch (error) {
    console.error(error);
  }
});

// Merchant update settings
app.post('/settingsUpdateMerchant', (req, res) => {
  console.log(req.body);

  MerchantUser.findOneAndUpdate(
    {
      supplier_id: req.body.id,
    },
    {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err, result) => {
      if (!err) {
        res.sendStatus(200);
      } else {
        console.log('error ', err);
      }
    }
  );
});

//supplier orders fulfill and add tracking no.
app.patch('/suppOrderFulfill/:id', async (req, res) => {
console.log("req.params", req.params);
console.log(req.body);
  const orderID = req.params.id;
  const trackno = req.body.fulfillment.tracking_number;

  // await request
  //   .post(
  //     'https://www.melisxpress.com/orders/' +
  //       req.params.store +
  //       '/' +
  //       req.params.id,
  //     { json: jsonData }
  //   )
  //   .then((data) => {
      await Orders.findOneAndUpdate(
        {
          product_name: orderID,
        },
        {
          tracking_number: trackno,
          fulfillmentStatus: "Fulfilled"
        },
        {
          new: true,
          useFindAndModify: false,
        },
        (err, result) => {
          if (!err) {
            console.log("result is", result);
            res.json('success');
          } else {
            console.log('error ', err);
          }
        }
      );
    //})
    // .catch((error) => {
    //   console.log(error.message);
    // });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT || 5000, () =>
  console.log('server is listening on 5000...')
);
