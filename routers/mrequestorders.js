var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var Invoice = require('../models/invoice');
var Order = require('./../models/order');
var RequestOrder = require('./../models/requestorder');
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
                        var home = {
                            flat_no: customer.address[0].home[0].flat_no,
                            society: customer.address[0].home[0].society,
                            landmark: customer.address[0].home[0].landmark,
                            pincode: customer.address[0].home[0].pincode
                        }

                        req.body.locationType = customer.address[0].home[0]._id;
                    }
                }
                else if (req.body.locationType == "Other") {
                    if (customer.address[0].other[0] == null) {
                        res.status(200).json({ Success: false, Message: "Other Address Not Found" });
                    } else {
                        var other = {
                            flat_no: customer.address[0].other[0].flat_no,
                            society: customer.address[0].other[0].society,
                            landmark: customer.address[0].other[0].landmark,
                            pincode: customer.address[0].other[0].pincode,
                        }
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

                                    // console.log('=============', req.body);
                                    var requestOrder = new RequestOrder(req.body);
                                    if (home) {
                                        requestOrder.address.push({ home });
                                    } else {
                                        requestOrder.address.push({ other });
                                    }
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
                                           <table>
                                           <tr><b>Dear ${name},</b></tr>

                                           <tr>Your Pick up no ${requestId} with ${franchisename} is booked for ${date1} between ${data[0].time_Slot}.</tr>
                                                                               
                                           <tr>Thanks,</tr>
                                                                                       
                                            <tr>Team 24Klen Laundry Science</tr>
                                           </table>
                                              
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
                                // console.log(err);
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
                        var home = {
                            flat_no: customer.address[0].home[0].flat_no,
                            society: customer.address[0].home[0].society,
                            landmark: customer.address[0].home[0].landmark,
                            pincode: customer.address[0].home[0].pincode
                        }
                        // requestOrder.address.push({home});
                        var locationType = customer.address[0].home[0]._id;
                    }
                    else if (req.body.locationType == "Other") {
                        var other = {
                            flat_no: customer.address[0].other[0].flat_no,
                            society: customer.address[0].other[0].society,
                            landmark: customer.address[0].other[0].landmark,
                            pincode: customer.address[0].other[0].pincode,
                        }
                        var locationType = customer.address[0].other[0]._id;
                    }
                    RequestOrder.findOneAndUpdate({ 'requestId': requestId }, {
                        $set: {
                            locationType: locationType,
                            servicetype: req.body.servicetype,
                            pickupDate: req.body.pickupDate,
                            timeSlot: req.body.timeSlot,
                            'address': { other: other, home: home }
                        }
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

    .get('/morderdetail/:id', (req, res) => {
        // console.log(req.params.id);
        Order.find({ 'order_id': req.params.id })
            .then((data) => {
                var _id = data[0]._id;
                Invoice.find({ 'order': _id })
                    .populate('order customer  ordertransaction tag  ')
                    .populate({ path: 'order', populate: { path: 'requestId' } })
                    .populate({ path: 'order', populate: { path: 'requestId', populate: { path: 'timeSlot' } } })
                    .then((invoices) => {
                        var order_id;
                        var order_status;
                        var pickupDate;
                        var timeSlot;
                        var selectedsgstpercent;
                        var selectedcgstpercent;
                        var selectedgstpercent;
                        var sgst;
                        var cgst;
                        var gst;
                        var net_amount;
                        var first_Name;
                        var email;
                        var mobile;
                        var pickupAddress;
                        var deliveryDate;
                        var balance_due;
                        var advance;
                        var current_due;
                        var previous_due;
                        var orderList = [];

                        var data = {
                            order_id: invoices[0].order.order_id,
                            order_status: invoices[0].order.order_status,
                            pickupDate: invoices[0].order.requestId.pickupDate,
                            timeSlot: invoices[0].order.requestId.timeSlot.time_Slot,
                            selectedsgstpercent: invoices[0].ordertransaction.selectedsgstpercent,
                            selectedcgstpercent: invoices[0].ordertransaction.selectedcgstpercent,
                            // selectedgstpercent: (console.log(parseInt(selectedsgstpercent))+ parseInt(selectedcgstpercent)),
                            sgst: invoices[0].ordertransaction.sgst,
                            cgst: invoices[0].ordertransaction.cgst,
                            gst: invoices[0].ordertransaction.gst,
                            net_amount: invoices[0].ordertransaction.net_amount,
                            first_Name: invoices[0].customer.first_Name,
                            email: invoices[0].customer.email,
                            mobile: invoices[0].customer.mobile,
                            pickupAddress: invoices[0].order.requestId.address[0],
                            deliveryDate: invoices[0].order.due_date,
                            balance_due: invoices[0].ordertransaction.balance_due,
                            advance: invoices[0].ordertransaction.advance,
                            current_due: invoices[0].ordertransaction.current_due,
                            previous_due: invoices[0].ordertransaction.previous_due,
                            orderList
                        }

                        invoices[0].tag.tagDetailsService.forEach(services => {
                            services.subservice.forEach(subsevice => {
                                subsevice.garmentlist.forEach((garment, idx) => {
                                    garment.garmentTagDetails.forEach((tag, index) => {
                                        let tagsArray = JSON.parse(JSON.stringify((tag.tag_Format).split('|')));
                                        service = tagsArray[1];
                                        subservice = tag.subservice;
                                        dress = tagsArray[3];
                                        price = tag.price;
                                    });

                                    orderList.push({
                                        'service': service,
                                        'subservice': subservice,
                                        'dress': dress,
                                        'price': price,
                                    });
                                });
                            });
                        });
                        res.status(200).json({ Success: true, data });
                    }).catch((err) => {
                        res.status(400).json({ err });
                    })
            })
    })

module.exports = { mrequestordersRouter }
