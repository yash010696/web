var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var ordertypeSchema = new Schema({
    // id: {
    //     type: Number,
    //     unique: true,
    //     default: 1
    // },
    order_type: {
        type: String,
        unique: true
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
    state: {
        type: Boolean
    }
}, { collection: 'ordertypes' });

module.exports = mongoose.model('Ordertype', ordertypeSchema);