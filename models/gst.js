var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var gstSchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1

  },
  CGST: {
    type:String,
    required:true

  },
  SGST: {
    type: String,
    required: true
  },
  // IGST: {
  //   type:String,
  //   required:true

  // },
  GST: {
    type: String,
    required: true
  },
  created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admininfo'
  },
  // created_at:{
  //   type: Date,
  // },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  // updated_at:{
  //   type: Date
  // },
  status:{
    type: Boolean
  },
  state:{
    type: Boolean
  }
},{
  timestamps: true
}, { collection: 'gsts' });



{
  timestamps: true
}
module.exports = mongoose.model('Gst', gstSchema);
