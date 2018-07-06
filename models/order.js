var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var User = require('./user');
var Customer = require('./customer');
var Franchise = require('./franchise');
var Servicetype = require('./servicetype');
var Ordertype = require('./ordertype');
var RequestOrder = require('./requestorder');
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
    default: 00
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RequestOrder'
  },
  pickupdelivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickupdeliveryboy'
  },
  paymentstatus: {
    type: String,
  },
  partialorder: {
    type: Boolean
  },
  address: [{
    home: [{
      pincode: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
      },
      flat_no: {
        type: String,
        required: true,
        trim: true
      },
      society: {
        type: String,
        trim: true
      },
      landmark: {
        type: String,
        required: true,
        trim: true
      }
    }],
    other: [{
      pincode: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
      },
      flat_no: {
        type: String,
        required: true,
        trim: true
      },
      society: {
        type: String,
        trim: true
      },
      landmark: {
        type: String,
        required: true,
        trim: true
      }
    }]
  }],
  message: {
    type: String,
    default: null
  },
  undelivered_at: {
    type: Date,
    default: null
  },
  delivered_at: {
    type: Date,
    default: null
  },
  payment_details: [{
    mihpayid: {
      type: String,
      trim: true
    },
    addedon: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      trim: true
    },
    txnid: {
      type: String,
      trim: true
    },
    bank_ref_num: {
      type: String,
      trim: true
    },
    mode: {
      type: String,
      trim: true
    },
    net_amount_debit: {
      type: String,
      trim: true
    },
  }]
}, {
    timestamps: true
  }, { collection: 'orders' });
module.exports = mongoose.model('Order', orderSchema);
