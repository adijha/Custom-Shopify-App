const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Products = require('../model/Products');
const {userValidation} = require('../validation');

//Register Account
router.post('/', async (req, res)=>{

	//let validate the data
	const {error} = userValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);


	//user email already exists
	const emailExist = await User.findOne({email: req.body.email})
	if (emailExist) return res.status(400).send("Email Already Exists");

	//hash the password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);


	const user = new User({
		supplier_id: req.body.supplier_id,
		email: req.body.email,
		password: hashPassword,
		category: req.body.category
	});

	try{
		const savedUser = await user.save();
		res.send(savedUser);
	}
	catch(err){
		res.status(400).send(err);
	}
});

//Generate lofin token and pass to client
router.post('/login', async (req, res)=>{

	//let validate the data
	const {error} = userValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//if email exist
	const user = await User.findOne({email: req.body.email})
	if (!user) return res.status(400).send("Wrong Email Entered");

	//check password is correct
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid Password");

	//create and assign token
	let userInfo = {
		id: user._id,
		email: user.email,
		category: user.category
	}
	const token = jwt.sign(userInfo, process.env.TOKEN_SECRET);
	res.send(token);

})

//get all supplier created
router.get('/', async (req, res)=>{
	try {
		const data = await User.find({category:"supplier"})
		res.json(data)
	} catch (error) {
		res.json({message: error});
	}
})

/*Supplier Part*/

//Add Product
router.post('/addProduct', async (req, res)=>{
	const product = new Products({
		supplier_id: req.body.supplier_id,
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


// product list by Specific Supplier
router.get('/listProduct',async(req,res)=>{
	try {
		const item = await Products.find(req.body)
		res.json(item);
		console.log('got it');
	}
	catch (error) {
			res.json({message: error})
	}
})

// product list
router.get('/product', async (req, res)=>{
	try {
		const item = await Products.find();
		res.json(item);
	}
	catch (error) {
		res.json({message:error})
	}
})

//update Product details
router.patch('/product/update', async (req, res) => {
	try {
		const data = await Products.updateOne(
			{ _id: req.body._id }, {$set:req.body});
		res.json({ message: 'Product updated Successfilly'+data });
	} catch (error) {
		res.json({ message: error.message });
	}
});

module.exports = router;
