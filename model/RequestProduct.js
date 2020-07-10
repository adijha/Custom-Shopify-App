const mongoose = require("mongoose");

const RequestProductSchema = mongoose.Schema({
  merchantId:{
    type:String
  },
  date:{
    type:Date
  },
  name:{
    type:String
  },

  link:{
    type:String
  }
});

module.exports = mongoose.model("RequestProduct", RequestProductSchema);
