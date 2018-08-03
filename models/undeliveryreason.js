var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var undeliveryreasonSchema = new Schema({
  reason_name: {
    type:String,
    required:true,
    unique:true
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
}, { collection: 'undeliveryreason' });



{
  timestamps: true
}
module.exports = mongoose.model('Undeliveryreason', undeliveryreasonSchema);
