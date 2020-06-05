const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  category:{
    type: String,
    require: true
  },
  created_on:{
    type:String
  }
})

module.exports = mongoose.model('Category', CategorySchema);
