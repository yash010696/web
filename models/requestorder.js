var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Customer = require('./customer');
var Pickupdeliveryboy = require('./pickupdeliveryboy');;
var Franchise = require('./../models/franchise');
var Servicetype = require('./../models/servicetype');
var Timeslot = require('./../models/timeslot');
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
        ref:'Customer'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Customer'
    },
    pickupdelivery:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Pickupdeliveryboy'
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
    request_status:{
        type: String,
        required: true,
        trim: true
    },
    pickupdelivery:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Pickupdeliveryboy'
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