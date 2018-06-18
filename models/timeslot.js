var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeslotSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        default: 1
    },
    time_Slot: {
        type: String,
        required: true,
        unique: true
    },
    created_by: {
        type: String
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
}, { collection: 'timeslots' });

module.exports = mongoose.model('Timeslot', timeslotSchema);