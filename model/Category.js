const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  category:{
    type: String,
    require: true
  },
  created_on:{
    type:String
  },
  margin:{
    type:Number
  },
  margin_updated:{
    type:String
  }
})

module.exports = mongoose.model('Category', CategorySchema);
