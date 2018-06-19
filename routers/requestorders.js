var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var { RequestOrder } = require('./../models/requestorder');
var { OrderStatus } = require('./../models/orderstatus');
var Customer = require('./../models/customer');
var Franchise = require('./../models/franchise');
var area = require('./../models/area');
var generateSms = require('./../middlewear/sms');

var requestordersRouter = express.Router();

requestordersRouter

    //Create Request Order //Customer will create
    .post('/requestorder', passport.authenticate('jwt', { session: false }), (req, res) => {

        if (!req.body) {
            res.status(200).json({ Success: false, Message: 'Please Enter Required Data.' });
        } else {
            var token = req.header('Authorization').split(' ');
            var decoded = jwt.verify(token[1], config.secret);
            var name; var mobile;
            
            Customer.findById({ '_id': decoded._id }).then((customer) => {
                if (req.body.locationType == "Home") {
                    req.body.locationType = customer.address[0].home[0]._id;
                }
                else if (req.body.locationType == "Other") {
                    req.body.locationType = customer.address[0].other[0]._id;
                    console.log(req.body);
                }
                name = customer.first_Name,
                    mobile = customer.mobile

                var counter;
                var orderid;
                var areacode;
                Franchise.find({ statee: true, area: req.body.area }).
                    populate('area').
                    exec(function (err, franchises) {
                        if (err) {
                            res.status(500).send({ Success: flase, err });
                            return;
                        }
                        // console.log('The Franchise  is', franchises);
                        franchisename = franchises[0].franchise_Name;
                        areacode = franchises[0].area.code;
                        RequestOrder.find({ franchise: franchises[0]._id }).exec(function (err, results) {
                            var count = results.length;
                            counter = count + 1;
                            var str = "" + counter;
                            var pad = "0000";
                            var ans = pad.substring(0, pad.length - str.length) + str;
                            requestId = areacode + ans;

                            req.body.franchise = franchises[0]._id;
                            req.body.requestId = requestId;
                            req.body.customer = name;
                            req.body.created_by = decoded._id;
                            req.body.updated_by = decoded._id;
                            req.body.state = true;
                            req.body.status = true;

                            var date = new Date(req.body.pickupDate);
                            var newDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));

                            req.body.pickupDate = newDate;
                            var requestOrder = new RequestOrder(req.body);
                            requestOrder.save().then((order) => {
                                var requestId = order.requestId;

                                var date = new Date(order.pickupDate);
                                var d = date + '';
                                var dateParts = d.split("GMT");
                                var date1 = dateParts[0].slice(0, 15);

                                generateSms(mobile,
                                    `Dear ${name}, Your Pick up no ${requestId} with ${franchisename} is booked for ${date1} between ${order.timeSlot}.`
                                )
                                res.status(200).json({ requestId, Success: true, Message: 'Order Placed Successfully' });
                            }, (err) => {
                                res.status(400).json(err);
                            })
                        });
                    });
            })
        }

    })

    // All Request Order
    .get('/requestorders/:franchise', passport.authenticate('jwt', { session: false }), (req, res) => {
        RequestOrder.find({ 'franchise': req.params.franchise, 'state': true, 'status': true }).then((order) => {
            res.status(200).json({ order, Success: true });
        }, (err) => {
            res.status(400).json(err);
        })
    })

    .get('/requestorder/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        RequestOrder.findOne({ 'requestId': req.params.id }).then((order) => {
            if (!order) {
                res.status(200).json({ Success: false, Message: "Order Not Found" });
            }
            res.status(200).json({ Success: true, order });
        }).catch((err) => {
            res.status(400).json(err);
        });

    })
    .put('/updaterequestorder/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        var requestId = req.params.id;
        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);
        if(req.body.pickupDate){
        var date = new Date(req.body.pickupDate);
        var newDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
        req.body.pickupDate = newDate;
        }
        Customer.findById({ '_id': decoded._id }).then((customer) => {
            if (req.body.locationType == "Home") {
                req.body.locationType = customer.address[0].home[0]._id;
            }
            else if (req.body.locationType == "Other") {
                req.body.locationType = customer.address[0].other[0]._id;
            }
            RequestOrder.findOneAndUpdate({ 'requestId': requestId }, {
                $set: req.body
            }, { new: true }).then((requestorder) => {
                if (!requestorder) {
                    res.status(200).json({ Success: false, Message: 'No Such Order Found' });
                }
                res.status(200).json({ Success: true, Message: 'Order Updated Successfully' });
            }).catch((err) => {
                res.status(400).json(err);
            })
        })
    })

    // Cancelation of requestorder 
    .put('/cancelorder/:id', (req, res) => {
        RequestOrder.findOneAndUpdate({ 'requestId': req.params.id }, {
            $set: { state: false }
        }).then((order) => {
            res.status(200).json({ Success: true, Message: "Order Cancelled" });
        }).catch((err) => {
            res.status(400).json(err);
        });
    })

module.exports = { requestordersRouter }
