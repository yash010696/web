var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./user');
var Customer = require('./customer');
var Franchise = require('./franchise');
var Service = require('./service');
var Servicetype = require('./servicetype');
var Subservice = require('./subservice');
var Garment = require('./garment');
var Price = require ('./price');
var Color = require ('./color');
var Specialservice = require ('./specailservice');
var Brand = require ('./brand');
var Pattern = require ('./pattern');
var Clothdefect = require ('./clothdefect');
var Coupon = require ('./coupon');
var ordertransactionSchema = new Schema({

  order_id: {
    type:String,
    required:true,
    unique:true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise'
  },
  servicetype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicetype'
  },
  ordertype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ordertype'
  },
  ordertypename: {
    type:String
  },
  service: [{
    type: mongoose.Schema.Types.Mixed,
    ref: 'Service',
    subservice: [
      {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Subservice',
        garmentlist: [
          {
            garmentdetails: [{
              _id:{ type: mongoose.Schema.Types.ObjectId},
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
                },
                specialservice:
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Specialservice'
                }
            }]
          },
          {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Price',
          },
          {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Service',
          },
          {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Subservice',
          },
          {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Garment',
          }
        ]
      }
    ]
  }],
  total_qty:{
    type:String
  },
  total_beforedis:{
    type:String
  },
  total_afetrdis:{
    type:String
  },
  net_amount:{
    type:String
  },
  // discount_inpercen:{
  //   type:String,
  //   default:0
  // },
  // discount_invalue:{
  //   type:String,
  //   default:0
  // },
  discount_amount:{
    type:String,
    default:0
  },
  previous_due: {
    type:String,
    default:0
  },
  current_due: {
    type:String,
    default:0
  },
  advance: {
    type:String,
    default:0
  },
  paid_amt: {
    type:String,
    default:0
  },
  payment_mode_adv:{
    type: String
  },
  payment_mode_delivery:{
    type: String
  },
  balance_due: {
    type:String,
    default:0
  },
  due_date:{
    type: Date
  },
  selectedsgstpercent:{
    type:String
  },
  selectedcgstpercent:{
    type:String
  },
  cgst:{
    type:String
  },
  sgst:{
    type:String
  },
  gst:{
    type:String
  },
  // coupon:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Coupon'
  // },
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
}, { collection: 'ordertransactions' });
module.exports = mongoose.model('Ordertransaction', ordertransactionSchema);
