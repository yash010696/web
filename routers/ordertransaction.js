var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Ordertransaction = require('../models/ordertransaction');
var Order = require('../models/order');
var Verifytoken = require('./loginadmin');
var Customer = require('../models/customer');
var Service = require('../models/service');
var Servicetype = require('../models/servicetype');
var Subservice = require('../models/subservice');
var Garment = require('../models/garment');
var Price = require('../models/price');
var Color = require('../models/color');
var Specialservice = require('../models/specailservice');
var Brand = require('../models/brand');
var Pattern = require('../models/pattern');
var Clothdefect = require('../models/clothdefect');
var Coupon = require('../models/coupon');
var Paymentdetails = require('../models/paymentdetail')
var ordertransactionRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
//Create router for  register the new role.
ordertransactionRouter
  .route('/ordertransaction/:orderid')
  .get(checkAuth, function (req, res) {
    console.log('GET /ordertransaction/:orderid');
    var orderid = req.params.orderid;
    Ordertransaction.
      find({ order_id: orderid }).
      // populate('customer servicetype ').
      populate('customer franchise servicetype service ').
      exec(function (err, orderdata) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Price  is %s', orderdata);
        res.json(orderdata);
      });
  })
  .put(checkAuth, function (req, res) {
    let orderid = req.params.orderid;
    updateTransaction(req, orderid).then(result => {
      Paymentdetails.findOne({ customer: req.body.customer_id }, function (error, result) {
        result.advance = req.body.pd_advance,
          result.due_amt = req.body.pd_due_amt,
          result.updated_by = req.userData._id,
          result.save();
          res.json({success:true, msg:'Payment details has updated successfully!'});
      })
    }).catch(error => {
      res.json({success:false, msg:'Failed to update payment details!'});
    })
  })

const updateTransaction = (req, orderid) => {
  return new Promise((resolve, reject) => {
    Ordertransaction.findOne({ order_id: orderid }, function (err, result) {
      if (result !== null || result.length !== 0) {
        result.order_id = orderid;
          result.payment_mode_delivery = req.body.payment_mode_delivery;
          result.previous_due = req.body.previous_due;
          result.current_due = req.body.current_due;
          result.paid_amt = req.body.paid_amount;
          result.balance_due = req.body.balance_due;
          result.adjustmentAmount =  req.body.adjustmentAmount;
          result.adjustmentReason =  req.body.adjustmentReason;
          result.updated_by = req.userData._id;
          result.updated_at = new Date();
          result.save();
        resolve();
      }
      else {
        reject();
      }
    })
  })
}
module.exports = ordertransactionRouter;