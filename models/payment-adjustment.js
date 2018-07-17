const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentAdjustmentSchema = new Schema({
    adjustment_reason: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        uppercase: true
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
});

module.exports = mongoose.model('PaymentAdjustment', paymentAdjustmentSchema);