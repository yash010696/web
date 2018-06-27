var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema1 = new Schema({
  // id: {
  //   type: Number,
  //   unique: true,
  //   required: true
  // },
  name: {
    type:String,
    required:true,
    trim:true,
    minlength:5
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, { collection: 'dataItems1' });

module.exports = mongoose.model('Item1', itemSchema1);
