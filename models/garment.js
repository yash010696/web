var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Service = require('./service');
var Subservice = require('./subservice');

var garmentSchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  name: {
    type:String,
    required:true,
    unique:true
  },
  code: {
    type:String,
    required:true,
    unique:true
  },
  // service_Id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Service'
  // },
  // subservice_Id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Subservice'
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
    type: Date
  },
  status:{
    type: Boolean
  },
  state:{
    type: Boolean
  }
}, { collection: 'garments' });

module.exports = mongoose.model('Garment', garmentSchema);
