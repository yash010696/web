var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var User = require('./user');
var Customer = require('./customer');
var Franchise = require('./franchise');
var Servicetype = require('./servicetype');
var Ordertype = require('./ordertype');
var orderSchema = new Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  servicetype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicetype'
  },
  ordertype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ordertype'
  },
  due_date: {
    type: Date
  },
  order_status: {
    type: String
  },
  total_qty: {
    type: String
  },
  order_amount: {
    type: String,
    default:00
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  workshopto_at: {
    type: Date
  },
  ready_at: {
    type: Date
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
  },
  requestId: {
    type: String,
    required: true,
    // unique: true,
  },
  pickupdelivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickupdeliveryboy'
  },
  partialorder: {
    type: Boolean
  },
  message: {
    type: String,
    default: null
  }
}, {
    timestamps: true
  }, { collection: 'orders' });
module.exports = mongoose.model('Order', orderSchema);
