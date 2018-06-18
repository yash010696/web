var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;

// var Customer = require('./customer');
// var User = require('./user');
var mailSchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  subject: {
    type:String,
    required:true
  },
  body: {
    type:String,
    required:true
  },
  // customer_Id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Customer'
  // },
  // user_Id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // },
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
    type: Date,
  },
  status:{
    type: Boolean
  }
}, { collection: 'mail' });

module.exports = mongoose.model('Mail', mailSchema);
