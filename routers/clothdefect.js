var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Clothdefect = require('../models/clothdefect');
var Verifytoken = require('./loginadmin');
var clothdefectRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');

//Create router for  register the new subservice.
clothdefectRouter
    .route('/clothdefect')
    .post(passport.authenticate('jwt', { session: false }), function(req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            var counter;
            Clothdefect.find().exec(function(err, results) {
                var count = results.length;
                counter = count + 1;
                savedata(counter);
            });
        }
        function savedata(counter) {
            var myDateString = Date();
            var cc = counter;
            console.log('cc', cc);
            // var area = new Area(req.body);
            var code = req.body.code.toUpperCase();
            var clothdefect = new Clothdefect({
                id: cc,
                defect_name: req.body.defect_name,
                code: code,
                created_by: req.body.admin_id,
                created_at: myDateString,
                updated_by: null,
                updated_at: myDateString,
                status: true,
                state: true
            });
            clothdefect.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: clothdefect, success: true, msg: 'Successful created new.' });
            });
        }
    })
//Create router for fetching All subservice.
.get(passport.authenticate('jwt', { session: false }), function(req, res) {


    Clothdefect.find({ state: true }, function(err, clothdefects) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log(clothdefects);
        res.json(clothdefects);
    });

});

//Create router for fetching Single subservice.
clothdefectRouter
    .route('/clothdefects/:clothdefectId')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {

        console.log('GET /clothdefect/:clothdefectId');

        var clothdefectId = req.params.clothdefectId;

        Clothdefect.findOne({ id: clothdefectId }, function(err, clothdefect) {

            if (err) {
                res.status(500).send(err);
                return;
            }

            console.log(clothdefect);

            res.json(clothdefect);

        });
    })

//Create router for Updating subservice.
.put(passport.authenticate('jwt', { session: false }), function(req, res) {

    console.log('PUT /clothdefect/:clothdefectId');

    var clothdefectId = req.params.clothdefectId;

    Clothdefect.findOne({ _id: clothdefectId }, function(err, clothdefect) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        var myDateString = Date();
        var code = req.body.code.toUpperCase();
        if (clothdefect) {
            clothdefect.defect_name = req.body.defect_name,
                clothdefect.code = code,
                clothdefect.status = req.body.status;
            clothdefect.updated_by = req.body.updated_by;
            clothdefect.updated_at = myDateString

            clothdefect.save();

            res.json(clothdefect);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})

clothdefectRouter
    .route('/clothdefectss/:clothdefectId')
    .put(checkAuth, function(req, res) {
        const clothdefectId = req.params.clothdefectId;
        Clothdefect.findOne({ _id: clothdefectId }, function(err, clothdefect) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (clothdefect) {
                clothdefect.state = false;

                clothdefect.save();
                res.json(clothdefect);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
module.exports = clothdefectRouter;