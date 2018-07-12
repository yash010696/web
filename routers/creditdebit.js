var express = require('express');
var localStorage = require('localStorage');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var creditdebitRouter = express.Router();
var Ordertransaction = require('../models/ordertransaction');
var Customer = require('./../models/customer');
var { CreditDebit } = require('./../models/creditdebit');
var Paymentdetail=require('./../models/paymentdetail');

creditdebitRouter

    .post('/creditdebit', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);

        if (req.body.billAmount == req.body.paidAmount) {
            CreditDebit.find({ 'created_by': decoded._id }).then((customer) => {

                if (!customer[0]) {
                    var creditDebit = new CreditDebit();
                    creditDebit.created_by = decoded._id;
                    creditDebit.updated_by = decoded._id;

                    creditDebit.save().then((data) => {
                        console.log(data)
                        res.json(data[0]);
                    })
                }
                else {
                    res.json(customer[0]);
                }
            }).catch((err) => {
                res.json(err);
            })
        }
        else if (req.body.billAmount > req.body.paidAmount) {
            var pendingAmount = req.body.billAmount - req.body.paidAmount;
            CreditDebit.find({ 'created_by': decoded._id }).then((customer) => {

                if (!customer[0]) {
                    var creditDebit = new CreditDebit();
                    creditDebit.pendingAmount = pendingAmount;
                    creditDebit.created_by = decoded._id;
                    creditDebit.updated_by = decoded._id;
                    creditDebit.save().then((data) => {
                        res.json(data);
                    })
                }
                else {
                    CreditDebit.findOne({ 'created_by': decoded._id }).then((customer) => {

                        NewpendingAmount = customer.pendingAmount + pendingAmount;
                        if (NewpendingAmount > customer.balanceAmount) {

                            pendingAmount1 = NewpendingAmount - customer.balanceAmount;

                            CreditDebit.findOneAndUpdate({ 'created_by': decoded._id }, {
                                $set: {
                                    balanceAmount: 0,
                                    pendingAmount: pendingAmount1
                                }
                            }, { new: true }).then((customer) => {
                                res.json(customer);
                            })
                        } else { //(NewpendingAmount < customer.balanceAmount)

                            NewbalanceAmount = customer.balanceAmount - NewpendingAmount;

                            CreditDebit.findOneAndUpdate({ 'created_by': decoded._id }, {
                                $set: {
                                    pendingAmount: 0,
                                    balanceAmount: NewbalanceAmount
                                }
                            }, { new: true }).then((customer) => {
                                res.json(customer);
                            })
                        }
                    })
                }
            }).catch((err) => {
                res.json(err);
            })
        }
        else if (req.body.billAmount < req.body.paidAmount) {
            var balanceAmount = req.body.paidAmount - req.body.billAmount;
            CreditDebit.find({ 'created_by': decoded._id }).then((customer) => {

                if (!customer[0]) {
                    var creditDebit = new CreditDebit();
                    creditDebit.balanceAmount = balanceAmount;
                    creditDebit.created_by = decoded._id;
                    creditDebit.updated_by = decoded._id;

                    creditDebit.save().then((data) => {
                        res.json(data);
                    })
                }
                else {
                    CreditDebit.findOne({ 'created_by': decoded._id }).then((customer) => {

                        NewbalanceAmount = customer.balanceAmount + balanceAmount;
                        if (NewbalanceAmount > customer.pendingAmount) {
                            balanceAmount1 = NewbalanceAmount - customer.pendingAmount;
                            CreditDebit.findOneAndUpdate({ 'created_by': decoded._id }, {
                                $set: {
                                    balanceAmount: balanceAmount1,
                                    pendingAmount: 0
                                }
                            }, { new: true }).then((customer) => {
                                res.json(customer);
                            })

                        } else {  // (balanceAmount < customer.pendingAmount)
                            NewpendingAmount = customer.pendingAmount - NewbalanceAmount;
                            CreditDebit.findOneAndUpdate({ 'created_by': decoded._id }, {
                                $set: {
                                    pendingAmount: NewpendingAmount,
                                    balanceAmount: 0
                                }
                            }, { new: true }).then((customer) => {
                                res.json(customer);
                            })
                        }
                    })
                }
            }).catch((err) => {
                res.json(err);
            })
        }
    })

    .get('/creditdebitamount', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);
        Paymentdetail.find({ 'customer': decoded._id }).then((customer) => {
            if (!customer[0]) {
                res.status(200).json({Success:true,due_amt:0,advance:0});
            } else {
                due_amt = customer[0].due_amt;
                advance = customer[0].advance;

                res.status(200).json({ Success: true, due_amt, advance });
                
            }
        }, (err) => {
            res.status(400).json({ Success: false, err });
        })

    })



module.exports = { creditdebitRouter };