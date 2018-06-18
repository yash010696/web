var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Batch = require('../models/batch');
var Verifytoken = require('./loginadmin');
var batchRouter = express.Router();

//Create router for  register the new role.
batchRouter
    .route('/batch')
    .post(passport.authenticate('jwt', { session: false }), function(req, res) {


        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {

            var counter;

            Batch.find().exec(function(err, results) {
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
            var batch = new Batch({
                id: cc,
                batchcategory: req.body.batchcategory,
                batchsubcategory: req.body.batchsubcategory,
                batchprogram: req.body.batchprogram,
                no_Of_Pieces: req.body.no_Of_Pieces,
                weight: req.body.weight,
                temperature: req.body.temperature,
                dosage: req.body.dosage,
                batch_Status: req.body.batch_Status,
                created_by: req.body.created_by,
                created_at: myDateString,
                updated_by: null,
                updated_at: myDateString
            });
            batch.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: batch, success: true, msg: 'Successful created new batch.' });
            });

        }

    })


//Create router for fetching All roles.
.get(passport.authenticate('jwt', { session: false }), function(req, res) {


    // Batch.find(function (err, batches) {

    //   if (err) {
    //     res.status(500).send(err);
    //     return;
    //   }
    //   console.log(batches);
    //   res.json(batches);
    // });
    Batch.
    find().
    populate('batchcategory batchsubcategory batchprogram').
    exec(function(err, batches) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log('The Batch  is %s', batches);
        res.json(batches);
    });
});

//Create router for fetching Single role.
batchRouter
    .route('/batches/:batchId')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {

        console.log('GET /batchsubcategories/:batchId');

        var batchId = req.params.batchId;

        // Batch.findOne({ id: batchId }, function (err, batch) {

        //   if (err) {
        //     res.status(500).send(err);
        //     return;
        //   }

        //   console.log(batch);

        //   res.json(batch);

        // });
        Batch.
        findOne({ id: batchId }).
        populate('batchcategory batchsubcategory batchprogram').
        exec(function(err, batch) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            console.log('The Batch  is %s', batch);
            res.json(batch);
        });

    })

//Create router for Updating role.
.put(passport.authenticate('jwt', { session: false }), function(req, res) {

    console.log('PUT /batches/:batchId');

    var batchId = req.params.batchId;

    Batch.findOne({ id: batchId }, function(err, batch) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        var myDateString = Date();
        if (batch) {
            batch.batch_Status = req.body.batch_Status;
            batch.updated_by = req.body.updated_by;
            batch.updated_at = myDateString

            batch.save();

            res.json(batch);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})
module.exports = batchRouter;