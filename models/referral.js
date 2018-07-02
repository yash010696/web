var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var referralSchema = new Schema({
  referral_value: {
    type:String,
    required:true,
    unique:true

  },
  min_ordervalue: {
    type: String,
    required: true,
    unique:true
  },
  created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type: Boolean
  },
  state:{
    type: Boolean
  }
  
},{
  timestamps: true
}, { collection: 'referrals' });
module.exports = mongoose.model('Referral', referralSchema);
