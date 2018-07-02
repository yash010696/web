var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');
var timeslotSchema = new Schema({
    time_Slot: {
        type: String,
        required: true,
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
}, { collection: 'timeslots' });

module.exports = mongoose.model('Timeslot', timeslotSchema);