var express = require('express');
var admininfoRouter = express.Router();
var jwt = require('jsonwebtoken');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);

var Admininfo = require('../models/admininfo');


//Create router for signup or register the new user.
admininfoRouter
    .route('/signup')
    .post(function(req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            console.log('POST /signup');

            var adminlogin = new Admininfo(req.body);
            // var newUser = new Admininfo({
            //     username: req.body.username,
            //     password: req.body.password
            //   });
            adminlogin.save(function(err) {
                if (err) {
                    res.status(400).json({ success: false, msg: 'Username already exists.' });
                    return;
                }
                res.json({ success: true, msg: 'Successful created new user.' });
            });
        }
    })

// Create router for login or sign-in.
admininfoRouter
    .route('/signin')
    .post(function(req, res) {
        console.log(req.body)
        Admininfo.findOne({
            username: req.body.username
        }, function(err, user) {
            console.log(user)
            if (err) throw err;
            if (!user) {
                res.status(401).send({ success: false, error: 'Authentication failed. User not found.' });
            } else {
                // check if password matches
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        const token = jwt.sign(user.toJSON(), config.secret, {
                            expiresIn: 604800 // 1 week
                        });
                        // return the information including token as JSON
                        res.json({ user: user, success: true, token: 'JWT ' + token });
                    } else {
                        res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                    }
                });
            }
        });
    })

module.exports = {
    getToken: function(headers) {
        console.log(" function called ", headers);

        if (headers && headers.authorization) {
            var parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                return parted[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
};

module.exports = admininfoRouter;