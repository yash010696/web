var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var Service = require('./service');
var Subservice = require('./subservice');

var garmentSchema = new Schema({
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
  },
  status:{
    type: Boolean
  },
  state:{
    type: Boolean
  }
}, { collection: 'garments' });

module.exports = mongoose.model('Garment', garmentSchema);
