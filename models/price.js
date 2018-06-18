var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Service = require('./service');
var Subservice = require('./subservice');
var Servicecategory = require('./servicecategory');
var Servicetype = require('./servicetype');
var Garment = require('./garment');

var priceSchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  price: {
    type:String,
  },
  servicetype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicetype'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  subservice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subservice'
  },
  // servicecategory: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Servicecategory'
  // },
  garment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garment'
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
  state:{
    type: Boolean
  }
}, { collection: 'prices' });

module.exports = mongoose.model('Price', priceSchema);
