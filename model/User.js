const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
	supplier_id: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	category: {
		type: String,
		default: "supplier"
	},
	name: {
		type: String,
	},
	location: {
		type: String
	},
	businessName:{
		type: String
	},
	phoneNo:{
		type: Number
	},
	pInfo:{
		type:Array
	}
});

module.exports = mongoose.model('User', userScheme)
