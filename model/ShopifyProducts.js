const mongoose = require('mongoose');

const ShopifyProductsSchema = mongoose.Schema({
  product: {
    title: {
      type: String
    },
    body_html: {
      type:String
    },
    vendor:{
      type:String,
      default: "Demo-Mojito"
    } ,
    product_type:{
      type:String
    }
  }
})

module.exports = mongoose.model('ShopifyProducts', ShopifyProductsSchema);
