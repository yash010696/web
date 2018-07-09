var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Customer = require('./customer');
var Pickupdeliveryboy = require('./pickupdeliveryboy');;
var Franchise = require('./../models/franchise');
var Servicetype = require('./../models/servicetype');
var Timeslot = require('./../models/timeslot');
var Ordertype = require('./ordertype');
var User = require('./../models/user');

var RequestOrderSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true,
        default: 1
    },
    locationType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    address: [{
        home: [{
            pincode: {
                type: String,
                required: true,
                trim: true,
                minlength: 6,
            },
            flat_no: {
                type: String,
                required: true,
                trim: true
            },
            society: {
                type: String,
                trim: true
            },
            landmark: {
                type: String,
                required: true,
                trim: true
            }
        }],
        other: [{
            pincode: {
                type: String,
                required: true,
                trim: true,
                minlength: 6,
            },
            flat_no: {
                type: String,
                required: true,
                trim: true
            },
            society: {
                type: String,
                trim: true
            },
            landmark: {
                type: String,
                required: true,
                trim: true
            }
        }]
    }],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    pickupdelivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pickupdeliveryboy'
    },
    quantity: {
        type: Number,
    },
    servicetype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servicetype'
    },
    pickupDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timeslot'
    },
    ordertype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ordertype'
      },
    franchise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    request_status: {
        type: String
    },
    state: {
        type: Boolean
    },

    status: {
        type: Boolean
    },
    request_status: {
        type: String,
        required: true,
        trim: true
    },
    pickupdelivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pickupdeliveryboy'
    },
    message: {
        type: String,
        default: null
    },
    picked_at: {
        type: Date,
        default: null
    },
    unpicked_at: {
        type: Date,
        default: null
    }

},
    { timestamps: true },
    { collection: 'requestorder' }
);

module.exports = mongoose.model('RequestOrder', RequestOrderSchema);