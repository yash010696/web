var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationtypeSchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  notification_Type: {
    type:String,
    required:true,
    unique:true
  },
  created_by:{
    type:String
  },
  created_at:{
    type: String,
  },
  updated_by:{
    type:String
  },
  updated_at:{
    type: String
  },
  status:{
    type: Boolean
  }
}, { collection: 'notificationtypes' });

module.exports = mongoose.model('Notificationtype', notificationtypeSchema);
