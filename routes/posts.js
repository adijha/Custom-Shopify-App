const router = require('express').Router();
const verify = require('./verifyToken');



router.get('/',verify, (req, res)=>{
	res.json({
		posts:
			{title: "My First Post",
			 Description: "This is show after token token access....."
			}
		});


});


module.exports = router;
