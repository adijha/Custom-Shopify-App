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
		joiningDate:Joi.string(),
		name:Joi.string(),
		username: Joi.string(),
		businessName: Joi.string(),
		accountno: Joi.number(),
		pmethod: Joi.string(),
		address:Joi.string(),
		westernId:Joi.string(),
		sortCode:Joi.string(),
		profileId:Joi.string(),
		trans_id:Joi.string(),
		amount_paid:Joi.number(),
		margin:Joi.number(),
		margin_updated: Joi.string(),

	});

	return schema.validate(data);

}

module.exports.userValidation = userValidation;
