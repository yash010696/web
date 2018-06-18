var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Servicecategory = require('../models/servicecategory');
var Verifytoken = require('./loginadmin');
var servicecategoryRouter = express.Router();

//Create router for  register the new service.
servicecategoryRouter
    .route('/servicecategory')
    .post(passport.authenticate('jwt', { session: false }), function(req, res) {


        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {

            var counter;

            Servicecategory.find().exec(function(err, results) {
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
            var servicecategory = new Servicecategory({
                id: cc,
                category: req.body.category,
                code: code,
                created_by: req.body.admin_id,
                created_at: myDateString,
                updated_by: null,
                updated_at: myDateString,
                status: true
            });
            servicecategory.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: servicecategory, success: true, msg: 'Successful created new servicecategory.' });
            });

        }

    })


//Create router for fetching All services.
.get(passport.authenticate('jwt', { session: false }), function(req, res) {


    Servicecategory.find(function(err, servicecategories) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log(servicecategories);
        res.json(servicecategories);
    });

});

//Create router for fetching Single service.
servicecategoryRouter
    .route('/servicecategories/:servicecategoryId')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {

        console.log('GET /Servicecategories/:servicecategoryId');

        var servicecategoryId = req.params.servicecategoryId;

        Servicecategory.findOne({ id: servicecategoryId }, function(err, servicecategory) {

            if (err) {
                res.status(500).send(err);
                return;
            }

            console.log(servicecategory);

            res.json(servicecategory);

        });
    })

//Create router for Updating service.
.put(passport.authenticate('jwt', { session: false }), function(req, res) {

    console.log('PUT /Servicecategories/:servicecategoryId');

    var servicecategoryId = req.params.servicecategoryId;

    Servicecategory.findOne({ _id: servicecategoryId }, function(err, servicecategory) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        var myDateString = Date();
        var code = req.body.code.toUpperCase();
        if (servicecategory) {
            servicecategory.category = req.body.category,
                servicecategory.code = code,
                servicecategory.status = req.body.status;
            servicecategory.updated_by = req.body.updated_by;
            servicecategory.updated_at = myDateString

            servicecategory.save();

            res.json(servicecategory);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})
module.exports = servicecategoryRouter;