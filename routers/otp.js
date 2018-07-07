var express = require('express');
var localStorage = require('localStorage');
var jwt = require('jsonwebtoken');
var config = require('./../config/config');
var generateSms = require('./../middlewear/sms');

var Customer = require('./../models/customer');
var otpRouter = express.Router();

function otpGenerate() {

    var otp = "";
    var chars = "1234567890";
    var string_length = 4;
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        otp += chars.substring(rnum, rnum + 1);
    }
    setTimeout(() => {
    }, 300000); //1000ms=1 sec // 300000ms=300sec=5min
    return otp;

}

var token;
otpRouter
    .post('/login', (req, res) => {

        let phone = req.body.mobile;
        // localStorage.setItem('phone', phone);
        Customer.find({ 'mobile': phone }).then((user) => {
            if (!user[0]) {
                res.status(200).json({ Success: false, Message: 'Authentication Failed.No User Found' });
            }
            else {

                token = jwt.sign(user[0].toJSON(), config.secret, { expiresIn: 604800 });
                otp = otpGenerate();
                Customer.findOneAndUpdate({ '_id': user[0]._id }, {
                    $set: { otp: otp }
                }).then((data)=>{});
                generateSms(phone,
                    `Your 24Klen Laundry App One Time Password is ${otp}.`
                ).then((data) => {
                    res.status(200).json({ Success: true, Message: 'Otp send to mobile number.' });
                }, (err) => {
                    res.status(400).json({ Success: false, Message: 'Invalid Phone Number' });
                })
            }
        }).catch((err) => {
            res.status(400).json({ Success: false, Message: 'Invalid Phone Number' });
        })
    })

    .post('/verification', (req, res) => {
        var otp1 = req.body.otp;
       Customer.findOne({'otp' :req.body.otp}).then((customer)=>{
           if(!customer){
            res.status(200).json({ Success: false, Message: 'Invalid Otp' });
           }else{
            Customer.findOneAndUpdate({ '_id': customer._id }, {
                $set: { otp: null }
            }).then((data)=>{});   
            res.status(200).header('x-auth', `JWT ${token}`).json({ token: 'JWT ' + token, Success: true, Message: 'Logged In Successfully' });
           }
       })
    })

    // .post('/otpGenerate', (req, res) => {
    //      var phone = localStorage.getItem('phone');

    //     otp = otpGenerate();
    //     generateSms(phone, `Your Otp is ${otp}`).then((data) => {
    //         res.status(200).json({ data, Success: true, Message: 'Otp send to mobile number.' });
    //     }, (err) => {
    //         res.status(200).json({ Success: false, Message: `${err}` });
    //     });

    // })

module.exports = { otpRouter };