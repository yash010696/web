var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Pickupdeliveryboy = require('./../models/pickupdeliveryboy');

var dailycollectionSchema = new mongoose.Schema({
    amount_submitted_cash: {
        type: String
    },
    amount_by_paytm: {
        type: String
    },
    amount_by_card: {
        type: String
    },
    amount_by_cheque_bank: {
        type: String
    },
    submitted_to: {
        type: String
    },
    submitted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pickupdeliveryboy'
    },
    submitted_at: {
        type: Date
    },

}, { timestamps: true });

var DailyCollection = mongoose.model('DailyCollection', dailycollectionSchema, collection = "dailycollection");

module.exports =  DailyCollection ;

