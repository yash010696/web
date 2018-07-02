var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var patternSchema = new Schema({
    pattern_name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // created_at:{
    //   type: Date,
    // },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // updated_at:{
    //   type: Date
    // },
    status: {
        type: Boolean
    },
    state: {
        type: Boolean
    },
    patternImage: {
        type: String
    }
}, {
    timestamps: true
}, { collection: 'patterns' });

module.exports = mongoose.model('Pattern', patternSchema);