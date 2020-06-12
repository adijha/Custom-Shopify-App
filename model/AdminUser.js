const mongoose = require('mongoose');

const adminUserScheme = new mongoose.Schema({
	email:{
		type: String,
		require: true
	},

	password:{
		type: String,
		require: true
	},
	name:{
		type: String
	},
	username:{
		type: String
	},
	phoneNo:{
		type: Number
	},
	category:{
		type: String,
		default: "admin"
	}
});

module.exports = mongoose.model('AdminUser', adminUserScheme)
