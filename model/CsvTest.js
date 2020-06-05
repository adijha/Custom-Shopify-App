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

	},
  warranty: {
    type: String,
  },
  description: {
    type: String,
  },
  category:{
    type: String,
  },
  code:{
    type: String,
  }
})

module.exports = mongoose.model('CsvTest', CsvTestSchema);
