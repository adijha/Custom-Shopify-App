const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../model/User');
const Products = require('../model/Products');
const CsvTest = require('../model/CsvTest');
const {userValidation} = require('../validation');
const fileUpload = require('express-fileupload');
const csv=require('csvtojson')
const upload = multer({
	storage: multer.memoryStorage()
})


/*Supplier Part*/

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

//get all supplier created
router.get('/', async (req, res)=>{
	try {
		const data = await User.find({category:"supplier"})
		res.json(data)
	} catch (error) {
		res.json({message: error});
	}
})

//update Supplier
router.patch('/update', async (req, res)=>{
	//hash the password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);


	const updateUser = {
		supplier_id: req.body.supplier_id,
		email: req.body.email,
		password: hashPassword,
	};
	console.log(updateUser)
	try {
		const data = await User.updateOne(
			{ _id: req.body._id }, {$set:updateUser});
		res.json({ message: 'Product updated Successfilly'+data });
	} catch (error) {
		res.json({ message: error.message });
	}
})



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

/*Product Part*/

//Add Product
router.post('/addProduct',  async (req, res)=>{
	const files = req.files.productImage;
	// console.log("files is ", req.files.productImage);

	let imgData=[];

	 files.forEach(file=>{
		 let bufferString =
		imgData.push({
			imgName: file.mimetype,
			imgBufferData:  file.data.buffer.toString('base64')
		})
	})
	//console.log(imgData)
	const product = await new Products({
	 supplier_id: req.body.supplier_id,
	 name: req.body.name,
	 price: req.body.price,
	 quantity: req.body.quantity,
	 warranty: req.body.warranty,
	 description: req.body.description,
	 category:req.body.category,
	 code:req.body.code,
	 productImage: imgData
 });
 //  console.log(product , "product is");
 // console.log("req.body", req.body);
 // console.log(typeof(imgData));
 //console.log("product object is", product)
	 try {

		const newProduct = await product.save();
		console.log("post response", JSON.stringify(product))
		res.json(newProduct);
	 } catch (error) {
		res.json({message: error})
	 }
 });


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

// product list by Specific Supplier
router.get('/supplier/product/:id',async(req,res)=>{
	try {
		console.log("console",req.params)
		const item = await Products.find({"supplier_id": req.params.id})
		res.json(item);
		console.log('got it');
	}
	catch (error) {
			res.json({message: error})
	}
})

// product list by specific prducbt id
router.get('/product/:id',async(req,res)=>{
	try {
		console.log("console",req.params)
		const item = await Products.find({"_id": req.params.id})
		res.json(item);
		console.log('got it');
	}
	catch (error) {
			res.json({message: error})
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

//Delete product
router.delete('/product/:id', async (req, res)=>{
	try {
		const data = await  Products.deleteOne({"_id":req.params.id})
		res.json({message:"product Deleted"})
	} catch (e) {
		res.json({ message: error.message });

	}
})

	router.post('/product/csv', async (req, res)=>{
	  console.log("sile",req.files.file);
	  console.log("file path is", req.files.file.tempFilePath)
	   const csvFilePath= await req.files.file.tempFilePath;
	    csv()
	  .fromFile(csvFilePath)
	  .then((jsonObj)=>{
			jsonObj.forEach((item) => {
		  //       console.log(item);
			const csvtest = new CsvTest({
			 supplier_id: req.body.supplier_id,
			 name: item.construction,
			 price: item.policyID,
			 quantity: item.point_granularity,
			 category:item.construction,

		 });

				try {
				 const newProduct =  csvtest.save();
				}
				catch (error) {
				 res.json({message: error})
				}
			});
			})

		.catch(error=>{
	     res.send(error)
	  })
		res.send("uploaded")
	})

module.exports = router;
