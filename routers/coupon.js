var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Coupon = require('../models/coupon');
var Verifytoken = require('./loginadmin');
var couponRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
var Customer = require('./../models/customer');
var generateSms = require('./../middlewear/sms');
///Create router for  register the new user.

couponRouter
    .route('/coupon')
    .post(checkAuth, function (req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            var counter;
            Coupon.find().exec(function (err, results) {
                var count = results.length;
                counter = count + 1;
                savedata(counter);

            });
        }

        function savedata(counter) {
            var myDateString = Date();
            var cc = counter;
            console.log(req.userData);
            console.log('cc', cc);
            // var area = new Area(req.body);
            var couponCode = req.body.couponCode.toUpperCase();
            var coupon = new Coupon({
                // id: cc,
                franchise: req.body.franchise,
                couponCode: couponCode,
                offerIn: req.body.offerIn,
                couponAmount: req.body.couponAmount,
                validFor: req.body.validFor,
                description: req.body.description,
                couponExpireAt: req.body.couponExpireAt,
                created_by: req.body.admin_id,
                couponCreatedAt: myDateString,
                updated_by: null,
                updated_at: myDateString,
                status: true,
                state: true
            });
            coupon.save(function (err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: coupon, success: true, msg: 'Successful created new coupon.' });
            });
        }
    })

    //Create router for fetching All subservice.
    .get(checkAuth, function (req, res) {
        console.log(req.userData);
        if (req.userData.role == "admin") {
            Coupon.
                find({ state: true }).
                populate('franchise').
                exec(function (err, coupons) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    console.log('The Coupon  is %s', coupons);
                    res.json(coupons);
                });
        }
        else {
            // var franchiseId = "5b1f9f7789349f3d50c3d854";
            Coupon.
                find({ state: true, franchise: req.userData.franchise }).
                populate('franchise').
                exec(function (err, coupons) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    console.log('The Coupon  is %s', coupons);
                    res.json(coupons);
                });
        }
    });
//Get single coupon details
couponRouter
    .route('/coupon/code/:code')
    .get(checkAuth, function (req, res) {
        console.log('GET /coupon/code/:code');
        var code = req.params.code;
        Coupon.
            findOne({ couponCode: code }).
            populate('franchise').
            exec(function (err, coupon) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                //console.log('The Details is ', coupon);
                if (!coupon) {
                    res.json({ error: "No valid coupon" });
                }
                else {
                    //coupon.couponExpireAt
                    //var d = new Date("2018-06-01T18:30:00.000Z");
                    var date = new Date(coupon.couponExpireAt);
                    var m = date.getUTCMonth() + 1;
                    date = new Date(date.getUTCDate() + '/' + m + '/' + date.getUTCFullYear());

                    var d2 = new Date();
                    var m2 = d2.getUTCMonth() + 1;
                    d2 = new Date(d2.getUTCDate() + '/' + m2 + '/' + d2.getUTCFullYear());

                    if (date.getTime() >= d2.getTime()) {
                        res.json({ result: coupon, message: "Coupon Applied" });
                    }
                    else {
                        res.json({ error: "Coupon has expired" });
                    }
                }
            });
    })

//Create router for fetching Single user.
couponRouter
    .route('/coupons/:couponId')
    .get(checkAuth, function (req, res) {
        console.log('GET /coupons/:couponId');
        var couponId = req.params.couponId;
        Coupon.
            findOne({ id: couponId }).
            populate('franchise').
            exec(function (err, coupon) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
            });
    });
//Get single coupon details
couponRouter
    .route('/coupon/code/:code')
    .get(checkAuth, function (req, res) {
        console.log('GET /coupon/code/:code');
        var code = req.params.code;
        Coupon.
            findOne({ couponCode: code }).
            populate('franchise').
            exec(function (err, coupon) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                console.log('The Details is ', coupon);
                res.json(coupon);
            });
    })
//Create router for fetching Single user.
couponRouter
    .route('/coupons/:couponId')
    .get(checkAuth, function (req, res) {
        console.log('GET /coupons/:couponId');
        var couponId = req.params.couponId;
        Coupon.
            findOne({ id: couponId }).
            populate('franchise').
            exec(function (err, coupon) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                console.log('The Franchise  is %s', coupon);
                res.json(coupon);
            });
    })
    //Create router for Updating .
    .put(checkAuth, function (req, res) {
        console.log('PUT /coupons/:couponId');
        var couponId = req.params.couponId;
        Coupon.findOne({ _id: couponId }, function (err, coupon) {
            var myDateString = Date();
            var couponCode = req.body.couponCode.toUpperCase();
            if (coupon) {
                coupon.franchise = req.body.franchise,
                    coupon.couponCode = couponCode,
                    coupon.offerIn = req.body.offerIn,
                    coupon.couponAmount = req.body.couponAmount,
                    coupon.validFor = req.body.validFor,
                    coupon.description = req.body.description,
                    coupon.couponExpireAt = req.body.couponExpireAt,
                    coupon.status = req.body.status,
                    coupon.updated_by = req.body.updated_by;
                coupon.updated_at = myDateString;
                coupon.save();
                res.json(coupon);
                return;
            }
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
couponRouter
    .route('/couponss/:couponId')
    .put(checkAuth, function (req, res) {
        console.log('PUT /couponss/:couponId');
        var couponId = req.params.couponId;
        Coupon.findOne({ _id: couponId }, function (err, coupon) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (coupon) {
                coupon.state = false;

                coupon.save();
                res.json(coupon);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })

couponRouter
    .route('/bulksms')
    .post(checkAuth, (req, res) => {
        Customer.find().then((customer) => {

            customer.forEach(element => {
                generateSms(element.mobile,
                    `Bulk SMS from node.js`
                );
            })
            res.json("send");

        })
    })

couponRouter
    .route('/mcoupon')
    .get((req, res) => {
        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret);

        Coupon.find({ state: true, franchise: { '_id': decoded.franchise } }).then((coupon) => {
            const todayDate = new Date();
            // console.log(';;;;;;;;;;;',Date.parse(todayDate))
            const coupons = coupon.filter(element => Date.parse(new Date(element.couponExpireAt)) >= Date.parse(todayDate));
            res.json({ couponList: coupons });
        })
    })


module.exports = couponRouter;