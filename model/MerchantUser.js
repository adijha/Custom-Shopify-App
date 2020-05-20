const mongoose = require('mongoose');

const merchantUserScheme = new mongoose.Schema({
	merchant_id:{
		type:String
	},
	firstName:{
		type:String
	},
	lastName:{
		type:String
	},
	phoneNo:{
		type: Number
	},
	email:{
		type: String,
		require: true
	},
	password:{
		type: String,
		require: true
	},
	category:{
		type: String,
		require: true,
		default: "merchant"
	}
});

module.exports = mongoose.model('MerchantUser', merchantUserScheme)
