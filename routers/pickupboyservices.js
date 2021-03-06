var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var OrderStatus = require('./../models/orderstatus');
var Order = require('./../models/order');
var RequestOrder = require('./../models/requestorder');
var area = require('./../models/area');
var Franchise = require('./../models/franchise');
var generateSms = require('./../middlewear/sms');
var generateMail = require('./../middlewear/mail');
var Customer = require('./../models/customer');
var order_type = require('./../models/ordertype');
var checkAuth = require('../middlewear/check-auth');
var DailyCollection = require('./../models/dailycollection');
var Ordertransaction = require('../models/ordertransaction');
var Unpickupreason = require('./../models/unpickupreason');
var Undeliveryreason = require('./../models/undeliveryreason');
var Coupon = require('./../models/coupon');
var serviceType = require('./../models/servicetype');
var pickupboyserviceRouter = express.Router();

pickupboyserviceRouter

    //pickup boy GET the request which are assign to him for pickup
    .get('/mrequestorder', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);
        RequestOrder.find({
            'pickupdelivery': decoded._id,
            "request_status": 'Ready To Pickup',
            'state': true,
            'status': true
        })
            .populate('customer timeSlot')
            .then((orders) => {
                if (!orders[0]) {
                    res.status(200).json({ Success: true, Message: "No Orders" });

                } else {
                    // var neworders=[];
                    // orders.forEach(element =>{            
                    //     Customer.find({'_id':element.customer._id}).then((data)=>{
                    //         // console.log('===================',data[0].address[0].other[0]._id,'//',element.locationType);

                    //         // orders:{pickupaddress:""};
                    //         if(JSON.stringify(data[0].address[0].other[0]._id) == JSON.stringify(element.locationType)){
                    //             const order1 = data[0].address[0].other.filter(element1 => element1);
                    //             // var order11=element + ',other:'+ order1 ; 

                    //             element.pickupaddress=order1[0].pincode;
                    //             console.log('=======================================',element);
                    //             // neworders.push({order11});
                    //         }

                    //     })
                    // })
                    // console.log('=======================================',neworders);
                    res.status(200).json({ Success: true, orders });
                }

            }).catch((err) => {
                res.status(400).json({ err });
            })
    })
    // Request order which is unpicked
    .post('/unpickedorder', passport.authenticate('jwt', { session: false }), (req, res) => {

        Unpickupreason.findOne({ 'reason_name': req.body.unpick_reason }).then(reason => {

            RequestOrder.findOneAndUpdate({ 'requestId': req.body.requestId }, {
                $set: {
                    unpick_reason: reason._id,
                    request_status: "unpicked",
                    unpicked_at: new Date()
                }
            }).populate('customer')
                .then((requestOrder) => {
                    var name = requestOrder.customer.first_Name;
                    var email = requestOrder.customer.email;
                    var mobile = requestOrder.customer.mobile;

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

               <tr>We attempted to complete your request for ${requestOrder.requestId} , however it was unsuccessful due to ${req.body.unpick_reason}.</tr>
                                                   
               <tr><b>Thanks,</b></tr>
                                                                                       
                <tr><b>Team 24Klen Laundry Science</b></tr>
                </table>
           </body>
           </html>`,
                        `Missed the Pickup with 24klen Laundry Science`
                    );
                    generateSms(mobile,
                        `Dear ${name}, We attempted to complete your request for ${req.body.requestId} , however it was unsuccessful.`
                    ).catch((err) => {
                        res.status(400).json(err);
                    })
                    res.status(200).json({ Success: true, Message: "Order unpicked" });
                })
        }).catch((err) => {
            res.status(400).json({ err });
        })
    })

    // RequestOrder created into partial order
    .post('/createorder', passport.authenticate('jwt', { session: false }), (req, res) => {
        RequestOrder.findOne({ 'requestId': req.body.requestId })
            .populate({ path: 'franchise', populate: { path: 'area' } })
            .populate('customer')
            .then((data) => {
                if (!data) {
                    res.status(200).json({ Success: false, Message: 'Order Not Found!' });
                }
                var home = data.address[0].home[0];
                // var other = data.address[0].other[0];
                var requestId = data._id;
                var name = data.customer.first_Name;
                var email = data.customer.email;
                var mobile = data.customer.mobile;

                var store_code = data.franchise.store_code;

                order_type.findOne({ 'order_type': "on-line" }).then((ordertype) => {
                    Order.find({ 'franchise': data.franchise._id }).then((results) => {
                        var count = results.length;
                        counter = count + 1;
                        var str = "" + counter;
                        var pad = "0000";
                        var ans = pad.substring(0, pad.length - str.length) + str;
                        var id = store_code + ans;

                        var order = new Order();
                        order.order_id = id;
                        order.requestId = requestId;
                        order.order_amount = 00;
                        order.order_status = 'picked up';
                        order.franchise = data.franchise._id;
                        order.customer = data.customer;
                        order.servicetype = data.servicetype;
                        order.total_qty = req.body.total_qty;
                        order.pickupdelivery = null;
                        order.paymentstatus = 'unpaid';
                        order.ordertype = ordertype._id;
                        order.address.push({ home });
                        order.registration_source = "Mobile";
                        order.coupon = data.coupon ? data.coupon : null;
                        // , other
                        // order.created_by = order.created_by;
                        // order.updated_by = order.updated_by;
                        order.state = true;
                        order.status = true;

                        order.save().then((data) => {

                            RequestOrder.findOneAndUpdate({ 'requestId': req.body.requestId }, {
                                $set: {
                                    status: false,
                                    request_status: "picked up",
                                    picked_at: new Date()
                                }
                            }).then((order));
                            generateSms(mobile,
                                `Dear ${name},Your Pickup ${id} with Qty ${data.total_qty} garments was successful. You will be receiving final bill soon.`
                            ).catch(err => {
                                console.log(err);
                            })
                            res.status(200).json({ Success: true, Message: 'Order Placed SuccessFully' })
                        })
                    })
                })
            }).catch((err) => {
                res.status(400).json({ err });
            })
    })

    // Get all Unpickedorders franchise wise
    // .get('/unpickedorders/:franchise', passport.authenticate('jwt', { session: false }), (req, res) => {

    //     RequestOrder.find({ request_status: "Order UnPicked" }).then((unpickedorders) => {
    //         if (!unpickedorders[0]) {
    //             res.status(200).json({ Success: true, Message: "NO Unpickedorders" });
    //         } else {
    //             res.status(200).json({ Success: true, unpickedorders });
    //         }
    //     })
    // })

    // Get all Undeliverdeorders franchise wise
    // .get('/undeliveredorders/:franchise', passport.authenticate('jwt', { session: false }), (req, res) => {

    //     UndeliveredOrder.find({ 'franchise': req.params.franchise }).then((unpickorders) => {
    //         res.status(200).json(unpickorders);
    //     }, (error) => {
    //         res.status(400).json(err);
    //     })
    // })


    //Delivery boy GET the orders which are assign to him for Delivery
    .get('/morder', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);
        Order.find({
            'deliveryassign_to': decoded._id,
            "order_status": 'Ready for Delivery',
            'state': true,
            'status': true
        }).populate('customer')
            .then((orders) => {

                if (!orders[0]) {
                    res.status(200).json({ Success: true, Message: "No Orders" });
                } else {
                    res.status(200).json({ Success: true, orders });
                }
            }).catch((err) => {
                res.status(400).json({ err });
            })
    })

    // ready order which is Undelivered
    .post('/undeliveredorder', passport.authenticate('jwt', { session: false }), (req, res) => {
        console.log(req.body.undelivery_reason);

        Undeliveryreason.findOne({ 'reason_name': req.body.undelivery_reason }).then(reason => {
            console.log(reason);
            Order.findOneAndUpdate({ 'order_id': req.body.order_id }, {
                $set: {
                    undelivery_reason: reason._id,
                    order_status: "undelivered",
                    undelivered_at: new Date()
                }
            }).populate('customer')
                .then((order) => {
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

                        <tr>We attempted to complete your request for ${order.order_id} , however it was unsuccessful due to ${req.body.undelivery_reason}.</tr>
                                                            
                        <tr><b>Thanks,</b></tr>
                                                                                                
                        <tr><b>Team 24Klen Laundry Science</b></tr>
                    </table>
                    </body>
                    </html>`,
                        `Missed the Pickup/Delivery with 24klen Laundry Science`
                    );
                    generateSms(mobile,
                        `Dear ${name}, We attempted to complete your request for ${order.order_id} , however it was unsuccessful.`
                    ).catch((err) => {
                        res.status(400).json(err);
                    })
                    res.status(200).json({ Success: true, Message: "Order UnDelivered" });
                })
        }).catch((err) => {
            res.status(400).json({ err });
        })
    })

    // ready order which is Delivered
    .post('/orderdelivered', checkAuth, (req, res) => {
        Order.findOneAndUpdate({ 'order_id': req.body.order_id }, {
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
                    Ordertransaction.findOne({ 'order_id': req.body.order_id }).then((result) => {
                        result.delivered_by = req.userData._id
                        result.updated_by = req.userData._id;
                        result.save();
                    })
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

                            <tr>Your Order ${req.body.order_id} of amount Rs ${amount}, consisting of ${total_qty} garments is delivered.</tr>
                        
                            <tr><b>Thanks,</b></tr>
                                                                                                    
                            <tr><b>Team 24Klen Laundry Science</b></tr>
                        </table>
                        </body>
                        </html>`,
                        `Successful Order Delivery ${req.body.order_id} with 24klen Laundry Science`
                    );
                    generateSms(mobile,
                        `Dear ${name} Your Order ${req.body.order_id} of amount Rs ${amount}, consisting of ${total_qty} garments is delivered.Thank you`
                    )
                    res.status(200).json({ Success: true, Message: "Order Delivered" });
                }
            }).catch((err) => {
                res.status(400).json({ err });
            })
    })

    .post('/neworder', checkAuth, (req, res) => {

        Customer.findOne({ '_id': req.body._id })
            // .populate({ path: 'franchise', populate: { path: 'area' } })
            .populate('franchise , area')
            .then((data) => {
                if (!data) {
                    res.status(200).json({ Success: false, Message: 'Order Not Placed!' });
                }
                var home = data.address[0].home[0];
                // var other = data.address[0].other[0];
                var name = data.first_Name;
                var email = data.email;
                var mobile = data.mobile;
                var store_code = data.franchise.store_code;
                order_type.findOne({ 'order_type': "on-line" }).then((ordertype) => {
                    serviceType.findOne({ 'type': req.body.servicetype }).then((servicetype) => {
                        Order.find({ 'franchise': data.franchise._id }).then((results) => {
                            var count = results.length;
                            counter = count + 1;
                            var str = "" + counter;
                            var pad = "0000";
                            var ans = pad.substring(0, pad.length - str.length) + str;
                            var id = store_code + ans;

                            var order = new Order();
                            order.order_id = id;
                            order.order_amount = 00;
                            order.order_status = 'picked up';
                            order.franchise = data.franchise._id;
                            order.customer = data._id;
                            order.servicetype = servicetype._id;
                            order.total_qty = req.body.total_qty;
                            order.pickupdelivery = null;
                            order.paymentstatus = 'unpaid';
                            order.ordertype = ordertype._id;
                            order.address.push({ home });
                            order.registration_source = "Mobile";
                            // order.coupon = data.coupon ? data.coupon : null;
                            // , other
                            // order.created_by = order.created_by;
                            // order.updated_by = order.updated_by;
                            order.state = true;
                            order.status = true;

                            order.save().then((data) => {
                                generateSms(mobile,
                                    `Dear ${name},Your Pickup ${id} with Qty ${data.total_qty} garments was successful. You will be receiving final bill soon.`
                                ).catch(err => {
                                    console.log(err);
                                })
                                res.status(200).json({ Success: true, Message: 'Order Placed SuccessFully' })
                            })
                        })
                    })
                })
            }).catch((err) => {
                console.log(err)
                res.status(400).json({ err });
            })
    })

    .post('/dailycollection', checkAuth, (req, res) => {
        var dailyCollection = new DailyCollection();
        dailyCollection.amount_submitted_cash = req.body.amount_submitted_cash;
        dailyCollection.amount_by_paytm = req.body.amount_by_paytm;
        dailyCollection.amount_by_card = req.body.amount_by_card;
        dailyCollection.amount_by_cheque_bank = req.body.amount_by_cheque_bank;
        dailyCollection.submitted_to = req.body.submitted_to;
        dailyCollection.submitted_by = req.userData._id;
        dailyCollection.submitted_at = new Date();

        dailyCollection.save().then((data) => {
            res.status(200).json({ Success: true, Message: "Submitted To Store" });
        })
    })


module.exports = { pickupboyserviceRouter }