var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;

var Customer = require('./customer');
var feedbackSchema = new Schema({
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
  created_at:{
    type: Date,
  },
  updated_at:{
    type: Date,
  },
  status:{
    type: Boolean
  }
}, { collection: 'feedbacks' });

module.exports = mongoose.model('Feedback', feedbackSchema);
