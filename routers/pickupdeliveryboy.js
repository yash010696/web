var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Pickupdeliveryboy = require('../models/pickupdeliveryboy');
var Franchise = require('../models/franchise');
var Role = require('../models/role');
var Verifytoken = require('./loginadmin');
var pickupdeliveryboyRouter = express.Router();
const bcrypt = require('bcrypt');
const checkAuth = require('../middlewear/check-auth');


///Create router for  register the new user.
pickupdeliveryboyRouter
    .route('/pickupdeliveryboy')
    .post( checkAuth,function(req, res) {

        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {

                    var user = new Pickupdeliveryboy({
                        // id: cc,
                        name: req.body.name,
                        franchise: req.body.franchise,
                        role: req.body.role,
                        mobile: req.body.mobile,
                        address: req.body.address,
                        pincode: req.body.pincode,
                        city: req.body.city,
                        state: req.body.state,
                        created_by: req.body.admin_id,
                        updated_by: null,
                        status: true,
                        statee: true
                    });
                    user.save(function(err) {
                        if (err) {
                            res.status(400).send(err);
                            return;
                        }
                        res.json({ success: true, msg: 'Successful created new pickup / delivery boy.' });
                    });
                }
    })

//Create router for fetching All subservice.
.get(checkAuth, function(req, res) {
    Pickupdeliveryboy.find({ statee: true }).populate('franchise role').
    exec(function(err, users) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(users);
    });
});
pickupdeliveryboyRouter
    .route('/pickupboy')
.get(checkAuth, function(req, res) {
    Pickupdeliveryboy.find({ statee: true }).populate('franchise role').
    exec(function(err, users) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        // filterUserArray.push(users.find(element => element.role.name !== "admin"));
        // const dataRes = users.filter(element => element.area !== null || element.franchise !== null);
         const dataRes = users.filter(element =>  element.role.name == "pick-up boy");
        res.json(dataRes);
    });
});

//Create router for fetching Single user.
pickupdeliveryboyRouter.route('/pickupdeliveryboys/:userId')
    .put(checkAuth, function(req, res) {

        var userId = req.params.userId;
        Pickupdeliveryboy.findOne({ _id: userId }, function(err, user) {
            if (user) {
                user.address = req.body.address,
                    user.city = req.body.city,
                    user.name = req.body.name,
                    user.franchise = req.body.franchise,
                    user.mobile = req.body.mobile,
                    user.pincode = req.body.pincode,
                    user.role = req.body.role,
                    user.state = req.body.state,
                    user.status = req.body.status,
                    user.updated_by = req.body.updated_by;
                user.save();
                res.json({ success: true, msg: 'Pickup / Delivery boy updated successfully' });
                return;
            }
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({ success: true, msg: 'Successful Updated pickup / delivery boy.' });
            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })



    pickupdeliveryboyRouter
    .route('/pickupdeliveryvboyss/:userId')
    .put(checkAuth, function(req, res) {
        console.log('PUT /userss/:userId');
        var userId = req.params.userId;
        Pickupdeliveryboy.findOne({ _id: userId }, function(err, user) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (user) {
                user.statee = false;

                user.save();
                res.json(user);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    });


module.exports = pickupdeliveryboyRouter;