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
var Invoice = require('../models/invoice');
var generateSms = require('./../middlewear/sms');
var generateMail = require('./../middlewear/mail');
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
      Paymentdetails.findOne({ 'customer': req.body.customer_id }, function (error, result) {
        result.advance = req.body.pd_advance,
          result.due_amt = req.body.pd_due_amt,
          result.updated_by = req.userData._id,
          result.save();

          Order.findOneAndUpdate({ 'order_id': orderid }, {
            $set: {
                order_status: "Delivered",
                paymentstatus:"Paid",
                delivered_at: new Date()
            }
        }).populate('customer')
            .then((order) => {
                if (!order) {
                    res.status(200).json({ Success: false, Message: "No Such Order Found" });
                } else {
                    var name = order.customer.first_Name;
                    var email = order.customer.email;
                    var mobile = order.customer.mobile;
                    var amount = order.order_amount;
                    var total_qty = order.total_qty;

                    generateMail(email,
                        `<!DOCTYPE html>
           <html>
           <head>
               <meta charset="utf-8" />
               <meta http-equiv="X-UA-Compatible" content="IE=edge">
               <title>Page Title</title>
               <meta name="viewport" content="width=device-width, initial-scale=1">
               <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
               <script src="main.js"></script>
           </head>
           <body>
           <table>
               <tr><b>Dear ${name},</b></tr>

               <tr>Your Order ${orderid} of amount Rs ${amount}, consisting of ${total_qty} garments is delivered.</tr>
           
               <tr><b>Thanks,</b></tr>
                                                                                       
               <tr><b>Team 24Klen Laundry Science</b></tr>
            </table>
            </body>
            </html>`,
                        `Successful Order Delivery ${orderid} with 24klen Laundry Science`
                    );
                    generateSms(mobile,
                        `Dear ${name} Your Order ${orderid} of amount Rs ${amount}, consisting of ${total_qty} garments is delivered.Thank you`
                    ).catch((err) => {
                        res.status(400).json(err);
                    })
                    res.status(200).json({ Success: true, Message: "Order Delivered" });
                }
            })
          // res.json({success:true, msg:'Payment details has updated successfully!'});
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

ordertransactionRouter
  .route('/ordertransaction')
  .get(checkAuth, function (req, res) {
    // {'invoices.$.order.0.deliveryassign_to':"5b46e8ec93f9ac002012e609"}
    Invoice.find()
    .populate(' customer ordertransaction order')
    .then((data)=>{
      // var aa='5b348939e4044000207f3a8f';
      // console.log(req.userData._id);
     var data1=data.filter(element =>element.order.deliveryassign_to == req.userData._id );
      console.log('//////',data1);
      res.json({data});
    })

  })

module.exports = ordertransactionRouter;