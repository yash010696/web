var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var specialserviceSchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1
  // },
  specialservice_name: {
    type:String,
    required:true,
    unique:true
  },
  code: {
    type:String,
    required:true,
    unique:true
  },
  price: {
    type:String,
    required:true,
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // created_at:{
  //   type: Date,
  // },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
},
  {
    timestamps: true
  }, { collection: 'specialservices' });

module.exports = mongoose.model('Specialservice', specialserviceSchema);
