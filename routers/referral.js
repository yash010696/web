var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Referral = require('../models/referral');
var Verifytoken = require('./loginadmin');
var referralRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');

//Create router for  register the new area.
referralRouter
    .route('/referral')
    .post(passport.authenticate('jwt', { session: false }), function(req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            var counter;
            Referral.find().exec(function(err, results) {
                var count = results.length;
                counter = count + 1;
                savedata(counter);
            });
        }

        function savedata(counter) {
            var cc = counter;
            var referral = new Referral({
                id: cc,
                referral_value: req.body.referral_value,
                min_ordervalue: req.body.min_ordervalue,
                created_by: req.body.admin_id,
                updated_by: null,
                status: true,
                state: true
            });
            referral.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ success: true, msg: 'Successful created new referral.' });
            });
        }
    })
    //Create router for fetching All areas.
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {
        Referral.find({ state: true }, function(err, referrals) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(referrals);
        });
    });

referralRouter
    .route('/referrals/:referralId')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {
        var referralId = req.params.referralId;
        Referral.findOne({ id: referralId }, function(err, referral) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(referral);
        });
    })
    .put(passport.authenticate('jwt', { session: false }), function(req, res) {
        var referralId = req.params.referralId;
        Referral.findOne({ _id: referralId }, function(err, referral) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (referral) {
                referral.referral_value = req.body.referral_value;
                referral.min_ordervalue = req.body.min_ordervalue;
                referral.status = req.body.status;
                referral.updated_by = req.body.updated_by;
                referral.save();
                res.json(referral);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })

referralRouter
    .route('/referralss/:referralId')
    .put(checkAuth, function(req, res) {
        const referralId = req.params.referralId;
        Referral.findOne({ _id: referralId }, function(err, referral) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }
            if (referral) {
                referral.state = false;

                referral.save();
                res.json(referral);
                return;
            }
            res.status(404).json({
                error: 'Unable to found.'
            });
        });
    })
module.exports = referralRouter;