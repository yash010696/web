var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Color = require('../models/color');
var Verifytoken = require('./loginadmin');
var colorRouter = express.Router();

//Create router for  register the new subservice.
colorRouter
    .route('/color')
    .post(passport.authenticate('jwt', { session: false }), function(req, res) {


        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {

            var counter;

            Color.find().exec(function(err, results) {
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
            var color = new Color({
                id: cc,
                color_name: req.body.color_name,
                code: code,
                created_by: req.body.admin_id,
                // created_at:myDateString,
                updated_by: null,
                // updated_at:myDateString,
                status: true,
                state: true
            });
            color.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: color, success: true, msg: 'Successful created new color.' });
            });

        }

    })


//Create router for fetching All subservice.
.get(passport.authenticate('jwt', { session: false }), function(req, res) {


    Color.find({ state: true }, function(err, colors) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log(colors);
        res.json(colors);
    });

});

//Create router for fetching Single subservice.
colorRouter
    .route('/colors/:colorID')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {

        console.log('GET /colors/:colorID');

        var colorID = req.params.colorID;

        Color.findOne({ _id: colorID }, function(err, color) {

            if (err) {
                res.status(500).send(err);
                return;
            }

            console.log(color);

            res.json(clothdefect);

        });
    })

//Create router for Updating subservice.
.put(passport.authenticate('jwt', { session: false }), function(req, res) {

    console.log('PUT /colors/:colorID');

    var colorID = req.params.colorID;

    Color.findOne({ _id: colorID }, function(err, color) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        // var myDateString = Date();
        var code = req.body.code.toUpperCase();
        if (color) {
            color.color_name = req.body.color_name,
                color.code = code,
                color.status = req.body.status;
            color.updated_by = req.body.updated_by;

            color.save();

            res.json(color);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})
colorRouter
    .route('/colorss/:colorID')
    .put(passport.authenticate('jwt', { session: false }), function(req, res) {
        console.log('PUT /colorss/:colorID');
        var colorID = req.params.colorID;
        Color.findOne({ _id: colorID }, function(err, color) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (color) {
                color.state = false;

                color.save();
                res.json(color);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
module.exports = colorRouter;