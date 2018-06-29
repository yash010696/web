var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Customer = require('./customer');
var Franchise = require('./../models/franchise');
var Servicetype = require('./../models/servicetype');
var Timeslot = require('./../models/timeslot');
var User = require('./../models/user');
var Pickupdeliveryboy = require('./../models/pickupdeliveryboy');

var RequestOrderSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true,
        default: 1
    },
    locationType: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Customer'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Customer'
    },
    quantity: {
        type: Number,
    },
    request_status:{
        type: String,
        required: true,
        trim: true
    },
    pickupdelivery:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Pickupdeliveryboy'
    },
    servicetype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servicetype',
    },
    pickupDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timeslot'
    },
    franchise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise',
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    state: {
        type: Boolean
    },
    status: {
        type: Boolean
    },
    message:{
        type:String,
        default:null
    }

},
{ timestamps: true },
{ collection: 'requestorder' }
);

module.exports = mongoose.model('RequestOrder', RequestOrderSchema );