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
var generateSms = require('./../middlewear/sms');
var generateMail = require('./../middlewear/mail');
var Invoice = require('../models/invoice');
var Paymentdetail = require('./../models/paymentdetail');
//Create router for  register the new role.
ordertransactionRouter
  .route('/ordertransaction/:orderid')
  .get(checkAuth, function (req, res) {
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
        res.json(orderdata);
      });
  })

  .put(checkAuth, function (req, res) {
    let orderid = req.params.orderid;

    updateTransaction(req, orderid).then(result => {
      updatePaymentDetails(req).then(result => {
        Order.findOneAndUpdate({ 'order_id': orderid }, {
          $set: {
            order_status: "Delivered",
            status: false,
            paymentstatus: "Paid",
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
              )
              res.status(200).json({ Success: true, Message: "Order Delivered" });
            }
          }).catch((err) => {
            res.status(400).json(err);
          })
        // res.json({ success: true, result: orderResult, msg: 'Payment details has been updated successfully!' });
      })
    }).catch(error => {
      res.json({ success: false, msg: 'Failed to update payment details!' });
    })
  })

const updateTransaction = (req, orderid) => {
  return new Promise((resolve, reject) => {
    Ordertransaction.findOne({ order_id: orderid }, function (err, result) {
      if (result !== null || result.length !== 0) {
        if (req.body.payment_mode_delivery == 'Credit') {
          result.payment_mode_delivery = req.body.payment_mode_delivery;
          result.credit_amt = req.body.credit_amt;
          result.delivered_by = req.userData._id,
            result.updated_at = new Date();
          result.save();
          resolve();
        }
        else {
          result.order_id = orderid;
          result.payment_mode_delivery = req.body.payment_mode_delivery;
          result.previous_due = req.body.previous_due;
          result.current_due = req.body.current_due;
          result.paid_amt = req.body.paid_amount;
          result.balance_due = req.body.balance_due;
          result.adjustmentAmount = req.body.adjustmentAmount;
          result.adjustmentReason = req.body.adjustmentReason;
          result.updated_by = req.userData._id;
          result.updated_at = new Date();
          result.delivered_by = req.userData._id,
            result.amt_received = req.body.paid_amount,
            result.save();
          resolve();
        }
      }
      else {
        reject();
      }
    })
  })
}

const updatePaymentDetails = (req) => {
  return new Promise((resolve, reject) => {
    Paymentdetails.findOne({ customer: req.body.customer_id }, function (error, result) {
      if (req.body.payment_mode_delivery == 'Credit') {
        resolve();
      }
      else {
        result.advance = req.body.pd_advance,
          result.due_amt = req.body.pd_due_amt,
          result.updated_by = req.userData._id,
          result.save();
        resolve();
      }
    })
  })
}

// const updateOrder = (orderid, req) => {
//   return new Promise((resolve, reject) => {
//     Order.findOne({ order_id: orderid }, function (error, result) {
//       result.order_status = "Delivered";
//       result.delivered_at = new Date();
//       result.save();
//       resolve(result);
//     })
//   })
// }

ordertransactionRouter
  .route('/amountperday')
  .get(checkAuth, function (req, res) {
    // {'invoices.$.order.0.deliveryassign_to':"5b46e8ec93f9ac002012e609"}
    Invoice.find()
      .populate(' customer ordertransaction order')
      .then((data) => {
        var newdata = data.filter(element => element.ordertransaction.delivered_by == req.userData._id);

        // var data = newdata.filter(element => element.ordertransaction.payment_mode_delivery == "Cash")
        var data1 = newdata.filter(element => Date.parse(new Date(element.order.delivered_at).toDateString()) == Date.parse(new Date().toDateString()));
        var cashamount = 0; var paytmamount = 0;
        var cardamount = 0; var bank_chequeamount = 0;
        var amount = [];
        data1.forEach(element => {
          if (element.ordertransaction.payment_mode_delivery == "Cash") {
            cashamount += parseFloat(element.ordertransaction.paid_amt)
          }
          if (element.ordertransaction.payment_mode_delivery == "Paytm") {
            paytmamount += parseFloat(element.ordertransaction.paid_amt)
          }
          if (element.ordertransaction.payment_mode_delivery == "Card") {
            cardamount += parseFloat(element.ordertransaction.paid_amt)
          }
          if (element.ordertransaction.payment_mode_delivery == "Cheque/Bank") {
            bank_chequeamount += parseFloat(element.ordertransaction.paid_amt)
          }
        })
        amount.push({ cashamount, paytmamount, cardamount, bank_chequeamount })
        res.status(200).json({ Success: true, "amount": amount });
      }).catch(err => {
        res.status(400).json(err);
      })
  })

