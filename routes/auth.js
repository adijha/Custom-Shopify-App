const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../model/User');
const AdminUser = require('../model/AdminUser');
const MerchantUser = require('../model/MerchantUser');
const Products = require('../model/Products');
const CsvTest = require('../model/CsvTest');
const Category = require('../model/Category');
const Margin = require('../model/Margin');
const { userValidation } = require('../validation');
const fileUpload = require('express-fileupload');
const csv = require('csvtojson');
const request = require('request-promise');
const Orders = require('../model/Orders');
const PaymentMode = require('../model/PaymentMode');
const Transaction = require('../model/Transaction');
const axios = require('axios');
var nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const RequestProduct = require('../model/RequestProduct')

const {
  revenueSupplier,
  orderSupplier,
  productLength,
} = require('../utils/resuableFunction');

const upload = multer({
  storage: multer.memoryStorage(),
});
//Admin Registration

router.post('/admin', async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //user email already exists
  const emailExist = await AdminUser.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email Already Exists');

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const adminUser = new AdminUser({
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await adminUser.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

//get Admin by Id
router.get('/adminUser/:id', async (req, res) => {
  try {
    const data = await AdminUser.findOne({ _id: req.params.id });
    // console.log(data)
    res.json(data);
  } catch (error) {
    res.json({ message: error });
  }
});

//update Admin credentenials
router.patch('/adminAccount', async (req, res) => {
  // const salt = await bcrypt.genSalt(10);
  // const hashPassword = await bcrypt.hash(req.body.password, salt);
  const updateUser = {
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phone,
    username: req.body.name,
  };
  // console.log(updateUser);
  try {
    const data = await AdminUser.findOneAndUpdate(
      { _id: req.body.id },
      { $set: updateUser }
    );
    res.send('success');
  } catch (error) {
    console.log({ message: error.message });
  }
});

//Admin Generate Token for login
router.post('/adminLogin', async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //if email exist
  const user = await AdminUser.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Wrong Email Entered');

  //check password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Password');

  //create and assign token
  let userInfo = {
    id: user._id,
    email: user.email,
    category: user.category
  };
  const token = jwt.sign(userInfo, process.env.TOKEN_SECRET);
  res.send(token);
});

//tranaction detail saved
router.post('/transactionDetail',async (req, res)=>{

  const tranaction = await new Transaction({
    supplier_id: req.body.supplier_id,
    trans_id: req.body.trans_id,
    amount_paid: req.body.amount_paid,
    pmethod: req.body.pmethod,
    date: req.body.date,
    time: req.body.time
  });
  try{
    const saveTransaction = await tranaction.save();
    console.log(saveTransaction);
    res.send('success')
  }
  catch(error){
    console.log("transaction", error);
  }
})


//get Transaction Details

router.get('/getTransaction', async (req, res)=>{
  try {
    let data = await Transaction.find()
    res.send(data)
  } catch (e) {
      console.log("get tranaction", e);
  }
})

//merchant order from shopify
router.get('/merchantShopifyOrdersAll/:store', async (req, res)=>{
console.log(req.params.store);
  const orderData = await Orders.find();
  let newOrderArray = []
  orderData.forEach((item, i) => {
    item.products.forEach((product, j) => {
      if (product.sku !== undefined) {
        newOrderArray.push({
          orderId: item.product_name,
          total_amount: item.price,
          date: item.created_on,
          paymentMode: item.paymentMode,
          customer_name: item.customer,

          sku: product.sku,
          item_price: product.price,
          quantity: product.quantity,
          store: product.store,
          pStatus: item.pStatus
        })
      }
    });
  });

  checkStore = []

  newOrderArray.forEach((item, i) => {
    if (item.store.toLowerCase()===req.params.store) {
      checkStore.push({
        orderId: item.orderId,
        total_amount: item.total_amount,
        date: item.date,
        paymentMode: item.paymentMode,
        customer_detail: item.customer_name,
        item_price: item.item_price,
        sku: item.sku,
        productImage:[],
        quantity: item.quantity,
        productName: '',
        shippingCharge: {},
        store: item.store,
        pStatus: item.pStatus
      })
    }
  });

  let productData = await Products.find()

  productData.forEach((product, i) => {
    checkStore.forEach((check, index) => {
      if (productData[i].code === checkStore[index].sku)
      {
        checkStore[index].productImage= productData[i].productImage;
        checkStore[index].productName = productData[i].name
        checkStore[index].shippingCharge = productData[i].shippingCharge
      }
    });
  });
// let finalData = []
//   checkStore.forEach((item, i) => {
//     if (checkStore[i].pStatus==='unpaid') {
//         finalData.push(checkStore[i])
//     }
//   });
//   console.log("final data array", finalData);
  // const filterItems = (checkStore.filter(plist=>{
  //   return plist.pStatus ==='Paid';
  // }))
  // console.log("order Deetails length", checkStore.length);
  // console.log("result is paid order merchant", filterItems.length);
  res.send(checkStore)
})




//merchant fulfiled order from shopify
router.get('/merchantShopifyOrdersFulfilled/:store', async (req, res)=>{
console.log(req.params.store);
  const orderData = await Orders.find();
  let newOrderArray = []
  orderData.forEach((item, i) => {
    item.products.forEach((product, j) => {
      if (product.sku !== undefined) {
        newOrderArray.push({
          orderId: item.product_name,
          total_amount: item.price,
          date: item.created_on,
          paymentMode: item.paymentMode,
          customer_name: item.customer,

          sku: product.sku,
          item_price: product.price,
          quantity: product.quantity,
          store: product.store,
          pStatus: item.pStatus
        })
      }
    });
  });

  checkStore = []

  newOrderArray.forEach((item, i) => {
    if (item.store.toLowerCase()===req.params.store) {
      checkStore.push({
        orderId: item.orderId,
        total_amount: item.total_amount,
        date: item.date,
        paymentMode: item.paymentMode,
        customer_detail: item.customer_name,
        item_price: item.item_price,
        sku: item.sku,
        productImage:[],
        quantity: item.quantity,
        productName: '',
        shippingCharge: {},
        store: item.store,
        pStatus: item.pStatus
      })
    }
  });

  let productData = await Products.find()

  productData.forEach((product, i) => {
    checkStore.forEach((check, index) => {
      if (productData[i].code === checkStore[index].sku)
      {
        checkStore[index].productImage= productData[i].productImage;
        checkStore[index].productName = productData[i].name
        checkStore[index].shippingCharge = productData[i].shippingCharge
      }
    });
  });
let finalData = []
  checkStore.forEach((item, i) => {
    if (checkStore[i].pStatus==='Paid') {
        finalData.push(checkStore[i])
    }
  });
  console.log("final data array", finalData);
  // const filterItems = (checkStore.filter(plist=>{
  //   return plist.pStatus ==='Paid';
  // }))
  // console.log("order Deetails length", checkStore.length);
  // console.log("result is paid order merchant", filterItems.length);
  res.send(finalData)
})



//merchant unfulfilled order from shopify
router.get('/merchantShopifyOrdersUnfulfilled/:store', async (req, res)=>{
console.log(req.params.store);
  const orderData = await Orders.find();
  let newOrderArray = []
  orderData.forEach((item, i) => {
    item.products.forEach((product, j) => {
      if (product.sku !== undefined) {
        newOrderArray.push({
          orderId: item.product_name,
          total_amount: item.price,
          date: item.created_on,
          paymentMode: item.paymentMode,
          customer_name: item.customer,

          sku: product.sku,
          item_price: product.price,
          quantity: product.quantity,
          store: product.store,
          pStatus: item.pStatus
        })
      }
    });
  });

  checkStore = []

  newOrderArray.forEach((item, i) => {
    if (item.store.toLowerCase()===req.params.store) {
      checkStore.push({
        orderId: item.orderId,
        total_amount: item.total_amount,
        date: item.date,
        paymentMode: item.paymentMode,
        customer_detail: item.customer_name,
        item_price: item.item_price,
        sku: item.sku,
        productImage:[],
        quantity: item.quantity,
        productName: '',
        shippingCharge: {},
        store: item.store,
        pStatus: item.pStatus
      })
    }
  });

  let productData = await Products.find()

  productData.forEach((product, i) => {
    checkStore.forEach((check, index) => {
      if (productData[i].code === checkStore[index].sku)
      {
        checkStore[index].productImage= productData[i].productImage;
        checkStore[index].productName = productData[i].name
        checkStore[index].shippingCharge = productData[i].shippingCharge
      }
    });
  });
let finalData = []
  checkStore.forEach((item, i) => {
    if (checkStore[i].pStatus==='unpaid') {
        finalData.push(checkStore[i])
    }
  });
  console.log("final data array", finalData);
  // const filterItems = (checkStore.filter(plist=>{
  //   return plist.pStatus ==='Paid';
  // }))
  // console.log("order Deetails length", checkStore.length);
  // console.log("result is paid order merchant", filterItems.length);
  res.send(finalData)
})








//merchant order sent to supplier after payment
router.get('/supplierOrderMerchant', async (req, res)=>{
  console.log(req.params.store);
    const orderData = await Orders.find();
    let newOrderArray = []
    orderData.forEach((item, i) => {
      item.products.forEach((product, j) => {
        if (product.sku !== undefined) {
          newOrderArray.push({
            orderId: item.product_name,
            total_amount: item.price,
            date: item.created_on,
            paymentMode: item.paymentMode,
            customer_name: item.customer,

            sku: product.sku,
            item_price: product.price,
            quantity: product.quantity,
            store: product.store,
            pStatus: item.pStatus
          })
        }
      });
    });

    checkStore = []

    newOrderArray.forEach((item, i) => {
      if (item.store.toLowerCase()===req.params.store) {
        checkStore.push({
          orderId: item.orderId,
          total_amount: item.total_amount,
          date: item.date,
          paymentMode: item.paymentMode,
          customer_detail: item.customer_name,
          item_price: item.item_price,
          sku: item.sku,
          productImage:[],
          quantity: item.quantity,
          productName: '',
          shippingCharge: {},
          store: item.store,
          pStatus: item.pStatus
        })
      }
    });

    let productData = await Products.find()

    productData.forEach((product, i) => {
      checkStore.forEach((check, index) => {
        if (productData[i].code === checkStore[index].sku)
        {
          checkStore[index].productImage= productData[i].productImage;
          checkStore[index].productName = productData[i].name
          checkStore[index].shippingCharge = productData[i].shippingCharge
        }
      });
    });
  let finalData = []
    checkStore.forEach((item, i) => {
      if (checkStore[i].pStatus==='Paid') {
          finalData.push(checkStore[i])
      }
    });
    console.log("final data array", finalData);
    // const filterItems = (checkStore.filter(plist=>{
    //   return plist.pStatus ==='Paid';
    // }))
    // console.log("order Deetails length", checkStore.length);
    // console.log("result is paid order merchant", filterItems.length);
    res.send(finalData)
})


//update merchant order status and sent to supplier
router.patch('/supplierOrderFromMerchant/:orderId', async (req, res)=>{


    try {
      const data = await Orders.findOneAndUpdate(
        { "product_name": req.params.orderId },
        { $set:{
            "pStatus": "Paid",
          }
        },{
          new: true,
          useFindAndModify: false,
        },(err, result) => {
          if (!err) {
            console.log("update result", result);
            res.send('success');
          } else {
            console.log("error ", err);
          }
        }
      );

    } catch (error) {
      res.json({ message: error.message });
    }


  //console.log("data for save supplier order", req.body.name);
})

//order Details section in admin

router.get('/customOrderDetails', async (req, res)=>{

  const orderData = await Orders.find();


  let firstArr = []
  let secondArr = []
  let thirdArr = []
  let doneArr = []

  orderData.forEach((item, i) => {
    item.products.forEach((product, j) => {

      if (product.sku !== undefined) {
        firstArr.push({

          orderId: item.product_name,
          sku: product.sku,
          total_price: item.price,
          quantity: product.quantity,
          store: product.store,

          customer_name: item.customer,
          order_date: item.created_on
        })
      }

    });
  });

  const productsData = await Products.find()

  productsData.forEach((data, k) => {
    firstArr.forEach((arr, l) => {
      if (data.code===arr.sku) {
        secondArr.push({
          orderId: arr.orderId,
          sku: arr.sku,
          total_price: arr.total_price,
          quantity: arr.quantity,
          store: arr.store,
          customer_name: arr.customer_name,
          order_date: arr.order_date,
          productImage:data.productImage,
          shipping: data.shippingCharge,
          product_price: data.price,
          supplier_id: data.supplier_id
        })
      }
    });
  });

  const supplierUser = await User.find()

  secondArr.forEach((sArr, m) => {
    supplierUser.forEach((user, n) => {
      if (sArr.supplier_id==user._id) {
        thirdArr.push({
          orderId: sArr.orderId,
          sku: sArr.sku,
          total_price: sArr.total_price,
          quantity: sArr.quantity,
          store: sArr.store,
          customer_name: sArr.customer_name,
          order_date: sArr.order_date,
          shipping: sArr.shipping,
          product_price: sArr.product_price,
          supplier_id: sArr.supplier_id,
          supplierName: user.supplier_id,
          productImage:sArr.productImage

        })
      }

    });
  });


const mUser = await MerchantUser.find()

thirdArr.forEach((tArr, o) => {
  mUser.forEach((muser, p) => {
    if (tArr.store===muser.store) {
      doneArr.push({
        orderId: tArr.orderId,
        sku: tArr.sku,
        total_price: tArr.total_price,
        quantity: tArr.quantity,
        store: tArr.store,
        customer_name: tArr.customer_name,
        order_date: tArr.order_date,
        shipping: tArr.shipping,
        product_price: tArr.product_price,
        supplier_id: tArr.supplier_id,
        supplierName: tArr.supplierName,
        productImage:tArr.productImage,
        merchantName: muser.firstName
      })
    }
  });

});
console.log("customMerchantDetail", doneArr);

res.send(doneArr)

})





//merchant sign up
router.post('/merchant', async (req, res) => {
  //let validate the data
  // console.log(req.body);
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //user email already exists
  const emailExist = await MerchantUser.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email Already Exists');

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const currDate = (sep) => {
    let d = new Date();
    let DD = d.getDate();
    let MM = d.getMonth() + 1;
    let YY = d.getFullYear();
    return DD + sep + MM + sep + YY;
  };

  const merchantUser = await new MerchantUser({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNo: req.body.phoneNo,
    email: req.body.email,
    password: hashPassword,
    joiningDate: currDate('-'),
    store: req.body.store,
  });
  try {
    const savedUser = await merchantUser.save();
    res.send('success');
  } catch (err) {
    res.status(400).send(err);
  }
});

//login and generate token

router.post('/merchantLogin', async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //if email exist
  const user = await MerchantUser.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Wrong Email Entered');

  //check password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Password');

  //create and assign token
  let userInfo = {
    id: user._id,
    email: user.email,
    category: user.category,
    store: user.store
  };

  const token = jwt.sign(userInfo, process.env.TOKEN_SECRET);
  res.send(token);
});

router.get('/merchant', async (req, res) => {
  let detail = [];
  try {
    const data = await MerchantUser.find();
    data.forEach((item, i) => {
      const obj = {
        id: item._id,
        email: item.email,
        first: item.firstName,
        lastName: item.lastName,
        phone: item.phoneNo,
        store: item.store,
        joiningDate: item.joiningDate,
      };
      detail.push(obj);
    });
    res.json(detail);
  } catch (error) {
    res.json({ message: error });
  }
});

//Custom Details merchant list

router.get('/customMerchantDetail', async (req, res) => {
  let detail = [];
  let mDetail = [];
  let sName = [];
  let countItem = 0;
  let countPrice = 0;
  let finalArrU = [];

  let resArray = [];

  const data = await MerchantUser.find();
  // console.log(data);
  const orderData = await Orders.find();

  data.forEach((item, i) => {
    orderData.forEach((od, j) => {
      od.products.forEach((pro, k) => {
        if (item.store === pro.store) {
          const obj = {
            id: item._id,
            email: item.email,
            firstName: item.firstName,
            lastName: item.lastName,
            phone: item.phoneNo,
            joiningDate: item.joiningDate,
            store: pro.store,
            price: parseInt(pro.price),
            count: 1,
          };

          detail.push(obj);
        }
        sName.push(item.store);

      });
    });
  });
  sName = [...new Set(sName)];
  console.log({ sName });
  //
  // sName.forEach((sn, m) => {
  //   detail.forEach((det, n) => {
  //     if (sn === det.store) {
  //       countItem += det.count;
  //       countPrice += det.price;
  //     } else {
  //       countItem = 0;
  //       countPrice = 0;
  //     }
  //     const finalObj = {
  //       store: sn,
  //       price: countPrice,
  //       count: countItem,
  //     };
  //
  //     finalArrU.push(finalObj);
  //   });
  //
  // });


  var holder = {};

  detail.forEach(function (d) {
    if (holder.hasOwnProperty(d.store)) {
      holder[d.store] = holder[d.store] + d.price;
    } else {
      holder[d.store] = d.price;
    }
  });

  var obj2 = [];

  for (var prop in holder) {
    obj2.push({ store: prop, price: holder[prop] });
  }

  var holder1 = {};

  detail.forEach(function (d) {
    if (holder1.hasOwnProperty(d.store)) {
      holder1[d.store] = holder1[d.store] + d.count;
    } else {
      holder1[d.store] = d.count;
    }
  });

  var obj3 = [];

  for (var prop in holder1) {
    obj3.push({ store: prop, count: holder1[prop] });
  }
  console.log({obj2});
  console.log({obj3});

let randomArray = []
  obj2.forEach((priceObj, i) => {
    obj3.forEach((countObj, j) => {
      if (countObj.store=== priceObj.store) {
        randomArray.push({
          store: priceObj.store,
          price: priceObj.price,
          count: countObj.count,
        })
      }

    });
  });
console.log("randomArray", randomArray);

sName.forEach((name, i) => {
  let obj={};
  randomArray.forEach((item, i) => {

    if (name === item.store) {
      obj={
        store: name,
        price: item.price,
        count: item.count
      }
    }
    // else if(name!= item.store){
    //   obj={
    //     store: name,
    //     price:0,
    //     count:0
    //   }
    // }

  });

finalArrU.push(obj)

});
let matchArray =[]
sName.forEach((name, i) => {
  matchArray.push({
    store:name,
    price:0,
    count:0
  })
});
console.log("match Array", matchArray);
let decideArray = []
matchArray.forEach((match, i) => {
  randomArray.forEach((random, index) => {
    if (matchArray[i].store === randomArray[index].store)
    { matchArray[i].price = randomArray[index].price;
      matchArray[i].count = randomArray[index].count;
    }

  });

});
console.log("decideArray", matchArray);


  //console.log("finalArrU", finalArrU);
let newObject = {}
  data.forEach((delta, x) => {
    matchArray.forEach((final, Y) => {

      if (delta.store === final.store) {
         newObject = {
          id: delta._id,
          email: delta.email,
          firstName: delta.firstName,
          lastName: delta.lastName,
          phone: delta.phoneNo,
          joiningDate: delta.joiningDate,
          store: final.store,
          price: final.price,
          count: final.count,
        }
        mDetail.push(newObject);

      }



    });
    // finalArrU.forEach((final, y)=>{
    //   if (delta.store !== final.store) {
    //     mDetail.push({
    //       id: delta._id,
    //       email: delta.email,
    //       firstName: delta.firstName,
    //       lastName: delta.lastName,
    //       phone: delta.phoneNo,
    //       joiningDate: delta.joiningDate,
    //       store: delta.store,
    //       price: 0,
    //       count: 0,
    //     })
    //   }
    // })

  });

  // console.log('final object is', mDetail);

  res.send(mDetail);

  //     data.forEach((item, i) => {
  //      const obj = {

  //      }
  //      detail.push(obj)
  //
  //    });
  //
  //
  //      let orderArr =[]
  //      let expandArr = []
  //
  //     orderData.forEach((ord, i) => {
  //      ord.products.forEach((product, i) => {
  //          const productObj = {
  //            store: product.store,
  //            price: parseInt(product.price),
  //            count:1
  //          };
  //          const expandObj = {
  //            name: product.name,
  //            sku: product.sku,
  //            price: parseInt(product.price),
  //            count:1
  //          }
  //          orderArr.push(productObj)
  //          expandArr.push(expandObj)
  //
  //
  //      });
  //  });
  //
  //  let finalArr = []
  //  let finalExpandArr=[]
  //
  //      orderArr.forEach((pro, j) => {
  //          if (!this[pro.store]) {
  //            this[pro.store] = {store: pro.store, count: 0, price:0}
  //            finalArr.push(this[pro.store]);
  //          }
  //          this[pro.store].price += pro.price
  //          this[pro.store].count += pro.count
  //
  //      });
  //
  //      expandArr.forEach((pro, k) => {
  //          if (!this[pro.sku]) {
  //            this[pro.sku] = {name: pro.name, sku:pro.sku, count: 0, price:0}
  //            finalExpandArr.push(this[pro.sku]);
  //          }
  //          this[pro.sku].price += pro.price
  //          this[pro.sku].count += pro.count
  //
  //      },{});
  //      let merchantArr = []
  //
  //       finalArr.forEach((final, i) => {
  //        detail.forEach((d, j) => {
  //          if (d.store===final.store) {
  //            const newObject = {
  //              id: d.id,
  //              email: d.email,
  //              firstName: d.first,
  //              lastName: d.lastName,
  //              phone: d.phone,
  //              store: d.store,
  //              joiningDate: d.joiningDate,
  //              price: final.price,
  //              count:final.count,
  //              product:finalExpandArr
  //            }
  //            merchantArr.push(newObject)
  //          }
  //        });
  //
  //      });
  //  console.log(merchantArr)
  //  res.send(merchantArr)
  //
  //
  // } catch (error) {
  //     console.log(error)
  //   }
});

//sepecific merchant with id
router.get('/merchant/:id', async (req, res) => {
  const detail = [];
  try {
    const data = await MerchantUser.find({ _id: req.params.id });

    data.forEach((item, i) => {
      const obj = {
        email: item.email,
        first: item.firstName,
        lastName: item.lastName,
        phone: item.phoneNo,
        store: item.store,
      };
      detail.push(obj);
    });

    // console.log(detail);
    res.json(detail);
  } catch (error) {
    res.json({ message: error });
  }
});

//Merchant Orders
router.get('/merchantOrderDetail/:store', async (req, res) => {
  let productArr = [];
  let productNameArr = [];
  let calItem = 0;
  let calPrice = 0;

  const data = await Orders.find();

  data.forEach((item, i) => {
    item.products.forEach((product, i) => {
      if (product.store == req.params.store) {
        const productObj = {
          name: product.name,
          sku: product.sku,
          price: parseInt(product.price),
          store: product.store,
          count: 1,
        };
        productArr.push(productObj);
        productNameArr.push(product.sku);
      }
    });
  });
  var finalArr = [];

  var holder = {};

  productArr.forEach(function (d) {
    if (holder.hasOwnProperty(d.sku)) {
      holder[d.sku] = holder[d.sku] + d.price;
    } else {
      holder[d.sku] = d.price;
    }
  });

  var obj = [];

  for (var prop in holder) {
    obj.push({ sku: prop, price: holder[prop] });
  }

  var holder1 = {};

  productArr.forEach(function (d) {
    if (holder1.hasOwnProperty(d.sku)) {
      holder1[d.sku] = holder1[d.sku] + d.count;
    } else {
      holder1[d.sku] = d.count;
    }
  });

  var obj2 = [];

  for (var prop in holder1) {
    obj2.push({ sku: prop, count: holder1[prop] });
  }

  // productArr.forEach((pro, j) => {
  //     if (!this[pro.sku]) {
  //       this[pro.sku] = {name: pro.name, sku:pro.sku, count: 0, price:0}
  //       finalArr.push(this[pro.sku]);
  //     }
  //     this[pro.sku].price += pro.price
  //     this[pro.sku].count += pro.count
  //
  // },{});
  let newArray = [];
  obj.forEach((item, i) => {
    obj2.forEach((test, i) => {
      if (item.sku === test.sku) {
        const newObject = {
          sku: test.sku,
          count: test.count,
          price: item.price,
        };
        newArray.push(newObject);

          store: req.params.store
        }
      //  newArray.push(newObject)

    });
  });
  //   let finalObj = [];
  //
  // productArr.forEach((item, i) => {
  //     newArray.forEach((arr, i) => {
  //       if (arr.sku===item.sku) {
  //         const finalObject = {
  //           name: item.name,
  //           sku: arr.sku,
  //           price: arr.price,
  //           count: arr.count
  //         }
  //         finalObj.push(finalObject)
  //       }
  //     });
  //
  // });

  // console.log(finalObj, "final");
//   let finalObj = [];
//
// productArr.forEach((item, i) => {
//     newArray.forEach((arr, i) => {
//       if (arr.sku===item.sku) {
//         const finalObject = {
//           name: item.name,
//           sku: arr.sku,
//           price: arr.price,
//           count: arr.count
//         }
//         finalObj.push(finalObject)
//       }
//     });
//
// });


// console.log(finalObj, "final");

console.log("check data", newArray);
  res.send(newArray)

  res.send(newArray);
});

/*Supplier Part*/

//Register Account
router.post('/signUp', async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //user email already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email Already Exists');

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    supplier_id: req.body.supplier_id,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

//get all supplier created
router.get('/supplier', async (req, res) => {
  try {
    const data = await User.find();

    res.json(data);
  } catch (error) {
    res.json({ message: error });
  }
});

//delete specific supplier
router.delete("/supplierDel/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const data = await User.deleteOne({ _id: req.params.id });
    res.json("success");
  } catch (e) {
    res.json({ message: error.message });
  }
});

