var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var { RequestOrder } = require('./../models/requestorder');
var Order=require('./../models/order');
var orderstatus=require('./../models/orderstatus');
var MyOrdersRouter = express.Router();

MyOrdersRouter
    .get('/orderstatus1', passport.authenticate('jwt', { session: false }), (req, res) => {
        
        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);
        Order.find({customer:decoded._id})
             .populate('orderstatus')
             .then((order)=>{
                 console.log(order);
                var order_status=order[0].order_status;
                res.status(200).json({Success:true,order_status});
        },(err)=>{
            res.status(400).json(err);
        });
    })

    .get('/myorders', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret)
        Order.find({ 'customer': decoded._id }).then((orders) => {
            res.status(200).json({Success:true,orders});
        }, (err) => {
            res.status(400).json(err);
        })
    })
module.exports = { MyOrdersRouter }
