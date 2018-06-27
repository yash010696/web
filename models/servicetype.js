var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var servicetypeSchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1
  // },
  type: {
    type:String,
    required:true,
    unique:true
  },
  code: {
    type:String,
    required:true,
    unique:true
  },
  no_Of_Days: {
    type:String,
    required:true,
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
}, { collection: 'servicetypes' });

module.exports = mongoose.model('Servicetype', servicetypeSchema);
