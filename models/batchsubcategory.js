var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Batchcategory = require('./batchcategory');
var batchsubcategorySchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1
  // },
  batchcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batchcategory'
  },
  subcategory: {
    type:String,
    required:true,
    unique:true

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
  }
}, { collection: 'batchsubcategories' });

module.exports = mongoose.model('Batchsubcategory', batchsubcategorySchema);
