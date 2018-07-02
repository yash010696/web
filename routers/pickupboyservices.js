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
            .populate('customer servicetype')
            .then((orders) => {
                if (!orders[0]) {
                    res.status(200).json({ Success: true, Message: "No Orders" });
                } else {

                    Customer.find({ '_id': orders[0].customer._id }).then((data) => {
                        data[0].address.forEach(element => {                            
                            if (JSON.stringify(element.other[0]._id) == JSON.stringify(orders[0].locationType)) {
                                const order1 = element.other.filter(element =>element );     
                                console.log(order1);
                        res.status(200).json({ Success: true, orders  });
                                
                            } else {}
                        // console.log(orders[0].locationType);
                        // const order1 = data[0].address.filter(element => console.log(JSON.stringify(element.other[0]._id) == JSON.stringify(orders[0].locationType)) ||  JSON.stringify(element.home[0]._id) == JSON.stringify(orders[0].locationType));
                        // console.log(order1)
                        // if (order1) {
                        //     // console.log(JSON.stringify(data, undefined, 2));
                        // }
                    })
                })
                    // res.status(200).json({ Success: true, orders  });
                }
            }).catch((err) => {
                res.status(400).json({ err });
            })
    })
    // Request order which is unpicked
    .post('/unpickedorder', passport.authenticate('jwt', { session: false }), (req, res) => {

        RequestOrder.findOneAndUpdate({ 'requestId': req.body.requestId }, {
            $set: {
                status: false,
                request_status: "Order UnPicked",
                message: req.body.message
            }
        }).populate('customer')
            .then((requestOrder) => {
                var name = requestOrder.customer.first_Name;
                var email = requestOrder.customer.email;
                var mobile = requestOrder.customer.mobile;
                // console.log('===', name, email, mobile, req.body.requestId);

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

               <tr>We attempted to complete your request for ${requestOrder.requestId} , however it was unsuccessful due to ${req.body.message}.</tr><br><br>
           
               <tr>Happy Cleaning!</tr><br><br>
                                                   
               <tr>Thanks,</tr><br><br>
                                                           
                <tr>Team 24Klen Laundry Science</tr>
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
                var name = data.customer.first_Name;
                var email = data.customer.email;
                var mobile = data.customer.mobile;

                var store_code = data.franchise.store_code;
                Order.find({ 'franchise': data.franchise._id }).then((results) => {
                    var count = results.length;
                    counter = count + 1;
                    var str = "" + counter;
                    var pad = "0000";
                    var ans = pad.substring(0, pad.length - str.length) + str;
                    var id = store_code + ans;

                    var order = new Order();
                    order.order_id = id;
                    order.requestId = data.requestId;
                    order.order_amount = 00;
                    order.order_status = "Picked-up";
                    order.franchise = data.franchise._id;
                    order.customer = data.customer;
                    order.servicetype = data.servicetype;
                    order.total_qty = req.body.total_qty;
                    order.pickupdelivery = null;
                    // order.created_by = order.created_by;
                    // order.updated_by = order.updated_by;
                    order.status = data.status;
                    order.state = data.state;
                    order.save().then((data) => {
                        RequestOrder.findOneAndUpdate({ 'requestId': req.body.requestId }, {
                            $set: {
                                status: false,
                                request_status: "Picked-up"
                            }
                        }).then((order));
                        generateSms(mobile,
                            `Dear ${name},Your Pickup with Qty ${data.total_qty} garments was successful. You will be receiving final bill soon.`
                        )
                        res.status(200).json({ Success: true, Message: 'Order Placed SuccessFully' })
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
        Order.findOne({
            'pickupdelivery': decoded._id,
            "order_status": 'Ready For Delivery',
            'state': true,
            'status': true
        }).populate('customer')
            .then((orders) => {
                if (!orders) {
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

        Order.findOneAndUpdate({ 'order_id': req.body.order_id }, {
            $set: {
                status: false,
                order_status: "UnDelivered"
            }
        }).populate('customer')
            .then((order) => {
                var name = order.customer.first_Name;
                var email = order.customer.email;
                var mobile = order.customer.mobile;
                var amount = order.order_amount;
                var total_qty = order.total_qty;
                // console.log('===', name, amount,email,total_qty, mobile, req.body.order_id);    
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

               <tr>We attempted to complete your request for ${order.order_id} , however it was unsuccessful due to ${req.body.message}.</tr><br><br>
           
               <tr>Happy Cleaning!</tr><br><br>
                                                   
               <tr>Thanks,</tr><br><br>
                                                           
                <tr>Team 24Klen Laundry Science</tr>
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
            }).catch((err) => {
                res.status(400).json({ err });
            })

    })

    // ready order which is Delivered
    .post('/orderdelivered', passport.authenticate('jwt', { session: false }), (req, res) => {

        Order.findOneAndUpdate({ 'order_id': req.body.order_id }, {
            $set: {
                status: false,
                order_status: "Delivered"
            }
        }).populate('customer')
            .then((order) => {
                var name = order.customer.first_Name;
                var email = order.customer.email;
                var mobile = order.customer.mobile;
                var amount = order.order_amount;
                var total_qty = order.total_qty;
                // console.log('===', name, amount,email,total_qty, mobile, req.body.order_id);    
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

               <tr>Your Order ${req.body.order_id} of amount Rs ${amount}, consisting of ${total_qty} garments is delivered.</tr><br><br>
           
               <tr>Happy Cleaning!</tr><br><br>
                                                   
               <tr>Thanks,</tr><br><br>
                                                           
                <tr>Team 24Klen Laundry Science</tr>
           </body>
           </html>`,
                    `Successful Order Delivery ${req.body.order_id} with 24klen Laundry Science`
                );
                generateSms(mobile,
                    `Dear ${name} Your Order ${req.body.order_id} of amount Rs ${amount}, consisting of ${total_qty} garments is delivered.Thank you`
                ).catch((err) => {
                    res.status(400).json(err);
                })
                res.status(200).json({ Success: true, Message: "Order Delivered" });
            }).catch((err) => {
                res.status(400).json({ err });
            })
    })


module.exports = { pickupboyserviceRouter }
