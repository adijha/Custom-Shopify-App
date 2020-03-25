const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../model/User');
const Products = require('../model/Products');
const CsvTest = require('../model/CsvTest');
const Category = require('../model/Category')
const Margin = require('../model/Margin')
const {userValidation} = require('../validation');
const fileUpload = require('express-fileupload');
const csv=require('csvtojson');
const request = require('request-promise');


const upload = multer({
	storage: multer.memoryStorage()
})



/*Supplier Part*/

//Register Account
router.post('/signUp', async (req, res)=>{

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

//add margin
router.post('/addMargin', async (req, res)=>{

	const margin = new Margin({
		margin: req.body.margin
	})

	try {
		const newMargin = await margin.save();
		console.log("new margin is", newMargin)
		res.json("new margin added");
	}
	 catch (error) {
		console.log("margin added error is ", error)
	}

});

//get Margin liste
router.get('/margin', async (req, res)=>{

	try {
		const margin = await Margin.find({});
		res.json(margin)
	} catch (error) {
		console.log("error in get margin", error)
	}

})

//category add
router.post('/addCategory', async (req, res)=>{

	const add =  new Category({
		category: req.body.category
	});

	try {
		const newCategory = await add.save();
		console.log(newCategory, "category added")
		res.json("product Added")
	} catch (error) {
		console.log("category add error", error)
	}

})



//get category
router.get('/totalCategory', async (req, res)=>{
	try {
		const categories = await Category.find({});
		res.json(categories)
	} catch (error) {
		console.log("error in get category", error)
	}
})

router.get('/product/filter/:category', async (req, res)=>{
	console.log("category filter req.body", req.params.category)
	try {
		const data =await Products.find({"category":req.params.category})
		res.json(data)
	} catch (error) {
		res.json(error)
	}
})

router.delete('/category/:id', async (req, res)=>{
	try {
		const data = await  Category.deleteOne({"_id":req.params.id})
		res.json({message:"category Deleted"})
	} catch (e) {
		res.json({ message: error.message });

	}
})
//Add Product
router.post('/addProduct',upload.array('productImage'),async (req, res)=>{
	const files = await req.files;
	 //console.log("files is ", req.files);




	let imgData=[];

	 files.forEach(file=>{
		 let bufferString =
		imgData.push({
			imgName: file.mimetype,
			imgBufferData:  file.buffer.toString('base64')
		})
	})
	//console.log("imageDatais", imgData)
	const product = await new Products({
	 supplier_id: req.body.supplier_id,
	 name: req.body.name,
	 price: req.body.price,
	 quantity: req.body.quantity,
	 warranty: req.body.warranty,
	 description: req.body.description,
	 category:req.body.category,
	 code:req.body.code,
	 weight:req.body.weight,
	 productImage: imgData,
	 uploaded_on: Date(),
	 size: req.body.size,
	 color: req.body.color,
	 tag:req.body.tag
 });
 //  console.log(product , "product is");
 //  console.log("req.body", req.body);
 // console.log(typeof(imgData));
 //console.log("product object is", product)
	 try {

		const newProduct = await product.save();
		//console.log("post response", JSON.stringify(product))
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


//update all products with some margin by Admin

router.patch('/productPrice/:id', async (req, res)=>{
	let id = req.params.id
	let price = req.body.price;
	console.log("sellling Price is", price)
	console.log("product id", id);

	// const data = await Products.find({})
	// //console.log(data, "from update Margin")
	//
	// data.forEach((item, i) => {
	// 	console.log(item.price)
	// 	const updateData =  Products.updateOne({_id: item._id}, {$set: {price: item.price+item.price*margin/100}})
	// 	console.log(updateData, "update Price")
	// });

try {
	const updatePrice = await Products.updateOne(
		{_id: id}, {$set: {price: price}})
		res.json("saved updated price is")
} catch (error) {
	console.log("update price error is:", error);
}


})


//last 10 days products Added

router.get('/analyticProduct', async (req, res)=>{
	try {
		const data = await Products.find(
{
    "uploaded_on":
    {
        $gte: (new Date((new Date()).getTime() - (10 * 24 * 60 * 60 * 1000)))
    }
}
).sort({ "date": -1 })
console.log("analytic product data", data)
} catch (error) {
		console.log(error);
	}
})

//Csv product Add
	router.post('/product/csv', async (req, res)=>{
	  console.log("sile",req.files.file);
	  console.log("file path is", req.files.file.tempFilePath)
	   const csvFilePath= req.files.file.tempFilePath;
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

			} catch (error) {
				console.log("catch error is", error)
}
			});
			res.json("product added completed");
			})

		.catch(error=>{
	     res.send(error)
	  })
		console.log("uploaded")
	})


//get CSv product List
	router.get('/csv/product', async (req, res)=>{
		try {
			const item = await CsvTest.find();
			res.json(item);
		}
		catch (error) {
			res.json({message:error})
		}
	})



module.exports = router;
