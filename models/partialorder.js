var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var { Customer } = require('./customer');
var { RequestOrder } = require('./requestorder');

var partialorderSchema = new mongoose.Schema({
    partialOrderId: {
        type:Number,
        unique:true,
        default:1
    },
    requestId: {
        type:Number,
        unique:true,
        default:1
    },
    servicename: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean
    }
}, { timestamps: true });

var PartialOrder = mongoose.model('PartialOrder', partialorderSchema, collection = "partialorder");

module.exports = { PartialOrder };

