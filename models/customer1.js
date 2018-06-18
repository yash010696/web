var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customer1Schema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength:1
  },
  age: {
    type: Number,
    required: true,
    default: 1
  }
}, { collection: 'dataCustomers' });

module.exports = mongoose.model('Customer1', customer1Schema);
