const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  product_name: { type: String },
  currency: { type: String },
  created_on: Date,
  products: { type: Array },
  price: { type: Number },
  customer: {
    name: { type: String },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    zip: { type: Number },
    state: { type: String },
    country: { type: String },
    phone: { type: Number },
  },
  varient: { type: Array },
  quantity: { type: Number },
  paid: { type: Number },
  paymentStatus: { type: Boolean },
  paymentMode: {type:String},
  fulfillmentStatus: { type: String },
  tracking_number:{type:String, default:null},
  pStatus: {
    type: String,
    default: "unpaid"
  },
  updated_on:{
    type:Date
  }
});

module.exports = mongoose.model("Orders", OrderSchema);
