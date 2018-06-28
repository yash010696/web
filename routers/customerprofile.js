var express = require('express');
var localStorage = require('localStorage');
var jwt = require('jsonwebtoken');
var passport = require('passport');
require('./../config/passport')(passport);
var config = require('./../config/config');

var customerProfileRouter = express.Router();
var Customer = require('./../models/customer');
var Franchise = require('./../models/franchise');

customerProfileRouter
    .get('/mprofile', passport.authenticate('jwt', { session: false }), (req, res) => {
        var token = req.header('Authorization').split(' ');
        var decoded = jwt.verify(token[1], config.secret)

        Customer.findOne({ '_id': decoded._id }).then((user) => {
            if (!user) {
                res.status(200).json({ Success: false, Message: "You have to Logged In!!" });
            } else {
                res.status(200).json(user);
            }
        }).catch((err) => {
            res.status(400).json(err);
        });
    })

    .put('/updateprofile/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        var id = req.params.id;

        if (req.body.dob) {
            var date = new Date(req.body.dob);
            var newDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
            req.body.dob = newDate;
        }

        Franchise.find({ statee: true, area: { $in: [req.body.area] } }).then((franchise) => {
            req.body.franchise = franchise[0]._id;

            Customer.findOneAndUpdate({ '_id': id }, {
                $set: req.body
            }, { new: true }).then((user) => {
                if (!user) {
                    res.status(200).json({ Success: false, Message: 'No User Found' });
                } else {
                    res.status(200).json({ Success: true, Message: 'Profile Updated Successfully' });
                }
            })
        }).catch((err) => {
            res.status(400).json(err);
        })
    })


module.exports = { customerProfileRouter };