var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var RequestOrder = require('./../models/requestorder');
var Order = require('./../models/order');
var orderstatus = require('./../models/orderstatus');
var fs = require('fs');
var Customer = require('./../models/customer');
var Service = require('./../models/service');
var Servicetype = require('./../models/servicetype');
var Subservice = require('./../models/subservice');
var Garment = require('./../models/garment');
var Price = require('./../models/price');

var MyOrdersRouter = express.Router();

MyOrdersRouter
    .get('/orderstatus1', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);

        // RequestOrder.find({
        //     'customer': decoded._id,
        //     'state': true,
        //     'status': true
        // }).then((requestorder) => {
        //     if (!requestorder[0]) {
        Order.find({
            'customer': decoded._id,
            'state': true,
            'status': true
        })
            // .populate('orderstatus')
            .then((order) => {
                if (!order[0]) {
                    res.status(200).json({ Success: true, Message: 'No Ongoing Orders' });
                } else {
                    // var OngoingOrderList = []; 
                    // order.forEach(element => {
                    //         OngoingOrderList.push({
                    //             order_id: element.order_id,
                    //             order_status: element.order_status    
                    //         })            
                    // })
                    res.status(200).json({ Success: true, order });
                }
            }).catch((err) => {
                res.status(400).json({ err });
            })
        // }
        // else {

        // var OngoingOrderList = []; 
        // order.forEach(element => {
        //         OngoingOrderList.push({
        //             requestId: element.requestId,
        //             request_status: element.request_status    
        //         })            
        // })
        // res.status(200).json({ Success: true, requestorder });
        // }

        // }).catch((err) => {
        //     res.status(400).json({ err });
        // })
    })

    .get('/myorders', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret)
        Order.find({
            'customer': decoded._id,
            'order_status': 'Delivered'
        }).then((orders) => {
            if (!orders[0]) {
                res.status(200).json({ Success: true, Message: 'No Past Orders' });
            } else {
                res.status(200).json({ Success: true, orders });
            }
        }, (err) => {
            res.status(400).json({ err });
        })
    })

    .get('/myrequests', passport.authenticate('jwt', { session: false }), (req, res) => {

        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret)
        RequestOrder.find({
            'customer': decoded._id
        }).then((requestorders) => {
            if (!requestorders[0]) {
                res.status(200).json({ Success: true, Message: 'No Request Orders' });
            } else {
                res.status(200).json({ Success: true, requestorders });
            }
        }).catch((err) => {
            res.status(400).json({ err });
        })
    })

    .post('/database', (req, res) => {
        var notestring = fs.readFileSync(__dirname + "./../format.json");
        notes = JSON.parse(notestring);

        notes.forEach(element => {
            var customer = new Customer();
            customer.first_Name = element.first_Name;
            customer.email = element.email;
            customer.mobile = element.mobile;
            date = element.dob;
            // console.log(date);
            newdate = date.split("_");
            date1 = new Date(newdate[2] + '/' + newdate[1] + '/' + newdate[0]);
            var newDate = new Date(date1.getTime() + Math.abs(date1.getTimezoneOffset() * 60000))
            // console.log(newDate);
            customer.dob = newDate

            customer.gender = element.gender;
            customer.whatsup = element.whatsup;
            customer.franchise = '5b309c4f1bd04e00204ca20c';
            var home = element.home.split(";");
            // var other=element.other.split(";");
            console.log('///////////////', home);
            var home = {
                flat_no: home[0],
                society: home[1],
                landmark: home[2],
                pincode: home[3]
            }
            // console.log('/////////////////',home);
            // var other = {
            //     flat_no: other[0], 
            //     society: other[1],
            //     landmark: other[2],
            //     pincode: other[3]
            // }
            // console.log('/////////////////',other);
            customer.address.push({ home });

            // console.log('customer',customer);
            customer.save().then((data) => { });
        });
        res.json("data added");
    })

    .post('/pricedb', (req, res) => {

        var notestring = fs.readFileSync(__dirname + "./../price.json");
        prices = JSON.parse(notestring);

        prices.forEach(element => {
            // console.log('element:',element);
            var price = new Price();
            price.price = element.price;
            Servicetype.findOne({ 'type': element.servicetype }).then((servicetype) => {

                price.servicetype = servicetype._id;
                Service.findOne({ 'name': element.service }).then((service) => {

                    price.service = service._id;
                    Subservice.findOne({'name':element.subservice}).then((subservice) => {

                        price.subservice = subservice._id;
                        Garment.findOne({'name':element.garment}).then((garment) => {

                            price.garment = garment._id;
                            price.status = true;
                            price.state = true;

                            console.log('////////////////////////', price);
                            price.save()
                            
                        })
                    })
                })
            })
        });
        res.send("okkkkkkkkkkkkkk");
    })

module.exports = { MyOrdersRouter }
