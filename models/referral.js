var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var referralSchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1

  // },
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
      ref: 'Admininfo'
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
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
