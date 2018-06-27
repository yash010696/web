var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;


var Admininfo = require('./admininfo');
// var Customer = require('./customer');
// var Order = require('./order');
var tagSchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1
  // },
  tag_Text: {
    type:String,
    required:true
  },
  barcode_Number: {
    type:String,
    required:true
  },
  // customer_Id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Customer'
  // },
  // order_Id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Order'
  // },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  created_at:{
    type: Date,
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  updated_at:{
    type: Date,
  },
  status:{
    type: Boolean
  }
}, { collection: 'tags' });

module.exports = mongoose.model('Tag', tagSchema);
