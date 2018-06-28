var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = mongoose.Types.ObjectId;

var Franchise = require('./franchise');
var Role = require('./role');

var pickupdeliveyboySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    franchise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise'
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_at: {
        type: Date
    },
    status: {
        type: Boolean
    },
    statee: {
        type: Boolean
    }
},{
    timestamps: true
  }, { collection: 'pickupdeliveryboys' });

module.exports = mongoose.model('Pickupdeliveryboy', pickupdeliveyboySchema);