var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Franchise = require('../models/franchise');
var Area = require('../models/area');
var Verifytoken = require('./loginadmin');
var franchiseRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');

///Create router for  register the new user.
franchiseRouter
    .route('/franchise')
    .post(checkAuth, function(req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            var counter;
            Franchise.find().exec(function(err, results) {
                var count = results.length;
                counter = count + 1;
                savedata(counter);
            });
        }

        function savedata(counter) {
            var myDateString = Date();
            var cc = counter;
            console.log('cc', cc);
            var code = req.body.store_code.toUpperCase();
            var franchise = new Franchise({
                // id: cc,
                owner_Name: req.body.owner_Name,
                franchise_Name: req.body.franchise_Name,
                store_code: code,
                company_Name: req.body.company_Name,
                billing_Name: req.body.billing_Name,
                billing_Address: req.body.billing_Address,
                gstin_Number: req.body.gstin_Number,
                area: req.body.area,
                store_Address: req.body.store_Address,
                pincode: req.body.pincode,
                city: req.body.city,
                state: req.body.state,
                created_by: req.body.admin_id,
                created_at: myDateString,
                updated_by: null,
                updated_at: myDateString,
                status: true,
                statee: true
            });
            franchise.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: franchise, success: true, msg: 'Successful created new franchise.' });
            });
        }
    })
    //Create router for fetching All subservice.
    .get(checkAuth, function(req, res) {
        Franchise.
        find({ statee: true }).
        populate('area').
        exec(function(err, franchises) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            console.log('The Franchise  is %s', franchises);
            res.json(franchises);
        });
    });

//Create router for fetching Single user.
franchiseRouter
    .route('/franchises/:franchiseId')
    .get(checkAuth, function(req, res) {
        console.log('GET /franchise/:franchiseId');
        var franchiseId = req.params.franchiseId;
        Franchise.
        findOne({ id: franchiseId }).
        populate('area').
        exec(function(err, franchise) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            console.log('The Franchise  is %s', franchise);
            res.json(franchise);
        });
    })
    //Create router for Updating .
    .put(checkAuth, function(req, res) {
        console.log('PUT /franchise/:franchiseId');
        var franchiseId = req.params.franchiseId;
        Franchise.findOne({ _id: franchiseId }, function(err, franchise) {
            var myDateString = Date();
            var code = req.body.store_code.toUpperCase();
            if (franchise) {
                franchise.owner_Name = req.body.owner_Name,
                    franchise.franchise_Name = req.body.franchise_Name,
                    franchise.store_code = code,
                    franchise.company_Name = req.body.company_Name,
                    franchise.billing_Name = req.body.billing_Name,
                    franchise.billing_Address = req.body.billing_Address,
                    franchise.gstin_Number = req.body.gstin_Number,
                    franchise.area = req.body.area,
                    franchise.store_Address = req.body.store_Address,
                    franchise.pincode = req.body.pincode,
                    franchise.city = req.body.city,
                    franchise.state = req.body.state,
                    franchise.status = req.body.status,
                    franchise.updated_by = req.body.updated_by;
                franchise.updated_at = myDateString
                franchise.save();
                res.json(franchise);
                return;
            }
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({ success: true, msg: 'Successful Updated franchise' });
            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
franchiseRouter
    .route('/franchisess/:franchiseId')
    .put(checkAuth, function(req, res) {
        console.log('PUT /colorss/:colorID');
        var franchiseId = req.params.franchiseId;
        Franchise.findOne({ _id: franchiseId }, function(err, franchise) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (franchise) {
                franchise.statee = false;

                franchise.save();
                res.json(franchise);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
module.exports = franchiseRouter;