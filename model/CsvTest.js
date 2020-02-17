const mongoose = require('mongoose');

const CsvTestSchema = mongoose.Schema({
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
  }
})

module.exports = mongoose.model('CsvTest', CsvTestSchema);
