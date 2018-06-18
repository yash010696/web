var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Brand = require('../models/brand');
var Verifytoken = require('./loginadmin');
var brandRouter = express.Router();

//Create router for  register the new subservice.
brandRouter
    .route('/brand')
    .post(passport.authenticate('jwt', { session: false }), function(req, res) {


        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {

            var counter;

            Brand.find().exec(function(err, results) {
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
            var color = new Brand({
                id: cc,
                brand_name: req.body.brand_name,
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
                res.json({ data: color, success: true, msg: 'Successful created new brand.' });
            });

        }

    })


//Create router for fetching All subservice.
.get(passport.authenticate('jwt', { session: false }), function(req, res) {


    Brand.find({ state: true }, function(err, brands) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log(brands);
        res.json(brands);
    });

});

//Create router for fetching Single subservice.
brandRouter
    .route('/brands/:brandID')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {

        console.log('GET /brands/:brandID');

        var brandID = req.params.brandID;

        Brand.findOne({ _id: brandID }, function(err, brand) {

            if (err) {
                res.status(500).send(err);
                return;
            }

            console.log(brand);

            res.json(brand);

        });
    })

//Create router for Updating subservice.
.put(passport.authenticate('jwt', { session: false }), function(req, res) {

    console.log('PUT /colors/:brandID');

    var brandID = req.params.brandID;

    Brand.findOne({ _id: brandID }, function(err, brand) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        // var myDateString = Date();
        var code = req.body.code.toUpperCase();
        if (brand) {
            brand.brand_name = req.body.brand_name,
                brand.code = code,
                brand.status = req.body.status;
            brand.updated_by = req.body.updated_by;

            brand.save();

            res.json(brand);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})
brandRouter
    .route('/brandss/:brandId')
    .put(passport.authenticate('jwt', { session: false }), function(req, res) {
        console.log('PUT /brandss/:brandId');
        const brandId = req.params.brandId;
        Brand.findOne({ _id: brandId }, function(err, brand) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (brand) {
                brand.state = false;

                brand.save();
                res.json(brand);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
module.exports = brandRouter;