// ordertransactionRouter
//   .route('/paytmperday')
//   .get(checkAuth, function (req, res) {
//     // {'invoices.$.order.0.deliveryassign_to':"5b46e8ec93f9ac002012e609"}
//     Invoice.find()
//       .populate(' customer ordertransaction order')
//       .then((data) => {
//         // console.log(req.userData._id)
//         var newdata = data.filter(element => element.order.deliveryassign_to == req.userData._id);

//         var data = newdata.filter(element => element.ordertransaction.payment_mode_delivery == "Paytm")
//         var data1 = data.filter(element => Date.parse(new Date(element.order.delivered_at).toDateString()) == Date.parse(new Date().toDateString()));
//         var amount = 0;
//         data1.forEach(element => {
//           amount += parseFloat(element.ordertransaction.paid_amt)
//         });
//         res.status(200).json({ Success: true, "paytmperday": amount });
//       }).catch(err => {
//         res.status(400).json(err);
//       })
//   })

ordertransactionRouter
  .route('/monthlydata')
  .get(checkAuth, function (req, res) {
    Invoice.find()
      .populate(' customer ordertransaction order')
      .then((data) => {
        var currentDate = new Date();
        const getCurrentMonthFirstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const getCurrentMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        var newdata = data.filter(element => element.ordertransaction.delivered_by == req.userData._id);
        // console.log('/////////////////', Date.parse(getCurrentMonthFirstDay));
        // console.log('/////////////////', Date.parse(getCurrentMonthLastDay));
        var data1 = newdata.filter(element => Date.parse(new Date(element.order.delivered_at).toDateString()) >= Date.parse(getCurrentMonthFirstDay.toDateString()) && Date.parse(new Date(element.order.delivered_at).toDateString()) <= Date.parse(getCurrentMonthLastDay.toDateString()));

        var monthlydata = [];

        Paymentdetail.find().populate("customer").then((data) => {
          data1.forEach((element) => {

            // var onlyInB = data.filter(comparer(data1));
            // console.log('******************************************');
            // console.log(onlyInB);
            // console.log('*******************************************');
            // onlyInB.forEach(element1 => {

            // let filterData = data.filter(item => data1.some(other => console.log(item.customer._id == other.customer._id)));

            // const filterData = data1.filter(item => !data.some(other => item.customer._id == other.customer));
            // console.log('////////////', filterData);
            date = element.order.delivered_at;
            delivered_at = JSON.stringify(date).slice(1, 11);
            const monthlydataObject = {
              orderid: element.order.order_id,
              Customername: element.customer.first_Name,
              amountpaid: element.ordertransaction.paid_amt,
              delivered_at: delivered_at,
              credit_amt: element.ordertransaction.credit_amt
            }
            monthlydata.push(monthlydataObject);
            // });
          });
          res.status(200).json({ Success: true, monthlydata });
        });
      })
  })

// function comparer(otherArray) {
//   return function (current) {
//     return otherArray.filter(function (other) {
//       return other.customer._id !== current.customer._id && other.customer.email !== current.customer.email
//     }).length == 0;
//   }
// }

module.exports = ordertransactionRouter;