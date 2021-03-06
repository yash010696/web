var express = require('express');
var localStorage = require('localStorage');
var jwt = require('jsonwebtoken');
var config = require('./../config/config');
var generateSms = require('./../middlewear/sms');
var Pickupdeliveryboy = require('./../models/pickupdeliveryboy');

var Customer = require('./../models/customer');
var mpickupdeliveryboyRouter = express.Router();

function otpGenerate() {
    var otp1 = "";
    var chars = "1234567890";
    var string_length = 4;
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        otp1 += chars.substring(rnum, rnum + 1);
    }
    setTimeout(() => { }, 300000); //1000ms=1 sec // 300000ms=300sec=5min
    return otp1;
}

var token;
mpickupdeliveryboyRouter
    .post('/plogin', (req, res) => {
        let phone = req.body.mobile;
        // localStorage.setItem('phone', phone);
        Pickupdeliveryboy.find({ 'mobile': phone }).then((user) => {

            if (!user[0]) {
                res.status(200).json({ Success: false, Message: 'Authentication Failed. No User Found' });
            }
            else if (user[0].status == true && user[0].statee == true ) {
                token = jwt.sign(user[0].toJSON(), config.secret, { expiresIn: 604800 });
                otp1 = otpGenerate();
                Pickupdeliveryboy.findOneAndUpdate({ '_id': user[0]._id }, {
                    $set: { otp: otp1 }
                }).then((data) => { });
                generateSms(phone,
                    `Your 24Klen Laundry App One Time Password is ${otp1}.`
                ).then((data) => {
                    res.status(200).json({ Success: true, Message: 'OTP sent to mobile number.' });
                }, (err) => {
                    res.status(400).json({ Success: false, Message: 'Invalid Phone Number' });
                })
            }
            else{
                res.status(200).json({ Success: false, Message: 'User Not Valid!' });
            }
        }).catch((err) => {
            res.status(400).json({ Success: false, Message: 'Invalid Phone Number' });
        })
    })

    .post('/pverification', (req, res) => {
        var otp = req.body.otp;
        Pickupdeliveryboy.findOne({ 'otp': req.body.otp }).then((customer) => {
            if (!customer) {
                res.status(200).json({ Success: false, Message: 'Invalid OTP. Kindly check and reenter the OTP.' });
            } else {
                Pickupdeliveryboy.findOneAndUpdate({ '_id': customer._id }, {
                    $set: { otp: null }
                }).then((data) => { });
                res.status(200).header('x-auth', `JWT ${token}`).json({ token: 'JWT ' + token, Success: true, Message: 'Logged In Successfully' });
            }
        })
    })

// .post('/potpGenerate', (req, res) => {
//     // console.log(req.body);
//     var phone = localStorage.getItem('phone');
//     otp1 = otpGenerate();
//     generateSms(phone,
//         `Your 24Klen Laundry App One Time Password is ${otp1}.`
//     ).then((data) => {
//         res.status(200).json({ data, Success: true, Message: 'Otp send to mobile number.' });
//     }, (err) => {
//         res.status(200).json({ Success: false, Message: `${err}` });
//     });
// })

module.exports = { mpickupdeliveryboyRouter };