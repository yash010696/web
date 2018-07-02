var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Specialservice = require('../models/specailservice');
var User = require('../models/user');
var Verifytoken = require('./loginadmin');
const checkAuth = require('../middlewear/check-auth');

var specialserviceRouter = express.Router();

//Create router for  register the new subservice.
specialserviceRouter
    .route('/specialservice')
    .post(checkAuth, function(req, res) {


        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {

            var counter;

            Specialservice.find().exec(function(err, results) {
                var count = results.length;
                counter = count + 1;
                savedata(counter);

            });


        }

        function savedata(counter) {
            // var myDateString = Date();
            var cc = counter;
            console.log('cc', cc);
            // var area = new Area(req.body);
            var code = req.body.code.toUpperCase();
            var specialservice = new Specialservice({
                // id: cc,
                specialservice_name: req.body.specialservice_name,
                code: code,
                price: req.body.price,
                created_by: req.userData._id,
                // created_at:myDateString,
                updated_by: null,
                // updated_at:myDateString,
                status: true,
                state: true
            });
            specialservice.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: specialservice, success: true, msg: 'Successful created new special service.' });
            });

        }

    })


//Create router for fetching All subservice.
.get(checkAuth, function(req, res) {


    Specialservice.find({ state: true }, function(err, specialservices) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log(specialservices);
        res.json(specialservices);
    });

});

//Create router for fetching Single subservice.
specialserviceRouter
    .route('/specialservices/:specialserviceID')
    .get(checkAuth, function(req, res) {

        console.log('GET /colors/:specialserviceID');

        var specialserviceID = req.params.specialserviceID;

        Specialservice.findOne({ _id: specialserviceID }, function(err, specialservice) {

            if (err) {
                res.status(500).send(err);
                return;
            }

            console.log(specialservice);

            res.json(specialservice);

        });
    })

//Create router for Updating subservice.
.put(checkAuth, function(req, res) {

    console.log('PUT /specialservices/:specialserviceID');

    var specialserviceID = req.params.specialserviceID;

    Specialservice.findOne({ _id: specialserviceID }, function(err, specialservice) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        // var myDateString = Date();
        var code = req.body.code.toUpperCase();
        if (specialservice) {
            specialservice.specialservice_name = req.body.specialservice_name,
            specialservice.code = code,
            specialservice.price = req.body.price,
                specialservice.status = req.body.status;
                specialservice.updated_by = req.userData._id;

                specialservice.save();

            res.json(specialservice);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})
specialserviceRouter
    .route('/specialservicesss/:specialserviceID')
    .put(checkAuth, function(req, res) {
        console.log('PUT /specialservicesss/:specialserviceID');
        var specialserviceID = req.params.specialserviceID;
        Specialservice.findOne({ _id: specialserviceID }, function(err, specialservice) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (specialservice) {
                specialservice.state = false;

                specialservice.save();
                res.json(color);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
module.exports = specialserviceRouter;