//promise return all supplier array of total product count, order, revenue

var bar = new Promise(async (resolve, reject) => {
  let supplierArr = [];
  const supplierData = await User.find();

  supplierData.forEach(async (data, i) => {
    let revenue = await revenueSupplier(data._id);

    let order = await orderSupplier(data._id);
    let product = await productLength(data._id);

    supplierArr.push({
      id: data._id,
      supplier_id: data.supplier_id,
      name: data.name,
      email: data.email,
      order: order,
      product: product,
      revenue: revenue,
    });
  });
  // console.log(supplierArr);

  return resolve(supplierArr);
});


//get supplier with revenue
router.get('/supplierFullDetails', async (req, res) => {
  console.log("supplier custom api");
  bar.then((data) => {
    res.send(data);
  });
});

const newFunction =async ()=>{

  const supplierData = await User.find()

  let suppObj = {}

   const result = await supplierData.map( async(data, i) => {
     var supplierArr = []

    let revenue =  await revenueSupplier(data._id);
    let order =  await orderSupplier(data._id);
    let product = await productLength(data._id)
      return {
          id: data._id,
          supplier_id: data.supplier_id,
          name: data.name,
          email: data.email,
          order: order,
          revenue: revenue,
          product: product
        };

  });

  return await Promise.all(result)
}



