const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../model/User");
const AdminUser = require("../model/AdminUser");
const MerchantUser = require("../model/MerchantUser");
const Products = require("../model/Products");
const CsvTest = require("../model/CsvTest");
const Category = require("../model/Category");
const Margin = require("../model/Margin");
const { userValidation } = require("../validation");
const fileUpload = require("express-fileupload");
const csv = require("csvtojson");
const request = require("request-promise");
const Orders = require("../model/Orders");

// const storage = multer.diskStorage({
//   destination: "./files",
//   filename(req, file, cb) {
//     cb(null, `${new Date()}-${file.originalname}`);
//   },
// });

const upload = multer({
  storage: multer.memoryStorage(),
});

//Admin Registration

router.post("/admin", async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //user email already exists
  const emailExist = await AdminUser.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email Already Exists");

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
router.get('/adminUser/:id', async (req, res) =>{
  try {
    const data = await AdminUser.findOne({_id:req.params.id});
    console.log(data)
    res.json(data);
  } catch (error) {
    res.json({ message: error });
  }
})

//update Admin credentenials
router.patch('/adminAccount', async (req, res)=>{
  // const salt = await bcrypt.genSalt(10);
  // const hashPassword = await bcrypt.hash(req.body.password, salt);

  const updateUser = {
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phone,
    username: req.body.name
  };
  console.log(updateUser);
  try {
    const data = await AdminUser.findOneAndUpdate(
      { _id: req.body.id },
      { $set: updateUser }
    );
    res.send('success');
  } catch (error) {
    console.log({ message: error.message });
  }


})


//Admin Generate Token for login
router.post("/adminLogin", async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //if email exist
  const user = await AdminUser.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Wrong Email Entered");

  //check password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  //create and assign token
  let userInfo = {
    id: user._id,
    email: user.email,
    category: user.category,
  };
  const token = jwt.sign(userInfo, process.env.TOKEN_SECRET);
  res.send(token);
});

//merchant sign up
router.post("/merchant", async (req, res) => {
  //let validate the data
  console.log(req.body);
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //user email already exists
  const emailExist = await MerchantUser.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email Already Exists");

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const currDate = (sep)=>{
    let d = new Date();
    let DD = d.getDate();
    let MM = d.getMonth()+1;
    let YY = d.getFullYear();
    return(DD+sep+MM+sep+YY)
  }

  const merchantUser = await new MerchantUser({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNo: req.body.phoneNo,
    email: req.body.email,
    password: hashPassword,
    joiningDate: currDate('-'),
    store: req.body.store
  });
console.log(merchantUser);
  try {
    const savedUser = await merchantUser.save();
    res.send("success");
  } catch (err) {
    res.status(400).send(err);
  }
});

//login and generate token

router.post("/merchantLogin", async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //if email exist
  const user = await MerchantUser.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Wrong Email Entered");

  //check password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  //create and assign token
  let userInfo = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(userInfo, process.env.TOKEN_SECRET);
  res.send(token);
});

router.get("/merchant", async (req, res) => {
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
        joiningDate: item.joiningDate
      }
      detail.push(obj)
    });
    res.json(detail);
  } catch (error) {
    res.json({ message: error });
  }
});

//Custom Details merchant list

