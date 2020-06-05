const mongoose = require('mongoose');

const MarginSchema = mongoose.Schema({
  margin:{
    type: Number,
    require: true
  }
});

module.exports = mongoose.model('Margin', MarginSchema);
