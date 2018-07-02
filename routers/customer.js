var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Customer = require('../models/customer');
var Area = require('../models/area');
var Ordertype = require('./ordertype');
var Verifytoken = require('./loginadmin');
var customerRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
var sendmail = require('./../middlewear/mail');
var generateSms = require('./../middlewear/sms');

///Create router for  register the new user.
customerRouter
    .route('/customer')
    .post(checkAuth, function(req, res) {


        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {

            var counter;
            var randomstring = '';
            Customer.find().exec(function(err, results) {
                var count = results.length;
                counter = count + 1;
                var chars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
                var string_length = 6;
                for (var i = 0; i < string_length; i++) {
                    var rnum = Math.floor(Math.random() * chars.length);
                    randomstring += chars.substring(rnum, rnum + 1);
                    console.log('randomstring', randomstring);
                }
                savedata(counter, randomstring);
            });
        }

        function savedata(counter, randomstring) {
            var myDateString = Date();
            var cc = counter;
            console.log(req.userData);
            console.log('cc', cc);
            var referral_Code = randomstring.toUpperCase();
            // var area = new Area(req.body);
            var customer = new Customer({
                // id: cc,
                first_Name: req.body.first_Name,
                franchise :req.userData.franchise,
                order_type: req.body.order_type,
                gender: req.body.gender,
                dob: req.body.dob,
                email: req.body.email,
                mobile: req.body.mobile,
                whatsup: req.body.whatsup,
                otp: req.body.otp,
                referral_Code: referral_Code,
                username: req.body.username,
                password: req.body.password,
                confirm_Password: req.body.confirm_Password,
                // Address
                // address1: req.body.address1,
                // address2: req.body.address2,
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
            var home = {
                pincode: req.body.pincode1,
                flat_no: req.body.flat_no1,
                society: req.body.society1,
                landmark: req.body.landmark1,
            }
            var other = {
                pincode: req.body.pincode2,
                flat_no: req.body.flat_no2,
                society: req.body.society2,
                landmark: req.body.landmark2,
            }
            mobile= req.body.mobile;
            name = req.body.first_Name;
            email = req.body.email
            customer.address.push({home,other});
            customer.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                generateSms(mobile,
                    `Dear ${name}, Thank you for being part of 24Klen Laundry Science. Happy Cleaning!`
                );
                sendmail(email,
                    `Dear ${name}, Thank you for being part of 24Klen Laundry Science. Happy Cleaning!`,
                    'New User Registered'
                );
                res.json({ data: customer, success: true, msg: 'Successful created new customer.' });
            });

        }

    })


//Create router for fetching All subservice.
.get(checkAuth, function(req, res) {
    if(req.userData.role=="admin"){
    Customer.
    find({ statee: true }).
    populate('order_type franchise').
    exec(function(err, customers) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log('The Customer  is %s', customers);
        res.json(customers);
    });
    }
    else{
        Customer.
        find({ statee: true ,franchise:req.userData.franchise}).
        populate('order_type franchise').
        exec(function(err, customers) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            console.log('The Customer  is %s', customers);
            res.json(customers);
        });
    }
});

//Create router for fetching Single user.
customerRouter
    .route('/customers/:customerId')
    .get(checkAuth, function(req, res) {

        console.log('GET /customers/:customerId');

        var customerId = req.params.customerId;

        Customer.findOne({ id: customerId }, function(err, customer) {

            if (err) {
                res.status(500).send(err);
                return;
            }

            console.log(customer);

            res.json(customer);

        });

    })

//Create router for Updating .
.put(checkAuth, function(req, res) {

    console.log('PUT /customers/:customerId');

    var customerId = req.params.customerId;

    Customer.findOne({ _id: customerId }, function(err, customer) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        var myDateString = Date();
        if (customer) {
            customer.first_Name = req.body.first_Name;
            // customer.last_Name = req.body.last_Name;
            customer.order_type = req.body.order_type;
            customer.gender = req.body.gender;
            customer.email = req.body.email;
            customer.mobile = req.body.mobile;
            customer.whatsup = req.body.whatsup;
            // customer.address1 = req.body.address1;
            // customer.address2 = req.body.address2;
            // customer.pincode = req.body.pincode;
            customer.address[0].home[0].flat_no=req.body.flat_no1,
            customer.address[0].home[0].society=req.body.society1,
            customer.address[0].home[0].landmark=req.body.landmark1,
            customer.address[0].home[0].pincode=req.body.pincode1,
            customer.address[0].other[0].flat_no=req.body.flat_no2,
            customer.address[0].other[0].society=req.body.society2,
            customer.address[0].other[0].landmark=req.body.landmark2,
            customer.address[0].other[0].pincode=req.body.pincode2,
            customer.city = req.body.city;
            customer.state = req.body.state,
            customer.status = req.body.status,
            customer.updated_by = req.body.updated_by;
            customer.updated_at = myDateString;

            // var home = {
            //     pincode: req.body.pincode1,
            //     flat_no: req.body.flat_no1,
            //     society: req.body.society1,
            //     landmark: req.body.landmark1,
            // }
            // var other = {
            //     pincode: req.body.pincode2,
            //     flat_no: req.body.flat_no2,
            //     society: req.body.society2,
            //     landmark: req.body.landmark2,
            // }
            // customer.address.push({home,other});
            customer.save();

            res.json(customer);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})
customerRouter
    .route('/customerss/:customerId')
    .put(checkAuth, function(req, res) {
        console.log('PUT /customerss/:customerId');
        var customerId = req.params.customerId;
        Customer.findOne({ _id: customerId }, function(err, customer) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (customer) {
                customer.statee = false;

                customer.save();
                res.json(customer);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
module.exports = customerRouter;