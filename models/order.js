var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Customer = require('./customer');
var Franchise = require('./franchise');
var Servicetype = require('./servicetype');
var order_Status=require('./orderstate');
var orderSchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1
  // },
  order_id: {
    type:String,
    required:true,
    unique:true
  },
  franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  servicetype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicetype'
  },
  order_amount: {
    type:String,
    required:true,
  },
  order_status:{
    type:String 
  },
  created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admininfo'
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  status:{
    type: Boolean
  },
  state:{
    type: Boolean
  }
},{
  timestamps: true
}, { collection: 'orders' });
module.exports = mongoose.model('Order', orderSchema);
