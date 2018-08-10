const mongoose = require('mongoose');

const holidaySchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    day: {
        type: String,
        required: true
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
});

const weeklyOffSchema = mongoose.Schema({
    off_day: {
        type: Number,
        required: true
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
});

const Holiday = mongoose.model('Holiday', holidaySchema);
const WeeklyOff = mongoose.model('WeeklyOff', weeklyOffSchema);
module.exports = { Holiday, WeeklyOff };