var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var Customer = require('./customer');
var Franchise = require('./franchise');
var Order = require('./order');
var Ordertransaction = require('../models/ordertransaction');
var invoiceSchema = new Schema({
    invoice_id: {
        type: String,
        required: true,
        unique: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    ordertransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ordertransaction'
    },
    franchise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    invoice_amount: {
        type: String
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean
    },
    state: {
        type: Boolean
    }
}, {
    timestamps: true
}, { collection: 'invoices' });
module.exports = mongoose.model('Invoice', invoiceSchema);