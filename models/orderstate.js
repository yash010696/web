var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var orderstateSchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1
  // },
  state: {
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
  }
}, { collection: 'orderstates' });

module.exports = mongoose.model('Orderstate', orderstateSchema);
