var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var User = require('./user');
var Order = require('./order');
var paymentdetailSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  due_amt: {
    type:String,
    default:0
  },
  advance: {
    type:String,
    default:0
  },
  created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type: Boolean
  },
  state:{
    type: Boolean
  }
},{
  timestamps: true
}, { collection: 'Paymentdetails' });
module.exports = mongoose.model('Paymentdetail', paymentdetailSchema);
