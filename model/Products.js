const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  supplier_id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  warranty: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  productImage: [
    {
      imgName: String,
      imgBufferData: String,
    },
  ],
  uploaded_on: {
    type: Date,
  },
  // color: {
  //   type: String,
  // },
  size: {
    type: String,
  },
  // tag: {
  //   type: String,
  // },
  varients: {
    type: Array,
  },
  options: {
    type: Array,
  },
  selliingPrice:{
    type: Number
  }
});

module.exports = mongoose.model("Products", ProductSchema);
