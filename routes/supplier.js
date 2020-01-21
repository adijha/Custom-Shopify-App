const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

//Get the apecific Supplier
router.get('/:code', async (req, res) => {
	try {
		const supplier = await Supplier.findById(req.params.code);
		res.json(supplier);
	} catch (error) {
		res.json(error);
	}
});

//Update Supplier Info
router.patch('/:code', async (req, res) => {
	try {
		await Supplier.updateOne(
			{ _id: req.params.code },
			{ $set: { email: req.body.email, supplierId: req.body.supplier,password:req.body.password } }
		);
		res.json({ message: 'Supplier updated Successfilly' });
	} catch (error) {
		res.json({ message: error.message });
	}
});

//Save the incoming Supplier account
router.post('/', async (req, res) => {
	const supplier = new Supplier({
		email: req.body.email,
    supplierId: req.body.supplier,
    password:req.body.password
	});
	try {
		const newSupplier = await supplier.save();
		res.json(newSupplier);
	} catch (error) {
		res.json({ message: error });
	}
});

module.exports = router;
