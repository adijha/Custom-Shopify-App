const mongoose = require('mongoose');

const SupplierSchema = mongoose.Schema({
	supplierId: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Supplier', SupplierSchema);