router.get('/customMerchantDetail',async (req, res)=>{

    let detail=[]
    let mDetail = []
    let sName = []
    let countItem = 0;
    let countPrice = 0;
    let finalArrU = []

    let resArray = []

    const data =  await MerchantUser.find();
    console.log(data)
    const orderData = await Orders.find();

    data.forEach((item, i) => {
      orderData.forEach((od, j)=>{
        od.products.forEach((pro, k) => {
          if (item.store===pro.store) {
            const obj = {
                     id: item._id,
                     email: item.email,
                     firstName: item.firstName,
                     lastName: item.lastName,
                     phone: item.phoneNo,
                     joiningDate: item.joiningDate,
                     store: pro.store,
                    price: parseInt(pro.price),
                    count:1
            }

            detail.push(obj)
            sName.push(item.store)
          }
        });
      })
    })
    sName = [...new Set(sName)];
    console.log({sName})

  sName.forEach((sn, m) => {
    detail.forEach((det, n) => {
      if (sn === det.store) {
        countItem += det.count
        countPrice += det.price

      }
      else{
        countItem = 0;
        countPrice = 0;
      }

    });
    const finalObj = {
             store: sn,
            price: countPrice,
            count:countItem
    }


    finalArrU.push(finalObj)
  });

  data.forEach((delta, x) => {
    finalArrU.forEach((final, Y) => {
      if (delta.store === final.store) {
        const newObject = {
          id: delta._id,
          email: delta.email,
          firstName: delta.firstName,
          lastName: delta.lastName,
          phone: delta.phoneNo,
          joiningDate: delta.joiningDate,
          store: final.store,
         price: final.price,
         count:final.count
        }
        mDetail.push(newObject)
      }

    });

  });


console.log("final object is", mDetail);

res.send(mDetail)


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



})


//sepecific merchant with id
router.get("/merchant/:id", async (req, res) => {
  const detail = []
  try {
    const data = await MerchantUser.find({_id: req.params.id});

    data.forEach((item, i) => {
      const obj = {
        email: item.email,
        first: item.firstName,
        lastName: item.lastName,
        phone: item.phoneNo,
        store: item.store
      }
      detail.push(obj)
    });


    console.log(detail)
    res.json(detail);
  } catch (error) {
    res.json({ message: error });
  }
});



