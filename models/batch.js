var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var Batchcategory = require('./batchcategory');
var Batchsubcategory = require('./batchsubcategory');
var Batchprogram = require('./batchprogram');
var batchSchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1
  // },
  batchcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batchcategory'
  },
  batchsubcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batchsubcategory'
  },
  batchprogram: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batchprogram'
  },
  no_Of_Pieces: {
    type:String,
    required:true
  },
  weight: {
    type:String,
    required:true
  },
  temperature: {
    type:String,
    required:true
  },
  dosage: {
    type:String,
    required:true
  },
  batch_Status: {
    type:String,
    required:true
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at:{
    type: Date,
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_at:{
    type: Date
  }

}, { collection: 'batches' });

module.exports = mongoose.model('Batch', batchSchema);
