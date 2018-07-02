var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Order = require('../models/order');
var Ordertransaction = require('../models/ordertransaction');
var Invoice = require('../models/invoice');
var Verifytoken = require('./loginadmin');
var Customer = require('../models/customer');
var Franchise = require('../models/franchise');

var invoiceRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');

//Create router for fetching All invoices.
invoiceRouter
    .route('/invoice')
    .get(checkAuth, function(req, res) {
        if (req.userData.role == "admin") {
            Invoice.
            find().
            sort({ date: 'descending' }).
            populate('order customer franchise ordertransaction tag created_by').
            exec(function(err, invoices) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                console.log('The Price  is %s', invoices);
                res.json(invoices);
            });
        } else {
            Invoice.
            find({ franchise: req.userData.franchise }).
            sort({ date: 'descending' }).
            populate('order customer franchise ordertransaction tag created_by').
            exec(function(err, invoices) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                console.log('The Price  is %s', invoices);
                res.json(invoices);
            });
        }
    });
invoiceRouter
    .route('/invoices/:invoiceId')
    .get(checkAuth, function(req, res) {
        const invoiceId = req.params.invoiceId;
        if (req.userData.role == "admin") {
            Invoice.
            find({ _id: invoiceId }).
            populate('ordertransaction customer franchise tag created_by').
            exec(function(err, invoice) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                console.log('The Price  is %s', invoice);
                res.json(invoice);
            });
        } else {
            Invoice.
            find({ _id: invoiceId })
                .populate('ordertransaction customer franchise tag created_by')
                .exec(function(err, invoice) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    console.log(invoice);
                    res.json(invoice);
                });
        }
    });

invoiceRouter
    .route('/view-orders/:orderId')
    .get(checkAuth, (req, res) => {
        const orderId = req.params.orderId;
        Invoice.
        find({ order: orderId }).
        populate('ordertransaction customer franchise tag order').
        exec(function(err, order) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(order);
        });
    })
module.exports = invoiceRouter;