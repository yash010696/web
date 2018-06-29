var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var RequestOrder = require('./../models/requestorder');
var { OrderStatus } = require('./../models/orderstatus');
var Customer = require('./../models/customer');
var Franchise = require('./../models/franchise');
var area = require('./../models/area');
var generateSms = require('./../middlewear/sms');
var generateMail = require('./../middlewear/mail');
var serviceType = require('./../models/servicetype');
var Timeslot = require('./../models/timeslot');


var mrequestordersRouter = express.Router();

mrequestordersRouter

    //Create Request Order //Customer will create
    .post('/requestorder', passport.authenticate('jwt', { session: false }), (req, res) => {

        if (!req.body) {
            res.status(200).json({ Success: false, Message: 'Please Enter Required Data.' });
        } else {
            var token = req.header('Authorization').split(' ');
            var decoded = jwt.verify(token[1], config.secret);
            var name; var mobile; var email;

            Customer.findById({ '_id': decoded._id }).then((customer) => {
                if (customer.address[0] == null) {
                    res.status(200).json({ Success: false, Message: "Enter The Address" });
                }
                if (req.body.locationType == "Home") {
                    if (customer.address[0].home[0] == null) {
                        res.status(200).json({ Success: false, Message: "Home Address Not Found" });
                    } else {
                        req.body.locationType = customer.address[0].home[0]._id;
                    }
                }
                else if (req.body.locationType == "Other") {
                    if (customer.address[0].other[0] == null) {
                        res.status(200).json({ Success: false, Message: "Other Address Not Found" });
                    } else {
                        req.body.locationType = customer.address[0].other[0]._id;
                    }
                }
                name = customer.first_Name;
                mobile = customer.mobile;
                email = customer.email;

                var counter; var orderid; var store_code;
                Franchise.find({ statee: true, area: { $in: [req.body.area] } }).
                    exec(function (err, franchises) {
                        if (err) {
                            res.status(500).send({ Success: flase, err });
                            return;
                        }
                        // console.log('The Franchise  is', franchises);
                        franchisename = franchises[0].franchise_Name;
                        store_code = franchises[0].store_code;

                        RequestOrder.find({ 'franchise': franchises[0]._id }).exec(function (err, results) {
                            var count = results.length;
                            counter = count + 1;
                            var str = "" + counter;
                            var pad = "0000";
                            var ans = pad.substring(0, pad.length - str.length) + str;
                            requestId = store_code + ans;

                            var date = new Date(req.body.pickupDate);
                            var newDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));

                            Timeslot.find({ 'time_Slot': req.body.timeSlot }).then((data) => {
                                req.body.timeSlot = data[0]._id;

                                serviceType.find({ 'type': req.body.servicetype }).then((servicetype) => {
                                    req.body.servicetype = servicetype[0]._id;
                                    req.body.franchise = franchises[0]._id;
                                    req.body.requestId = requestId;
                                    req.body.pickupDate = newDate;
                                    req.body.request_status = "Request Received";
                                    req.body.pickupdelivery = null;
                                    req.body.customer = decoded._id;
                                    // req.body.created_by = decoded._id;
                                    // req.body.updated_by = decoded._id;
                                    req.body.state = true;
                                    req.body.status = true;

                                    // console.log('=============',req.body);
                                    var requestOrder = new RequestOrder(req.body);
                                    requestOrder.save().then((order) => {
                                        var requestId = order.requestId;

                                        var date = new Date(order.pickupDate);
                                        var d = date + '';
                                        var dateParts = d.split("GMT");
                                        var date1 = dateParts[0].slice(0, 15);
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
                                               <tr><b>Dear ${name},</b></tr><br><br>

                                               <tr>Your Pick up no ${requestId} with ${franchisename} is booked for ${date1} between ${data[0].time_Slot}.</tr><br><br>
                                           
                                               <tr>Happy Cleaning!</tr><br><br>
                                                                                   
                                               <tr>Thanks,</tr><br><br>
                                                                                           
                                                <tr>Team 24Klen Laundry Science</tr>
                                           </body>
                                           </html>`,
                                            `Successful Request Creation ${requestId} with 24klen Laundry Science`
                                        );
                                        generateSms(mobile,
                                            `Dear ${name}, Your Pick up no ${requestId} with ${franchisename} is booked for ${date1} between ${data[0].time_Slot}.`
                                        )
                                        res.status(200).json({ requestId, Success: true, Message: 'Order Placed Successfully' });
                                    })
                                })
                            }).catch((err) => {
                                console.log(err);
                                res.status(400).json({ err });
                            })
                        })
                    })
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

        RequestOrder.findOne({ 'requestId': req.params.id })
            .populate('servicetype customer timeSlot')
            .then((order) => {
                if (!order) {
                    res.status(200).json({ Success: false, Message: "Order Not Found" });
                } else {
                    // Customer.find({'address.0.home.0._id':order.locationType}).then((data)=>{
                    //     order.locationType=data[0].address[0].home ;
                    //     console.log(order);
                    res.status(200).json({ Success: true, order });
                    // })
                }
            }).catch((err) => {
                res.status(400).json({ err });
            })
    })

    .put('/updaterequestorder/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        var requestId = req.params.id;
        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);
        if (req.body.pickupDate) {
            var date = new Date(req.body.pickupDate);
            var newDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
            req.body.pickupDate = newDate;
        }
        Timeslot.find({ 'time_Slot': req.body.timeSlot }).then((data) => {
            req.body.timeSlot = data[0]._id;
            serviceType.find({ 'type': req.body.servicetype }).then((servicetype) => {
                req.body.servicetype = servicetype[0]._id;

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
                        res.status(400).json({ err });
                    })
                })
            })
        })
    })

    // Cancelation of requestorder 
    .put('/cancelorder/:id', (req, res) => {
        RequestOrder.findOneAndUpdate({ 'requestId': req.params.id }, {
            $set: {
                state: false,
                request_status: "Order Cancelled"
            }
        }).then((order) => {
            res.status(200).json({ Success: true, Message: "Order Cancelled" });
        }).catch((err) => {
            res.status(400).json({ err });
        })
    })

module.exports = { mrequestordersRouter }
