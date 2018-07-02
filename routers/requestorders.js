var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var RequestOrder = require('./../models/requestorder');
var OrderStatus = require('./../models/orderstatus');
var Customer = require('./../models/customer');
var Franchise = require('./../models/franchise');
var area = require('./../models/area');
var generateSms = require('./../middlewear/sms');
var serviceType = require('./../models/servicetype');
const checkAuth = require('../middlewear/check-auth');
var requestordersRouter = express.Router();
var sendmail = require('./../middlewear/mail');
var generateSms = require('./../middlewear/sms');


 //Create Request On Call
requestordersRouter
    .route('/requestorder1')
    .post(checkAuth, (req, res) => {
        if (!req.body) {
            res.status(200).json({ Success: false, Message: 'Please Enter Required Data.' });
        }
        else {
            var requestid;
            var storecode;
            Franchise.find({ _id: req.userData.franchise }).
                exec(function (err, franchises) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    console.log('The Franchise  is', req.userData.franchise);
                    console.log('The Franchise  is', franchises[0].store_code);
                    console.log(" req.userData.franchise ", req.userData.franchise);
                    storecode = franchises[0].store_code;
                    RequestOrder.find({ franchise: req.userData.franchise }).exec(function (err, results) {
                        console.log("err", err);
                        console.log("results", results);
                        var count = results.length;
                        counter = count + 1;
                        var str = "" + counter;
                        var pad = "0000";
                        var ans = pad.substring(0, pad.length - str.length) + str;
                        requestid = storecode + ans;
                        console.log("requestid", requestid)
                        savedata(requestid);
                    })
                });
        }
        function savedata(requestid) {
            var requestOrder = new RequestOrder({
                requestId: requestid,
                locationType: req.body.locationType,
                customer: req.body.customerId,
                pickupdelivery: null,
                servicetype: req.body.serviceType,
                pickupDate: req.body.pickupDate,
                timeSlot: req.body.timeSlot,
                franchise: req.body.franchise,
                created_by: req.userData._id,
                updated_by: req.userData._id,
                request_status: "Request Received",
                status: true,
                state: true
            });
            requestOrder.save(function (err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ success: true, msg: 'Request created successfully!' });
                Customer.findOne({ _id: req.body.customerId})
                .populate(' franchise').
                 exec(function (err, res) {
                    console.log("customer data============",res);
                    var customername = res.first_Name;
                    var mobile = res.mobile;
                    var store = res.franchise.franchise_Name;
                    generateSms(mobile,
                      `Dear ${customername}, Your Pick up no ${requestid} with ${store} is booked for ${ req.body.pickupDate} between ${req.body.timeSlot}.`
                  );
                  });
            });
        }
    })
    .get(checkAuth, function (req, res) {
        if (req.userData.role.indexOf("admin") > -1) {
            RequestOrder.
                find().sort({ requestId: 'ascending' }).
                populate('customer servicetype franchise timeSlot created_by').
                exec(function (err, requests) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    res.json(requests);
                });
        }
        else {
            RequestOrder.
                find({ created_by: req.userData._id }).sort({ requestId: 'ascending' }).
                populate('customer servicetype franchise timeSlot ').
                exec(function (err, requests) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    res.json(requests);
                });
        }
    })
//Assign Pickup boy
requestordersRouter
    .route('/assignpickuprequest/:requestId')
    .put(checkAuth, function (req, res) {
        var requestId = req.params.requestId;
        RequestOrder.findOne({ _id: requestId }, function (err, requests) {
            var myDateString = Date();
            if (requests) {
                requests.pickupdelivery = req.body.pickupboyid,
                    requests.request_status = "Ready To Pickup",

                    requests.save();
                res.json({requestdata:requests,  success: true, msg: 'Pickup Boy assigned successfully' });
                return;
            }
            if (err) {
                res.status(500).send(err);
                return;
            }
        });
    })
module.exports = requestordersRouter;
