var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var Franchise = require('./franchise');
var Ordertype = require('./ordertype');
var customerSchema = new Schema({
    first_Name: {
        type: String,
        required: true
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Franchise'
    },
    order_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ordertype'
    },
    gender: {
        type: String
    },
    dob: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {

                return validator.isEmail(value);

            },
            message: '{VALUE} is not a valid Email'
        }
    },
    mobile: {
        type: String,
        required: true

    },
    whatsup: {
        type: String,
    },
    otp: {
        type: String,
    },
    referral_Code: {
        type: String,
    },
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },
    confirm_Password: {
        type: String
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
        }],     
    }],
    city: {
        type: String,
    },
    state: {
        type: String,
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
}, { collection: 'customers' });

module.exports = mongoose.model('Customer', customerSchema);