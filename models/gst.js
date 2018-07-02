var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var gstSchema = new Schema({
  CGST: {
    type:String,
    required:true

  },
  SGST: {
    type: String,
    required: true
  },
  GST: {
    type: String,
    required: true
  },
  created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },

  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type: Boolean
  },
  state:{
    type: Boolean
  }
},{
  timestamps: true
}, { collection: 'gsts' });

module.exports = mongoose.model('Gst', gstSchema);
