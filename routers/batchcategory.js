var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Batchcategory = require('../models/batchcategory');
var Verifytoken = require('./loginadmin');
var batchcategoryRouter = express.Router();

//Create router for  register the new role.
batchcategoryRouter
    .route('/batchcategory')
    .post(passport.authenticate('jwt', { session: false }), function(req, res) {


        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {

            var counter;

            Batchcategory.find().exec(function(err, results) {
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
            var batchcategory = new Batchcategory({
                id: cc,
                category: req.body.category,
                created_by: req.body.created_by,
                created_at: myDateString,
                updated_by: null,
                updated_at: myDateString,
                status: true
            });
            batchcategory.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: batchcategory, success: true, msg: 'Successful created new batchcategory.' });
            });

        }

    })


//Create router for fetching All roles.
.get(passport.authenticate('jwt', { session: false }), function(req, res) {


    Batchcategory.find(function(err, batchcategories) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log(batchcategories);
        res.json(batchcategories);
    });

});

//Create router for fetching Single role.
batchcategoryRouter
    .route('/batchcategories/:batchcategoryId')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {

        console.log('GET /batchcategories/:batchcategoryId');

        var batchcategoryId = req.params.batchcategoryId;

        Batchcategory.findOne({ id: batchcategoryId }, function(err, batchcategory) {

            if (err) {
                res.status(500).send(err);
                return;
            }

            console.log(batchcategory);

            res.json(batchcategory);

        });
    })

//Create router for Updating role.
.put(passport.authenticate('jwt', { session: false }), function(req, res) {

    console.log('PUT /batchcategories/:batchcategoryId');

    var batchcategoryId = req.params.batchcategoryId;

    Batchcategory.findOne({ id: batchcategoryId }, function(err, batchcategory) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        var myDateString = Date();
        if (batchcategory) {
            batchcategory.category = req.body.category;
            batchcategory.updated_by = req.body.updated_by;
            batchcategory.updated_at = myDateString

            batchcategory.save();

            res.json(batchcategory);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})
module.exports = batchcategoryRouter;