var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Customer = require('./customer');
var Service = require('./service');
var Servicetype = require('./servicetype');
var Subservice = require('./subservice');
var Garment = require('./garment');
var Price = require ('./price');
var Color = require ('./color');
var Brand = require ('./brand');
var Pattern = require ('./pattern');
var Clothdefect = require ('./clothdefect');
var Coupon = require ('./coupon');
var ordertransactionSchema = new Schema({
  // id: {
  //   type:Number,
  //   unique:true,
  //   default:1
  // },
  order_id: {
    type:String,
    required:true,
    unique:true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  servicetype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicetype'
  },
  service:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    subservice:[
      {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Subservice',
         garment:[
           {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Garment',
            garmentdetails:{
               color:[
                 {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Color'
                 }
               ],
               brand:[
                {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'Brand'
                }
              ],
              pattern:[
                {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'Pattern'
                }
              ],
              clothdefect:[
                {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'Clothdefect'
                }
              ]
              }
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
  cgst:{
    type:String
  },
  sgst:{
    type:String
  },
  gst:{
    type:String
  },
  coupon:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admininfo'
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
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
