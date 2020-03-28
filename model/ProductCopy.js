const mongoose = require('mongoose');

const ProductCopySchema = mongoose.Schema({
merchantEmail:{
  type:String
},
  product:{
    type:Array
  }

})

module.exports = mongoose.model('ProductCopy', ProductCopySchema);
