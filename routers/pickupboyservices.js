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

var pickupboyserviceRouter = express.Router();

pickupboyserviceRouter
    // Request order which is unpicked
    .post('/unpickedorder', passport.authenticate('jwt', { session: false }), (req, res) => {

        RequestOrder.findOne({ 'requestId': req.body.requestId }).then((order) => {
            // console.log(order);
            var unpickedOrder = new UnpickedOrder();
            unpickedOrder.requestId = order.requestId;
            unpickedOrder.locationType = order.locationType;
            unpickedOrder.quantity = order.quantity;
            unpickedOrder.franchise = order.franchise;
            unpickedOrder.serviceName = order.serviceName;
            unpickedOrder.serviceType = order.serviceType;
            unpickedOrder.pickupDate = order.pickupDate;
            unpickedOrder.timeSlot = order.timeSlot;
            unpickedOrder.created_by = order.created_by;
            unpickedOrder.updated_by = order.updated_by;
            unpickedOrder.message = req.body.message;
            unpickedOrder.status = order.status;

            unpickedOrder.save().then((data) => {
                RequestOrder.findOneAndUpdate({ 'requestId': req.body.requestId }, {
                    $set: { status: false }
                }).then((order));
                res.status(200).json(data)
            }, (err) => {
                res.status(400).json(err);
            })
        }, (err) => {
            res.status(400).json(err);
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
                    // order.order_amount = req.body.order_amount;
                    order.order_status = "In Process";
                    order.franchise = data.franchise._id;
                    order.customer = data.customer;
                    order.servicetype = data.servicetype;
                    order.quantity=req.body.qty
                    // order.created_by = order.created_by;
                    // order.updated_by = order.updated_by;
                    order.status = data.status;
                    order.state = data.state;
                    // console.log('=============',order);
                    order.save().then((data) => {
                        // console.log(data);
                        RequestOrder.findOneAndUpdate({ 'requestId': req.body.requestId }, {
                            $set: {
                                status: false,
                                request_status: "Picked"
                            }
                        }).then((order));
                        generateSms(mobile,
                            `Dear ${name},Your Pickup with Qty ${data.quantity} garments was successful. You will be receiving final bill soon.`
                        )
                        res.status(200).json({ Success: true, Message: 'Order Placed SuccessFully' })
                    })
                })
            }).catch((err) => {
                res.status(400).json({ err });
            })
    })


    // Get all Unpickedorders Area wise
    .get('/unpickedorders/:franchise', passport.authenticate('jwt', { session: false }), (req, res) => {

        UnpickedOrder.find({ 'franchise': req.params.franchise }).then((unpickorders) => {
            res.status(200).json(unpickorders);
        }, (error) => {
            res.status(400).json(err);
        })
    })

    // Get all Undeliverdeorders Area wise
    .get('/undeliveredorders/:franchise', passport.authenticate('jwt', { session: false }), (req, res) => {

        UndeliveredOrder.find({ 'franchise': req.params.franchise }).then((unpickorders) => {
            res.status(200).json(unpickorders);
        }, (error) => {
            res.status(400).json(err);
        })
    })

    //All Readyorders for delivery
    //for fake entry // no need of this we can get ready orders from the web api 
    .get('/readyorders/:franchise', passport.authenticate('jwt', { session: false }), (req, res) => {

        ReadyOrder.find({ 'franchise': req.params.franchise }).then((readyorders) => {
            res.status(200).json(readyorders);
        }, (error) => {
            res.status(400).json(err);
        })
    })


    // ready order which is Undelivered
    .post('/undeliveredorder', passport.authenticate('jwt', { session: false }), (req, res) => {

        ReadyOrder.findOne({ 'orderId': req.body.orderId }).then((order) => {

            var undeliveredOrder = new UndeliveredOrder();
            undeliveredOrder.orderId = order.orderId;
            undeliveredOrder.franchise = order.franchise;
            undeliveredOrder.message = req.body.message;
            undeliveredOrder.created_by = order.created_by;
            undeliveredOrder.updated_by = order.updated_by;
            undeliveredOrder.status = order.status;

            undeliveredOrder.save().then((data) => {
                ReadyOrder.findOneAndUpdate({ 'requestId': req.body.requestId }, {
                    $set: { status: false }
                }).then((order));
                res.status(200).json(data)
            }, (err) => {
                res.status(400).json(err);
            })
        }, (err) => {
            res.status(400).json(err);
        })
    })

    // ready order which is Delivered
    .post('/orderdelivered', passport.authenticate('jwt', { session: false }), (req, res) => {

        ReadyOrder.findOne({ 'OrderId': req.body.OrderId }).then((order) => {
            console.log(order)
            var orderDelivered = new OrderDelivered();
            orderDelivered.orderId = order.orderId;
            orderDelivered.franchise = order.franchise;
            orderDelivered.created_by = order.created_by;
            orderDelivered.updated_by = order.updated_by;
            orderDelivered.status = order.status;

            orderDelivered.save().then((data) => {
                ReadyOrder.findOneAndUpdate({ 'requestId': req.body.requestId }, {
                    $set: { status: false }
                }).then((order));
                res.status(200).json(data)
            }, (err) => {
                res.status(400).json(err);
            })
        }, (err) => {
            res.status(400).json(err);
        })
    })

    //pickup boy GET the request which are assign to him 
    .get('/mrequestorder', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);
        RequestOrder.find({
            'pickupdelivery': decoded._id,
            "request_status": 'Ready To Pickup',
            'state':true,
            'status':true
        }).then((orders) => {
            res.status(200).json({ Success: true, orders });
        }).catch((err) => {
            res.status(400).json({ err });
        })
    })
module.exports = { pickupboyserviceRouter }
