const mongoose = require('mongoose');

const adminUserScheme = new mongoose.Schema({
	email:{
		type: String,
		require: true
	},

	password:{
		type: String,
		require: true
	}
});

module.exports = mongoose.model('AdminUser', adminUserScheme)
