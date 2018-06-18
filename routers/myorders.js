var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var { RequestOrder } = require('./../models/requestorder');
var Order=require('./../models/order');
var MyOrdersRouter = express.Router();

MyOrdersRouter
    .get('/orderstatus', passport.authenticate('jwt', { session: false }), (req, res) => {
        
        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);
        
        Order.find({'customer':decoded_id}).then((order)=>{
                res.status(200).json(order.status);
        },(err)=>{
            res.status(400).json(err);
        });
    })

    .get('/myorders', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret)
        console.log(decoded._id);
        Order.find({ 'customer': decoded._id }).then((orders) => {
            res.status(200).json(orders);
        }, (err) => {
            res.status(400).json(err);
        })
    })
module.exports = { MyOrdersRouter }
