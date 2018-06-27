var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var orderstatusSchema = new Schema({
    // id: {
    //     type: Number,
    //     unique: true,
    //     default: 1
    // },
    status_Name: {
        type: String,
        required: true,
        unique: true

    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admininfo'
    },
    created_at: {
        type: Date,
    },
    updated_by: {
        type: String
    },
    updated_at: {
        type: Date
    },
    status: {
        type: Boolean
    },
    state: {
        type: Boolean
    }
}, { collection: 'orderstatuses' });

module.exports = mongoose.model('Orderstatus', orderstatusSchema);