//get Supplier Revenue and order
router.get('/supplier/newData', async (req, res)=>{
  const data = await newFunction()
  res.send(data)
})

//sepcific supplier data total order, product, revenue

router.get('/supplierDetails/:id', async (req, res) => {
  // console.log(req.params.id);

  bar.then((data) => {
    let obj = {};

    data.forEach((item, i) => {
      if (item.id == req.params.id) {
        obj = {
          id: item.id,
          supplier_id: item.supplier_id,
          name: item.name,
          email: item.email,
          order: item.order,
          product: item.product,
          revenue: item.revenue,
        };
      }
    });
    // console.log({ obj });
    res.send(obj);
  });
});

router.get('/supplier/:id', async (req, res) => {
  console.log('id is', req.params.id);
  try {
    const data = await User.findOne({ _id: req.params.id });
    const obj = {
      supplier_id: data.supplier_id,
      email: data.email,
      name: data.name,
    };
    res.json(obj);
  } catch (error) {
    res.json({ message: error });
  }
});

//supplier payment via admin
router.get('/adminPaymentSupplier', async (req, res)=>{

const data = await newFunction()
  let result = await data
  let transData = await Transaction.find()
  let firstArr=[]
  transData.forEach((item, i) => {
    firstArr.push({
      supplier_id: item.supplier_id,
      amount: item.amount_paid
    })
  });

  var holder = {};
  firstArr.forEach(function (d) {
    if (holder.hasOwnProperty(d.supplier_id)) {
      holder[d.supplier_id] = holder[d.supplier_id] + d.amount;
    } else {
      holder[d.supplier_id] = d.amount;
    }
  });

  var obj2 = [];
  for (var prop in holder) {
    obj2.push({ supplier_id: prop, amount: holder[prop] });
  }

let resultArray = await result

console.log("before resultArray", resultArray);

obj2.forEach((trans, z) => {
resultArray.forEach((res, y) => {
  if (obj2[z].supplier_id===resultArray[y].id.toString()) {
      resultArray[y].amount = obj2[z].amount
    }
  });
});
console.log("resArray ", resultArray);




  res.send(resultArray)

})

