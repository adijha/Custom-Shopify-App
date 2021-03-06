const Orders = require("../model/Orders");
const Products = require("../model/Products");


const revenueSupplier = async (id) =>{
  // console.log("id is in resuable", id);
  let itemArray = [];
  const data = await Orders.find({});

  let orderdataArr = []
  data.forEach((item, i) => {
    if (data[i].pStatus==="Paid") {
      orderdataArr.push(data[i])
    }
  });


  orderdataArr.forEach((item, i) => {
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
  const productData = await Products.find({ supplier_id: id });
  // console.log(productData.length);
  obj2.forEach((arr, i) => {
    productData.forEach((product, j) => {


      if (product.varientArray.length!=0) {
        product.varientArray.forEach((vArr, l) => {
          if (vArr.sku===arr.sku) {
            let countPrice = vArr.price * arr.count;

            calPrice.push(~~countPrice);
          }
        });

      }
      else if(product.code===arr.sku) {
        let countPrice = product.price * arr.count;

        calPrice.push(~~countPrice);
      }


      // if (product.code === arr.sku) {
      //   let countPrice = product.price * arr.count;
      //   calPrice.push(~~countPrice);
      // }
    });
  });
  // console.log({ calPrice });
  let income = calPrice.reduce((a, b) => a + b, 0);
  // console.log(income);
  return income;
  // res.status(200).json(income);
}


//supplier order

const orderSupplier = async (id) =>{
  let itemArray = [];

  const data = await Orders.find({});
  let orderdataArr = []
  data.forEach((item, i) => {
    if (data[i].pStatus==="Paid") {
      orderdataArr.push(data[i])
    }
  });

  orderdataArr.forEach((item, i) => {
    item.products.forEach((sss, i) => {
      if (sss.sku !== undefined) {
        itemArray.push({
          sku: sss.sku,
          count: 1,
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
  // console.log({obj2});

  let calOrder = [];

  const productData = await Products.find({ supplier_id: id });

  // console.log(productData.length);

  obj2.forEach((arr, i) => {
    productData.forEach((product, j) => {

      if (product.varientArray.length!=0) {
        product.varientArray.forEach((vArr, l) => {
          if (vArr.sku===arr.sku) {
            let countItem = arr.count;

            calOrder.push(countItem);
          }
        });

      }
      else if(product.code===arr.sku) {
        let countItem = arr.count;

        calOrder.push(countItem);
      }

      // if (product.code === arr.sku) {
      //   let countItem = arr.count;
      //
      //   calOrder.push(countItem);
      // }
    });
  });
  // console.log({ calOrder });
  let totalOrders = calOrder.reduce((a, b) => a + b, 0);
  // console.log(totalOrders);
  //res.status(200).json(totalOrders);
  return totalOrders;
}

//product length

const productLength = async (id) =>{
    const item = await Products.find({ supplier_id: id });
    return item.length;
}

exports.revenueSupplier = revenueSupplier;
exports.orderSupplier = orderSupplier;
exports.productLength = productLength;
