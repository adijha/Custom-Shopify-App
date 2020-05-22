const Joi = require('@hapi/joi');


const userValidation = (data) =>{

	const schema = Joi.object({
		supplier_id: Joi.string(),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().required(),
		category: Joi.string(),
		firstName: Joi.string(),
		lastName: Joi.string(),
		phoneNo: Joi.number(),
		store:Joi.string(),
		joiningDate:Joi.string()
	});

	return schema.validate(data);

}

module.exports.userValidation = userValidation;
