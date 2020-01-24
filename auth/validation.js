const Joi = require('@hapi/joi');

const userValidation = (data) =>{
  const schema = Joi.object({
    email:Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    supplierId: Joi.string().min(3)
  })
  return schema.validate(data);
}

module.exports.userValidation = userValidation;