//update Supplier
router.patch('/update', async (req, res) => {
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // console.log(updateUser);
  try {
    const data = await User.findOneAndUpdate(
      { _id: req.body._id },
      {
        supplier_id: req.body.supplier_id,
        email: req.body.email,
        password: hashPassword,
      },{
        new: true,
        useFindAndModify: false,
      },
      (err, result) => {
        if (err) {
          console.log("error ", err);
        }
        return res.send('success');
      }
    );
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Generate login token and pass to supplier
router.post('/login', async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Wrong Email Entered');

  //check password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Password');

  //create and assign token
  let userInfo = {
    id: user._id,
    email: user.email,
    category: user.category,
  };
  const token = jwt.sign(userInfo, process.env.TOKEN_SECRET);
  res.send(token);
});

//supplier form data sent to Email
router.post('/SupplierForm', (req, res) => {
  console.log(req.body);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ashish.goyal7118@gmail.com',
      pass: 'ashish@718',
    },
  });

  var mailOptions = {
    from: 'ashish.goyal7118@gmail.com',
    to: 'goyal.ashish062@gmail.com',
    subject: 'supplier form response details',
    html: `
  <b>Personal Details</b>
  <br>
  1. name: ${req.body.name}<br>
  2. email: ${req.body.email}<br>
  3. phone no: ${req.body.phoneNo}<br>
  <br>
  <br>
  <b>Company Details</b>
  1. Name of Business: ${req.body.businessName}
  <br>
  2. Website Link: ${req.body.website}
  <br>
  3. VAT or Tax ID: ${req.body.VAT}
  <br>
  4. What and all categories of product  you are dealing with? : ${req.body.categories}
  <br>
  5. Please tell us your different warehouse locations around the world  : ${req.body.warehouse}
  <br>
  <br>
  <br>
  <b>Shipping Details</b>
  <br>
  1. Do you use e-packet shipping? (Yes/No) : ${req.body.epacket}
  <br>
  2. If No, then What shipping method you use for e-packet countries? : ${req.body.epacketShipping}
  <br>
  3. Please tell us the approximate processing time of the order. (We are only looking for suppliers who can agree to process the order in 1-3 days) : ${req.body.processing}
  <br>
  4. Approximate number of days for delivery to
      <ul>
      <li> e-packet countries : ${req.body.epacketCountry} </li>
      <li>Non e-packet countries: ${req.body.nonEpacketCountry}</li>
      </ul>
      <br>
  5. Do you provide fastest shipping or express shipping to US? Please tell us the shipping courier name, shipping charges and approximate days of delivery. : ${req.body.fastUS}
  <br>
  <br>
  <b>Branding and Return Management</b>
  <br>
  1. Will you be able to provide branded invoicing? (Yes/No) : ${req.body.brandedInvoice}
  <br>
  2. Will you be able to branded packaging? (Yes/No) : ${req.body.brandedPackaging}
  <br>
  3. What is the minimum number of orders you require for branded packaging? : ${req.body.minimumOrder}
  <br>
  4. If we have any return in case of damage or any other reason. Will you buy back or replace it and let us know your return management. : ${req.body.returnManagement}
  <br>
  `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send(error);
    } else {
      res.send('success');
    }
  });
});

