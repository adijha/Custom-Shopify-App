const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  supplier_id:{
    type:String,
    require: true
  },
  name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
  weight:{
    type: Number,
    required: true
  },
  warranty: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  code:{
    type: String,
    required: true
  },
  productImage:[{
    imgName: String,
    imgBufferData: String
  }]
})

module.exports = mongoose.model('Products', ProductSchema);
