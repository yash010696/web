var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var RequestOrder = require('./../models/requestorder');
var Order = require('./../models/order');
var orderstatus = require('./../models/orderstatus');
var MyOrdersRouter = express.Router();

MyOrdersRouter
    .get('/orderstatus1', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);

        RequestOrder.find({
            'customer': decoded._id,
            'state': true,
            'status': true
        }).then((order) => {
            if (!order[0]) {
                Order.find({ 'customer': decoded._id })
                    // .populate('orderstatus')
                    .then((order) => {

                        // var OngoingOrderList = []; 
                        // order.forEach(element => {
                        //         OngoingOrderList.push({
                        //             order_id: element.order_id,
                        //             order_status: element.order_status    
                        //         })            
                        // })
                        res.status(200).json({ Success: true, order });
                    })
            }
            else {

                // var OngoingOrderList = []; 
                // order.forEach(element => {
                //         OngoingOrderList.push({
                //             requestId: element.requestId,
                //             request_status: element.request_status    
                //         })            
                // })
                res.status(200).json({ Success: true, order });
            }

        }).catch((err) => {
            res.status(400).json({ err });
        })
    })

    .get('/myorders', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret)
        Order.find({ 'customer': decoded._id }).then((orders) => {
            res.status(200).json({ Success: true, orders });
        }, (err) => {
            res.status(400).json({ err });
        })
    })
module.exports = { MyOrdersRouter }
