var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Area = require('./area');
var franchiseSchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1
  // },
  owner_Name: {
    type:String,
    required:true
  },
  franchise_Name: {
    type:String,
    required:true
  },
  store_code:{
    type:String,
    trim:true
  },
  company_Name: {
    type:String,
    required:true
  },
  billing_Name: {
    type:String,
    required:true
  },
  billing_Address: {
    type:String,
    required:true
  },
  gstin_Number: {
    type:String,
    required:true
  },
  area: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }],
  store_Address: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
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
    type: Date
  },
  status:{
    type: Boolean
  },
  statee:{
    type: Boolean
  }
}, { collection: 'franchises' });

module.exports = mongoose.model('Franchise', franchiseSchema);
