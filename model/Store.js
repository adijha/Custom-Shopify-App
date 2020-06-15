const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name:{
    type: String
  },
  token:{
    type: String
  },
  code:{
    type: String
  },
  hmac:{
    type: String
  },
  created_on:{
    type:Date
  }
});

module.exports = mongoose.model('Store', storeSchema)
