const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  category:{
    type: String,
    require: true
  }
})

module.exports = mongoose.model('Category', CategorySchema);
