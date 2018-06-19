var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var {Customer}=require('./customer');
var Franchise=require('./../models/franchise');


var RequestOrderSchema = new mongoose.Schema({
    requestId:{
        type:String,
        required:true,
        unique:true,
        default:1
    },
    locationType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    customer:{
        type:String,
        trim:true
    },
    quantity:{
        type:Number,
    },
    serviceName:{
        type:String,
        required:true,
        trim:true
    }, 
    serviceType:{
        type:String,
        trim:true,
        required:true
    },
    pickupDate:{
        type:Date,
        required:true
    },
    timeSlot:{
        type:String,
        required:true,
        trim:true
    },
    franchise:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise',
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required:true
      },
      updated_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required:true
      },
      state:{
        type: Boolean
      },
      status:{
        type: Boolean
      }

},
    { timestamps: true }
)


var RequestOrder = mongoose.model('RequestOrder', RequestOrderSchema, collection = "requestorder");

module.exports = { RequestOrder };