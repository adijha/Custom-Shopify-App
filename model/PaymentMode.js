const mongoose = require('mongoose');

const paymentModeSchema = new mongoose.Schema({
supplier_id:{
type:String
},
info:{
  type:Object
}

})

module.exports = mongoose.model('PaymentMode', paymentModeSchema)