//save supplier payment details
router.post('/paymentDetails', async (req, res) => {
  const paymentMode = new PaymentMode({
    supplier_id: req.body.supplier_id,
    info: req.body,
  });
  try {
    const data = await paymentMode.save();
    // console.log('data is', data);
    res.send('Success');
  } catch (error) {
    res.send(error);
  }
});


//get supplier received payment details
router.get('/paymentDetails/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    const data = await PaymentMode.find({ supplier_id: req.params.id });
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

/*Product Part*/
// product list
router.get('/product', async (req, res) => {
console.log("product api hit");
  try {
    const item = await Products.find();
    console.log("item", item);
    res.json(item);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get('/customProductDetail', async (req, res)=>{


  const productData = await Products.find()
  const orderData = await Orders.find()

  let priceArr = []
  let quanArr = []
  let finalArray = []
  let dupArray = []

  productData.forEach((ddd, i) => {
    dupArray.push({
      varients: ddd.varients,
      options: ddd.options,
      _id: ddd._id,
      supplier_id: ddd.supplier_id,
      name: ddd.name,
      price: ddd.price,
      quantity: ddd.qauntity,
      warranty: ddd.warranty,
      description: ddd.description,
      category: ddd.category,
      code: ddd.code,
      weight: ddd.weight,
      productImage: ddd.productImage,
      uploaded_on: ddd.uploaded_on,
      size: ddd.size,
      shippingCharge: ddd.shippingCharge,
      selliingPrice: ddd.selliingPrice,
      revenue: 0,
      order:0

    })
  });

console.log("new product Array achievement", dupArray);

  orderData.forEach((item, i) => {
      item.products.forEach((data, j) => {
        productData.forEach((pro, i) => {
          if (pro.code === data.sku) {
            priceArr.push({
              sku: data.sku,
              price: parseInt(data.price)
            })
            quanArr.push({
              sku: data.sku,
              quantity: parseInt(data.quantity)
            })
          }
        });


      });
  });



  var holder = {};

  priceArr.forEach(function (d) {
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


  var holder1 = {};

  quanArr.forEach(function (d) {
    if (holder1.hasOwnProperty(d.sku)) {
      holder1[d.sku] = holder1[d.sku] + d.quantity;
    } else {
      holder1[d.sku] = d.quantity;
    }
  });

  var obj3 = [];

  for (var prop in holder1) {
    obj3.push({ sku: prop, quantity: holder1[prop] });
  }

  let skuArr = []
  obj2.forEach((priceObj, j) => {
    obj3.forEach((quanObj, k) => {
      if (priceObj.sku===quanObj.sku) {
        skuArr.push({
          sku: priceObj.sku,
          revenue: priceObj.price,
          order: quanObj.quantity
        })
      }
    });
  });


  // console.log("skuArr", skuArr);
  // console.log("before pData", productData);


  dupArray.forEach((product, x) => {
    skuArr.forEach((final, index) => {
      if (dupArray[x].code === skuArr[index].sku) {
        dupArray[x].revenue=skuArr[index].revenue
        dupArray[x].order = skuArr[index].order
      }
    });

  });
  res.send(dupArray)
//console.log("new Product Data", productData);

//   productData.forEach((product, x) => {
//     let proObj = {}
//   skuArr.forEach((final, y) => {
//         if (final.sku === product.code) {
//           proObj = {
//             _id: product._id,
//             supplier_id: product.supplier_id,
//             name: product.name,
//             category: product.category,
//             price: product.price,
//             warranty: product.warranty,
//             description:product.description,
//             weight:product.weight,
//             productImage:product.productImage,
//             code: product.code, //sku as code
//             revenue: final.revenue,
//             order: final.order
//           }
//         }
//
//         else{
//           proObj = {
//             _id: product._id,
//             supplier_id: product.supplier_id,
//             name: product.name,
//             category: product.category,
//             price: product.price,
//             warranty: product.warranty,
//             description:product.description,
//             weight:product.weight,
//             productImage:product.productImage,
//             code: product.code, //sku as code
//             revenue: 0,
//             order: 0
//           }
//         }
//
//       });
//       finalArray.push(proObj)
//     });
//
// //console.log("finalArr", finalArray.length);
//      res.send(finalArray)
})

//add margin
router.post('/addMargin', async (req, res) => {
  const margin = new Margin({
    margin: req.body.margin,
  });

  try {
    const newMargin = await margin.save();
    // console.log('new margin is', newMargin);
    res.json('new margin added');
  } catch (error) {
    console.log('margin added error is ', error);
  }
});

//get Margin liste
router.get('/margin', async (req, res) => {
  try {
    const margin = await Margin.find({});
    res.json(margin);
  } catch (error) {
    console.log('error in get margin', error);
  }
});

//category add
router.post('/addCategory', async (req, res) => {
  const currDate = (sep) => {
    let d = new Date();
    let DD = d.getDate();
    let MM = d.getMonth() + 1;
    let YY = d.getFullYear();
    return DD + sep + MM + sep + YY;
  };
  const add = new Category({
    category: req.body.category,
    created_on: currDate('-'),
  });
  try {
    const newCategory = await add.save();
    // console.log(newCategory, 'category added');
    res.json('success');
  } catch (error) {
    console.log('category add error', error);
  }
});

//get category
router.get('/totalCategory', async (req, res) => {
  try {
    const categories = await Category.find({});
    // console.log(categories);
    res.json(categories);
  } catch (error) {
    console.log('error in get category', error);
  }
});

router.get('/product/filter/:category', async (req, res) => {
  console.log('category filter req.body', req.params.category);
  try {
    const data = await Products.find({ category: req.params.category });
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

router.delete('/categoryDel/:id', async (req, res) => {
  try {
    const data = await Category.deleteOne({ _id: req.params.id });
    res.json('success');
  } catch (e) {
    res.json({ message: error.message });
  }
});


//category edit
router.patch("/categoryPatch/:id", async (req, res) => {
  const currDate = (sep) => {
    let d = new Date();
    let DD = d.getDate();
    let MM = d.getMonth() + 1;
    let YY = d.getFullYear();
    return DD + sep + MM + sep + YY;
  };

  try {
    const data = await Category.findOneAndUpdate({ _id: req.params.id },
      {category: req.body.catName,
        created_on: currDate('-')},
    {
      new: true,
      useFindAndModify: false,
    },
    (err, result) => {
      if (!err) {
        res.send("success");
      } else {
        console.log("error ", err);
      }
    });
  } catch (e) {
    res.json({ message: error.message });
  }
});


//Category Analytic

router.get('/categoryProductDetail', async (req, res)=>{

  const orderData = await Orders.find()

  const productData = await Products.find()


  let orderArray = []

    orderData.forEach((data, i) => {
      data.products.forEach((ord, j) => {
        if (ord.sku!=undefined) {
          orderArray.push({
            sku: ord.sku,
            price: parseInt(ord.price),
            quantity: ord.quantity
          })
        }

      });

    });


checkProductOrderSku = []

orderArray.forEach((order, i) => {
  productData.forEach((product, i) => {
    if (order.sku === product.code) {
      checkProductOrderSku.push({
        category: product.category,
        price: order.price,
        quantity: order.quantity
      })
    }
  });

});


var holder = {};

checkProductOrderSku.forEach(function (d) {
  if (holder.hasOwnProperty(d.category)) {
    holder[d.category] = holder[d.category] + d.price;
  } else {
    holder[d.category] = d.price;
  }
});

var obj2 = [];

for (var prop in holder) {
  obj2.push({ category: prop, price: holder[prop] });
}



var holder1 = {};

checkProductOrderSku.forEach(function (d) {
  if (holder1.hasOwnProperty(d.category)) {
    holder1[d.category] = holder1[d.category] + d.quantity;
  } else {
    holder1[d.category] = d.quantity;
  }
});

var obj3 = [];

for (var prop in holder1) {
  obj3.push({ category: prop, quantity: holder1[prop] });
}

let revOrderArray = []
obj2.forEach((priceObj, j) => {
  obj3.forEach((quanObj, k) => {
    if (priceObj.category===quanObj.category) {
      revOrderArray.push({
        category: priceObj.category,
        revenue: priceObj.price,
        order: quanObj.quantity
      })
    }
  });
});

const categoryData = await Category.find()

let countArray = []

categoryData.forEach((cData, a) => {
  productData.forEach((pro, i) => {
    if (cData.category === pro.category) {
      countArray.push({
        category: cData.category,
        count: 1
      })
    }

  });

});

var holder2 = {};

countArray.forEach(function (d) {
  if (holder2.hasOwnProperty(d.category)) {
    holder2[d.category] = holder2[d.category] + d.count;
  } else {
    holder2[d.category] = d.count;
  }
});

var obj4 = [];

for (var prop in holder2) {
  obj4.push({ category: prop, count: holder2[prop] });
}



newCategoryArray = []
categoryData.forEach((item, i) => {
  newCategoryArray.push({
    category: item.category,
    created_on: item.created_on,
    count: 0,
    revenue: 0,
    order: 0
  })
});

newCategoryArray.forEach((cArr, l) => {
  revOrderArray.forEach((revOrder, m) => {
    if (newCategoryArray[l].category===revOrderArray[m].category) {
      newCategoryArray[l].revenue = revOrderArray[m].revenue
      newCategoryArray[l].order = revOrderArray[m].order
    }
  });

});

newCategoryArray.forEach((cArr, l) => {
  obj4.forEach((revOrder, m) => {
    if (newCategoryArray[l].category===obj4[m].category) {
      newCategoryArray[l].count = obj4[m].count
    }
  });

});

res.send(newCategoryArray)
console.log("newCategoryArray", newCategoryArray);

})

//category analytic in section
// router.get('/categoryProductDetail', async (req, res)=>{
//
//   const orderData = await Orders.find({})
//
//   let priceArr = []
//   let quanArr = []
//   let secondArray = []
//   let thirdArray = []
//   let fourthArray = []
//
//   orderData.forEach((item, i) => {
//       item.products.forEach((data, j) => {
//         priceArr.push({
//           sku: data.sku,
//           price: parseInt(data.price)
//         })
//         quanArr.push({
//           sku: data.sku,
//           quantity: parseInt(data.quantity)
//         })
//       });
//   });
//
//   const productData = await Products.find()
//
//   const categoryData = await Category.find()
//
//
//   priceArr.forEach((pri, i) => {
//     productData.forEach((pro, i) => {
//       if (pri.sku===pro.code) {
//         secondArray.push({
//           category: pro.category,
//           price: pri.price
//         })
//
//       }
//     });
//
//   });
//
//   quanArr.forEach((quan, i) => {
//     productData.forEach((pro, i) => {
//       if (quan.sku===pro.code) {
//         thirdArray.push({
//           category: pro.category,
//           quantity: quan.quantity
//         })
//       }
//     });
//
//   });
//
//
//   var holder = {};
//
//   secondArray.forEach(function (d) {
//     if (holder.hasOwnProperty(d.category)) {
//       holder[d.category] = holder[d.category] + d.price;
//     } else {
//       holder[d.category] = d.price;
//     }
//   });
//
//   var obj2 = [];
//
//   for (var prop in holder) {
//     obj2.push({ category: prop, price: holder[prop] });
//   }
//
//
//
//   var holder1 = {};
//
//   thirdArray.forEach(function (d) {
//     if (holder1.hasOwnProperty(d.category)) {
//       holder1[d.category] = holder1[d.category] + d.quantity;
//     } else {
//       holder1[d.category] = d.quantity;
//     }
//   });
//
//   var obj3 = [];
//
//   for (var prop in holder1) {
//     obj3.push({ category: prop, quantity: holder1[prop] });
//   }
//
//   let skuArr = []
//   obj2.forEach((priceObj, j) => {
//     obj3.forEach((quanObj, k) => {
//       if (priceObj.category===quanObj.category) {
//         skuArr.push({
//           category: priceObj.category,
//           revenue: priceObj.price,
//           order: quanObj.quantity
//         })
//       }
//     });
//   });
//
// console.log("obj2 & obj3", skuArr);
//
//
//   categoryData.forEach((cat, i) => {
//     productData.forEach((pro, i) => {
//       if (cat.category===pro.category) {
//         fourthArray.push({
//           category: cat.category,
//           count:1
//         })
//       }
//     });
//
//   });
//
//   var holder2 = {};
//
//   fourthArray.forEach(function (d) {
//     if (holder2.hasOwnProperty(d.category)) {
//       holder2[d.category] = holder2[d.category] + d.count;
//     } else {
//       holder2[d.category] = d.count;
//     }
//   });
//
//   var obj4 = [];
//
//   for (var prop in holder2) {
//     obj4.push({ category: prop, count: holder2[prop] });
//   }
//
// console.log("fourthArray", fourthArray);
//
// let doneArray = []
//
// skuArr.forEach((sArr, i) => {
//   obj4.forEach((obj, i) => {
//     if (sArr.category===obj.category) {
//       doneArray.push({
//         category: sArr.category,
//         revenue: sArr.revenue,
//         order: sArr.order,
//         count: obj.count
//       })
//     }
//   });
//
// });
//
// console.log("doneArray", doneArray);
// res.send(doneArray)
//
//
// })



//Add Product
router.post('/addProduct', upload.array('productImage'), async (req, res) => {
  const files = await req.files;
  let imgData = [];

  files.forEach((file) => {
    imgData.push({
      imgName: file.mimetype,
      imgBufferData: file.buffer.toString('base64'),
    });
  });

  let shippingObj = {
    method: req.body.method,
    usa: req.body.usa,
    canada: req.body.canada,
    unitedKingdom: req.body.uk,
    australia: req.body.australia,
    international: req.body.international,
  };
  const product = await new Products({
    supplier_id: req.body.supplier_id,
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    warranty: req.body.warranty,
    description: req.body.description,
    category: req.body.category,
    code: req.body.code,
    weight: req.body.weight,
    productImage: imgData,
    uploaded_on: Date(),
    size: req.body.size,
    options: JSON.parse(req.body.options),
    varients: JSON.parse(req.body.varients),
    shippingCharge: shippingObj,
    //  color: req.body.color,
    //  tag:req.body.tag
  });
  // console.log(product, "backend is");
  try {
    const newProduct = await product.save();
    res.status(200).send('Success');
  } catch (error) {
    res.status(500).send(`Failed because of${error}`);
    console.log(error);
  }
});

// product list by Specific Supplier
router.get('/supplier/product/:id', async (req, res) => {
  try {
    // console.log('console', req.params);
    const item = await Products.find({ supplier_id: req.params.id });
    res.json(item);
    // console.log('got it');
  } catch (error) {
    res.json({ message: error });
  }
});

// product list by specific prducbt id
router.get('/product/:id', async (req, res) => {
  try {
    // console.log('console', req.params);
    const item = await Products.find({ _id: req.params.id });
    res.json(item);
    // console.log('got it');
  } catch (error) {
    res.json({ message: error });
  }
});

//update Product details
router.patch('/product/update', async (req, res) => {
  try {
    const data = await Products.updateOne(
      { _id: req.body._id },
      { $set: req.body }
    );
    res.json({ message: 'Product updated Successfilly' + data });
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Delete product
router.delete('/product/:id', async (req, res) => {
  try {
    const data = await Products.deleteOne({ _id: req.params.id });
    res.json({ message: 'product Deleted' });
  } catch (e) {
    res.json({ message: error.message });
  }
});

//update all products with some margin by Admin

router.patch('/autoMargin', async (req, res) => {
  try {
    const data = await Products.find({ category: req.body.category });

    data.forEach(async (item, i) => {
      let calPrice = item.price + (item.price * req.body.margin) / 100;
      let price = calPrice.toFixed(2);
      const updatePrice = await Products.updateOne(
        { _id: item._id },
        { $set: { selliingPrice: price } }
      );
      // console.log({ updatePrice });
    });
    res.json('success');
  } catch (error) {
    console.log('update price error is:', error);
  }
});

//last 10 days products Added

router.get('/analyticProduct', async (req, res) => {
  try {
    const data = await Products.find({
      uploaded_on: {
        $gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000),
      },
    }).sort({ date: -1 });
    console.log('analytic product data', data);
  } catch (error) {
    console.log(error);
  }
});

//Csv product Add
router.post('/product/csv', upload.single('file'), async (req, res) => {
  let list_csv = await csv().fromString(req.file.buffer.toString());
  list_csv = JSON.stringify(list_csv);
  list_csv = JSON.parse(list_csv);
  list_csv.forEach(async (item, index) => {
    index === 1 ? console.log(item) : null;
    const csvtest = new CsvTest({
      supplier_id: req.body.supplier_id,
      name: item.Title,
      type: item.Type,
      tags: item.Tags,
      option1: item['Option1 Name'],
      option1: item['Option1 Value'],
      option2: item['Option2 Name'],
      option2: item['Option2 Value'],
      option3: item['Option3 Name'],
      option3: item['Option3 Value'],
      // varients
      // varient: item
      productImage: item['Image Src'],
      description: item['Body (HTML)'],
      price: item['Variant Price'],
    });
    try {
      const newProduct = await csvtest.save();
      if (newProduct) {
        res.json('product added completed');
      }
    } catch (error) {
      res.send(error);
      console.log('catch error is', error);
    }
  });
});
// });

//get CSv product List
router.get('/csv/product', async (req, res) => {
  try {
    const item = await CsvTest.find();
    res.json(item);
  } catch (error) {
    res.json({ message: error });
  }
});

//Supplier Order List from merchant

router.get('/ordersList/:id', async (req, res) => {
  // console.log("id is", req.params.id);
  let itemArray = [];
  const data = await Orders.find({});
  // console.log({data})
  data.forEach((item, i) => {
    item.products.forEach((subItem, i) => {
      if (subItem.sku !== undefined) {
        itemArray.push({
          id: item.product_name,
          productId: subItem.id,
          sku: subItem.sku,
          quantity: subItem.quantity,
          customer: item.customer,
          varient: item.varient,
          paid: item.paid,
          paymentStatus: item.paymentStatus,
          fulfillmentStatus: item.fulfillmentStatus,
          store: subItem.store,
          paymentMode: item.paymentMode,
          pStatus: item.pStatus
        });
      }
    });
  });

  let makeList = [];

  const productData = await Products.find({ supplier_id: req.params.id });

  // console.log({ productData });

  itemArray.forEach((item, i) => {
    productData.forEach((product, j) => {
      if ((product.code == item.sku)) {
        let dataObj = {
          id: item.id,
          productId: item.productId,
          customer: item.customer,
          sku: item.sku,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          varient: item.varient,
          paid: item.paid,
          paymentStatus: item.paymentStatus,
          fulfillmentStatus: item.fulfillmentStatus,
          store: item.store,
          paymentMode: item.paymentMode,
          pStatus: item.pStatus
        };
        // console.log(dataObj);
        makeList.push(dataObj);
      }
    });
  });

  let finalData = []
    makeList.forEach((item, i) => {
      if (makeList[i].pStatus==='Paid') {
          finalData.push(makeList[i])
      }
    });

   console.log(finalData , "supplier order");
  res.status(200).json(finalData);
  // let totalOrders =   calOrder.reduce((a,b)=>a+b, 0)
  // console.log(totalOrders);
  //   res.status(200).json(totalOrders)
});

//requet product from merchant
router.post('/requestProduct', async (req, res)=>{

  const requestProduct = await new RequestProduct({
    merchantId:req.body.id,
    date:req.body.d,
    name:req.body.name,
    description:req.body.description,
    link:req.body.link
  });

  try {
    const saveRequest = await requestProduct.save();
    console.log(saveRequest, "request saved successfully");
    res.send(saveRequest)
  } catch (error) {
    res.send(error)
  }
})

//get Requested product list
router.get('/getRequestProduct', async (req, res)=>{
  try {
    let reqData = await RequestProduct.find();
    let merchantData = await MerchantUser.find();
    let newData = []
    reqData.forEach((data, i) => {
      merchantData.forEach((item, j) => {
        if (reqData[i].merchantId === merchantData[j]._id.toString()) {
          reqData[i].merchantId = merchantData[j].firstName+" " + merchantData[j].lastName
        }
      });

    });
    console.log("newData", reqData);
    res.send(reqData)
  } catch (error) {
    res.send(error)
  }
})

module.exports = router;