//Merchant Orders
router.get("/merchantOrderDetail/:store", async (req, res)=>{
  let productArr = []
  let productNameArr = []
  let calItem = 0;
  let calPrice = 0;

  const data = await Orders.find()

  data.forEach((item, i) => {
    item.products.forEach((product, i) => {
      if (product.store==req.params.store) {
        const productObj = {
          name: product.name,
          sku: product.sku,
          price: parseInt(product.price),
          store: product.store,
          count:1
        };
        productArr.push(productObj)
        productNameArr.push(product.sku)
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
    obj.push({ sku: prop, price: holder[prop]});
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
  let newArray = []
  obj.forEach((item, i) => {
    obj2.forEach((test, i) => {
      if (item.sku === test.sku) {
        const newObject = {
          sku: test.sku,
          count: test.count,
          price: item.price
        }
        newArray.push(newObject)
      }


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


  res.send(newArray)

})

/*Supplier Part*/

//Register Account
router.post("/signUp", async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //user email already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email Already Exists");

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    supplier_id: req.body.supplier_id,
    email: req.body.email,
    password: hashPassword,
    category: req.body.category,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

//get all supplier created
router.get("/supplier", async (req, res) => {
  try {
    const data = await User.find();

    res.json(data);
  } catch (error) {
    res.json({ message: error });
  }
});

//get supplier with revenue
// router.get('/supllierFullDetails', async (req, res)=>{
//   try {
//     const supplierData = await User.find();
//
//     supplierData.forEach((data, i) => {
//       const revenueData = await
//       const orderData
//       const productLength
//     });

// 
//   } catch (e) {
//
//   }
// })



router.get("/supplier/:id", async (req, res) => {
  console.log("id is", req.params.id)
  try {
    const data = await User.findOne({_id: req.params.id});
    const obj = {
      supplier_id: data.supplier_id,
      email: data.email,
      name: data.name
    }
    res.json(obj);
  } catch (error) {
    res.json({ message: error });
  }
});

//update Supplier
router.patch("/update", async (req, res) => {
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const updateUser = {
    supplier_id: req.body.supplier_id,
    email: req.body.email,
    password: hashPassword,
  };
  // console.log(updateUser);
  try {
    const data = await User.updateOne(
      { _id: req.body._id },
      { $set: updateUser }
    );
    res.json({ message: "Product updated Successfilly" + data });
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Generate lofin token and pass to client
router.post("/login", async (req, res) => {
  //let validate the data
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Wrong Email Entered");

  //check password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  //create and assign token
  let userInfo = {
    id: user._id,
    email: user.email,
    category: user.category,
  };
  const token = jwt.sign(userInfo, process.env.TOKEN_SECRET);
  res.send(token);
});

/*Product Part*/
// product list
router.get("/product", async (req, res) => {
  try {
    const item = await Products.find();
    res.json(item);
  } catch (error) {
    res.json({ message: error });
  }
});

//add margin
router.post("/addMargin", async (req, res) => {
  const margin = new Margin({
    margin: req.body.margin,
  });

  try {
    const newMargin = await margin.save();
    console.log("new margin is", newMargin);
    res.json("new margin added");
  } catch (error) {
    console.log("margin added error is ", error);
  }
});

//get Margin liste
router.get("/margin", async (req, res) => {
  try {
    const margin = await Margin.find({});
    res.json(margin);
  } catch (error) {
    console.log("error in get margin", error);
  }
});

//category add
router.post("/addCategory", async (req, res) => {
  const currDate = (sep)=>{
    let d = new Date();
    let DD = d.getDate();
    let MM = d.getMonth()+1;
    let YY = d.getFullYear();
    return(DD+sep+MM+sep+YY)
  }
  const add = new Category({
    category: req.body.category,
    created_on: currDate('-')
  });
  try {
    const newCategory = await add.save();
    console.log(newCategory, "category added");
    res.json("product Added");
  } catch (error) {
    console.log("category add error", error);
  }
});

//get category
router.get("/totalCategory", async (req, res) => {
  try {
    const categories = await Category.find({});
    console.log(categories);
    res.json(categories);
  } catch (error) {
    console.log("error in get category", error);
  }
});

router.get("/product/filter/:category", async (req, res) => {
  console.log("category filter req.body", req.params.category);
  try {
    const data = await Products.find({ category: req.params.category });
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/category/:id", async (req, res) => {
  try {
    const data = await Category.deleteOne({ _id: req.params.id });
    res.json({ message: "category Deleted" });
  } catch (e) {
    res.json({ message: error.message });
  }
});
//Add Product
router.post("/addProduct", upload.array("productImage"), async (req, res) => {
  const files = await req.files;
  let imgData = [];

  files.forEach((file) => {
    imgData.push({
      imgName: file.mimetype,
      imgBufferData: file.buffer.toString("base64"),
    });
  });
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
    //  color: req.body.color,
    //  tag:req.body.tag
  });

  try {
    const newProduct = await product.save();
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send(`Failed because of${error}`);
    console.log(error);
  }
});



// product list by Specific Supplier
router.get("/supplier/product/:id", async (req, res) => {
  try {
    console.log("console", req.params);
    const item = await Products.find({ supplier_id: req.params.id });
    res.json(item);
    console.log("got it");
  } catch (error) {
    res.json({ message: error });
  }
});

// product list by specific prducbt id
router.get("/product/:id", async (req, res) => {
  try {
    console.log("console", req.params);
    const item = await Products.find({ _id: req.params.id });
    res.json(item);
    console.log("got it");
  } catch (error) {
    res.json({ message: error });
  }
});

//update Product details
router.patch("/product/update", async (req, res) => {
  try {
    const data = await Products.updateOne(
      { _id: req.body._id },
      { $set: req.body }
    );
    res.json({ message: "Product updated Successfilly" + data });
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Delete product
router.delete("/product/:id", async (req, res) => {
  try {
    const data = await Products.deleteOne({ _id: req.params.id });
    res.json({ message: "product Deleted" });
  } catch (e) {
    res.json({ message: error.message });
  }
});

//update all products with some margin by Admin

router.patch("/productPrice/:id", async (req, res) => {
  let id = req.params.id;
  let price = req.body.price;
  console.log("sellling Price is", price);
  console.log("product id", id);

  // const data = await Products.find({})
  // //console.log(data, "from update Margin")
  //
  // data.forEach((item, i) => {
  // 	console.log(item.price)
  // 	const updateData =  Products.updateOne({_id: item._id}, {$set: {price: item.price+item.price*margin/100}})
  // 	console.log(updateData, "update Price")
  // });

  try {
    const updatePrice = await Products.updateOne(
      { _id: id },
      { $set: { price: price } }
    );
    res.json("saved updated price is");
  } catch (error) {
    console.log("update price error is:", error);
  }
});

//last 10 days products Added

router.get("/analyticProduct", async (req, res) => {
  try {
    const data = await Products.find({
      uploaded_on: {
        $gte: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000),
      },
    }).sort({ date: -1 });
    console.log("analytic product data", data);
  } catch (error) {
    console.log(error);
  }
});

//Csv product Add
router.post("/product/csv", upload.single("file"), async (req, res) => {
  let list_csv = await csv().fromString(req.file.buffer.toString());
  // console.log({ list_csv });
  // const csvFilePath = req.file.path;

  // csv()
  //   .fromFile(csvFilePath)
  //   .then((jsonObj) => {

  list_csv = JSON.stringify(list_csv);
  list_csv = JSON.parse(list_csv);
  // console.log("file", list_csv);
  // console.log(typeof list_csv);
  list_csv.forEach(async (item, index) => {
    index === 1 ? console.log(item) : null;
    const csvtest = new CsvTest({
      supplier_id: req.body.supplier_id,
      name: item.Title,
      type: item.Type,
      tags: item.Tags,
      option1: item["Option1 Name"],
      option1: item["Option1 Value"],
      option2: item["Option2 Name"],
      option2: item["Option2 Value"],
      option3: item["Option3 Name"],
      option3: item["Option3 Value"],
      // varients
      // varient: item
      productImage: item["Image Src"],
      description: item["Body (HTML)"],
      price: item["Variant Price"],
    });
    try {
      const newProduct = await csvtest.save();
      if (newProduct) {
        res.json("product added completed");
      }
    } catch (error) {
      res.send(error);
      console.log("catch error is", error);
    }
  });
});
// });

//get CSv product List
router.get("/csv/product", async (req, res) => {
  try {
    const item = await CsvTest.find();
    res.json(item);
  } catch (error) {
    res.json({ message: error });
  }
});

//Supplier Order List from merchant

router.get("/ordersList/:id", async (req, res) => {
  // console.log("id is", req.params.id);
  let itemArray = [];
  const data = await Orders.find({});
  // console.log({data})
  data.forEach((item, i) => {
    item.products.forEach((subItem, i) => {
      if (subItem.sku !== undefined) {
        itemArray.push({
          id: item.product_name,
          productId:subItem.id,
          sku: subItem.sku,
          quantity: subItem.quantity,
          customer: item.customer,
          varient: item.varient,
          paid: item.paid,
          paymentStatus: item.paymentStatus,
          fulfillmentStatus: item.fulfillmentStatus,
          store:subItem.store,
          paymentMode:item.paymentMode
        });
      }
    });
  });

  let makeList = [];

  const productData = await Products.find({ supplier_id: req.params.id });

  // console.log({ productData });

  itemArray.forEach((item, i) => {
    productData.forEach((product, j) => {
      if (product.code == item.sku) {
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
          paymentMode: item.paymentMode
        };
        console.log(dataObj);
        makeList.push(dataObj);
      }
    });
  });
  // console.log({ makeList });
  res.status(200).json(makeList);
  // let totalOrders =   calOrder.reduce((a,b)=>a+b, 0)
  // console.log(totalOrders);
  //   res.status(200).json(totalOrders)
});



module.exports = router;
