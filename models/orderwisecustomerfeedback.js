var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;

var Customer = require('./customer');
// var Order = require('./order');
var orderwisefeedbackSchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  message: {
    type:String,
    required:true
  },
  rating: {
    type:String,
    required:true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  // order_Id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Order'
  // },
  created_at:{
    type: Date,
  },
  updated_at:{
    type: Date,
  },
  status:{
    type: Boolean
  }
}, { collection: 'orderwisefeedbacks' });

module.exports = mongoose.model('OrderWiseFeedback', orderwisefeedbackSchema);
