const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Supplier = require('../modals/Supplier');
const Products = require('../modals/Products');
const {userValidation} = require('../auth/validation');
const verify_token = require('../auth/verifyToken')


//Get the apecific Supplier
// router.get('/:code', async (req, res) => {
// 	try {
// 		const supplier = await Supplier.findById(req.params.code);
// 		res.json(supplier);
// 	} catch (error) {
// 		res.json(error);
// 	}
// });


//Update Supplier Info
router.patch('/:code', async (req, res) => {
	try {
		await Supplier.updateOne(
			{ _id: req.params.code },
			{ $set: { email: req.body.email, supplierId: req.body.supplier, password: req.body.password } }
		);
		res.json({ message: 'Supplier updated Successfilly' });
	} catch (error) {
		res.json({ message: error.message });
	}
});

//Save the incoming Supplier account
router.post('/', async (req, res) => {

	//let user validate the data
	const {error} = userValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//check email exists
	const emailExist = await Supplier.findOne({email:req.body.email})
	if (emailExist) return res.status(400).send("Email Already Exist");

	//Change password into hash
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);


	const supplier = new Supplier({
		email: req.body.email,
		supplierId: req.body.supplierId,
		password: hashPassword
	});

	try {
		const newSupplier = await supplier.save();
		res.json(newSupplier);
		console.log('supplier post hit');
	} catch (error) {
		res.json({ message: error });
	}
});

//supplier Login
router.post('/login', async (req, res)=>{

	const {error} = userValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const userSupplier = await Supplier.findOne({email:req.body.email});
	if (!userSupplier) return res.status(400).send("Email Not Exist");

	const validPasword = await bcrypt.compare(req.body.password, userSupplier.password);
	if(!validPasword) return res.status(400).send("Wrong password");

	const genToken = jwt.sign({_id:Supplier._id}, process.env.TOKEN_SECRET);
	res.header('auth_token', genToken).send("Supplier Login Token:" + genToken);

})


//verify token for login
router.get('/login', verify_token, (req, res)=>{
	res.json({
	posts:
		{title: "My First Post",
		 Description: "This is show after token token access....."
		}
	});
})

//get all supplier created till now
router.get('/', async (req, res)=>{
	try {
		const data = await Supplier.find();
		res.json(data)
	} catch (error) {
		res.json({message: error});
	}
})


/*Supplier Part*/


//Add Product
router.post('/addProduct', async (req, res)=>{
	const product = new Products({
		name: req.body.name,
		price: req.body.price,
		quantity: req.body.quantity,
		warranty: req.body.warranty,
		description: req.body.description,
		category:req.body.category,
		code:req.body.code
	});
	try {
		const newProduct = await product.save();
		console.log("post response")
		res.json(newProduct);
	} catch (error) {
		res.json({message: error})
	}
});



router.get('/listProduct',async(req,res)=>{
	try {
		const item = await Products.find();
		res.json(item);
		console.log('got it');
	}
	catch (error) {
			res.json({message: error})
	}
})



module.exports = router;
