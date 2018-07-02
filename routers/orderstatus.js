var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Orderstatus = require('../models/orderstatus');
var Verifytoken = require('./loginadmin');
var orderstatusRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');

//Create router for  register the new role.
orderstatusRouter
    .route('/orderstatus')
    .post(checkAuth, function(req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            var counter;
            Orderstatus.find().exec(function(err, results) {
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
            var orderstatus = new Orderstatus({
                // id: cc,
                status_Name: req.body.status_Name,
                created_by: req.body.created_by,
                created_at: myDateString,
                updated_by: null,
                updated_at: myDateString,
                status: true,
                state: true
            });
            orderstatus.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: orderstatus, success: true, msg: 'Successful created new orderstatus.' });
            });
        }
    })


//Create router for fetching All roles.
.get(checkAuth, function(req, res) {


    Orderstatus.find({ state: true }, function(err, roles) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(roles);
    });

});

//Create router for fetching Single role.
orderstatusRouter
    .route('/orderstatuses/:orderstatusId')
    .get(checkAuth, function(req, res) {

        var orderstatusId = req.params.orderstatusId;

        Orderstatus.findOne({ id: orderstatusId }, function(err, orderstatus) {

            if (err) {
                res.status(500).send(err);
                return;
            }

            console.log(orderstatus);

            res.json(orderstatus);

        });
    })

//Create router for Updating role.
.put(checkAuth, function(req, res) {

    var orderstatusId = req.params.orderstatusId;

    Orderstatus.findOne({ _id: orderstatusId }, function(err, orderstatus) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        var myDateString = Date();
        if (orderstatus) {
            orderstatus.status_Name = req.body.status_Name;
            orderstatus.updated_by = req.body.updated_by;
            orderstatus.status = req.body.status;
            orderstatus.updated_at = myDateString

            orderstatus.save();

            res.json(orderstatus);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})

orderstatusRouter
    .route('/orderstatusess/:orderstatusId')
    .put(checkAuth, function(req, res) {
        const orderstatusId = req.params.orderstatusId;
        Orderstatus.findOne({ _id: orderstatusId }, function(err, orderstatus) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }
            if (orderstatus) {
                orderstatus.state = false;

                orderstatus.save();
                res.json(orderstatus);
                return;
            }
            res.status(404).json({
                error: 'Unable to found.'
            });
        });
    })
module.exports = orderstatusRouter;