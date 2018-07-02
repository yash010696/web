var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Batch= require('./batch');
var Orderstate = require('./orderstate');
// var Order = require('./order');
// var Customer = require('./customer');
var workshopactivitySchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  batch_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  orderstate_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orderstate'
  },
  // order_Id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Order'
  // },
  // customer_Id: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'Customer'
// },
  reason: {
    type:String,
    required:true
  },
  created_by:{
    type:String
  },
  created_at:{
    type: Date,
  },
  updated_by:{
    type:String
  },
  updated_at:{
    type: Date
  },
  status:{
    type: Boolean
  }

}, { collection: 'workshopactivities' });

module.exports = mongoose.model('Workshopactivity', workshopactivitySchema);
