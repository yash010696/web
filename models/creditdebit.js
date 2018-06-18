var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var { Customer } = require('./customer');
var {RequestOrder}= require('./requestorder');

var creditdebitSchema = new mongoose.Schema({

    pendingAmount:{
        type:Number,
        default:0
    },
    balanceAmount:{
        type:Number,
        trim:true,
        default:0
    },   
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    unique:true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }
}, { timestamps: true });

var CreditDebit = mongoose.model('CreditDebit', creditdebitSchema, collection = "creditdebit");

module.exports = { CreditDebit };

