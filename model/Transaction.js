const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    supplier_id:{
      type:String
    },
    trans_id:{
      type:String
    },
    amount_paid:{
      type:Number
    },
    pmethod:{
      type:String
    },
    date:{
      type:Date
    },
    time:{
      type:String
    }
});

module.exports = mongoose.model('Transaction', transactionSchema)
