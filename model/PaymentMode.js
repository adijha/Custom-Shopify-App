const mongoose = require('mongoose');

const paymentModeSchema = new mongoose.Schema({
supplier_id:{
type:String
},
info:{
  type:Object
},
created_on:{
  type:String
}

})

module.exports = mongoose.model('PaymentMode', paymentModeSchema)
