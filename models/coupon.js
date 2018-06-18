var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Franchise = require('./franchise');
var couponSchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  franchise: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise'
  }],
  couponCode: {
    type:String,
    required:true,

  },
  offerIn: {
    type:String,
    required:true,

  },
  couponAmount: {
    type:String,
    required:true,

  },
  validFor: {
    type:String,
    required:true,
   
  },
  description: {
    type:String,
    required:true,
  },
  couponExpireAt: {
    type:Date,
    required:true,
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  couponCreatedAt:{ 
    type:Date,
 
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  updated_at:{
    type: Date
  },
  status:{
    type: Boolean
  },
  state:{
    type: Boolean
  }
}, { collection: 'coupons' });

module.exports = mongoose.model('Coupon', couponSchema);
