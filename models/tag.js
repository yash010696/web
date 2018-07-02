var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
var ObjectId = mongoose.Types.ObjectId;


var User = require('./user');
var Franchise = require('./franchise');
var Customer = require('./customer');
var Order = require('./order');
var tagSchema = new Schema({

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  order_id: {
    type: String,
    required: true,
   
  },
  franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise'
  },
  tagDetailsService: [{
    type: mongoose.Schema.Types.Mixed,
    ref: 'Service',
    subservice: [
      {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Subservice',
        garmentlist: [
          {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Garment',
            garmentTagDetails: [{
              _id:{ type: mongoose.Schema.Types.ObjectId},
              tag_Format: {
                type: String
              },
              tag_Text: {
                type: String
              },
              price:{
                type:String
              },
              subservice:{
                type: String
              },
              qty:{
                type: String
              },
              barcode_Number: {
                type: String
              },
              color:
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Color'
                },
              brand:
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Brand'
                },
              pattern:
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Pattern'
                },
              clothdefect:
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Clothdefect'
                }
            }]
          }
        ]
      }
    ]
  }],

  // tag_Format: {
  //   type:String,
  //   required:true
  // },
  // tag_Text: {
  //   type:String,
  //   required:true
  // },
  // barcode_Number: {
  //   type:String,
  //   required:true
  // },
  customer_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
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
    type: Date,
  },
  status: {
    type: Boolean
  }
}, { collection: 'tags' });

module.exports = mongoose.model('Tag', tagSchema);
