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
		require: true,
		default: "supplier"
	},
	name: {
		type: String,
	},
	location: {
		type: String
	}
});

module.exports = mongoose.model('User', userScheme)
