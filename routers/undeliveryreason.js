var express = require('express');
const config = require('../config/config');
// var passport = require('passport');
// require('../config/passport')(passport);
// var jwt = require('jsonwebtoken');
var Undeliveryreason = require('../models/undeliveryreason');
// var Verifytoken = require('./loginadmin');
var undeliveryreasonRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');

//Create router for  register the new area.
undeliveryreasonRouter
    .route('/undeliveryreason')
    .post(checkAuth, function (req, res) {
        // Validate request
        if (!req.body) {
            return res.status(400).send({
                message: "Reason can not be empty"
            });
        }
        // Create a Reason
        const reason = new Undeliveryreason({
            reason_name: req.body.reason_name || "Untitled Reason",
            created_by: req.userData._id,
            updated_by: null,
            status: true,
            state: true
        });
        // Save Reason in the database
        reason.save()
            .then(data => {
                res.status(200).json({
                    data: data,
                    success: true, msg: 'Successful created new request cancel reason.'
                });
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Note."
                });
            });
    })
    //Create router for fetching All areas.
    .get(checkAuth, function (req, res) {
        Undeliveryreason.find()
            .then(reasons => {
                res.send(reasons);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving reason."
                });
            });
    });

undeliveryreasonRouter
    .route('/aundeliveryreason')
    .get(checkAuth, function (req, res) {
        Undeliveryreason.find({ status: true, state: true })
            .then(reasons => {
                res.json({undeliveryreason:reasons});
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving active reason."
                });
            });
    });
undeliveryreasonRouter
    .route('/undeliveryreasons/:reasonId')
    .get(checkAuth, function (req, res) {
       // console.log('GET /areas/:areaId');
        var reasonId = req.params.reasonId;
        Undeliveryreason.findOne({ id: reasonId }, function (err, reason) {
            if (err) {
                res.status(500).send(err);
                return;
            }
           // console.log(reason);
            res.json(reason);
        });
    })
    .put(checkAuth, function (req, res) {
        // Validate Request
        if (!req.body) {
            return res.status(400).send({
                message: "Reason can not be empty"
            });
        }
        // Find reason and update it with the request body
        Undeliveryreason.findByIdAndUpdate(req.params.reasonId, {
            reason_name: req.body.reason_name || "Untitled reason",
            status: req.body.status,
            updated_by: req.userData._id
        }, { new: true })
            .then(reason => {
                if (!reason) {
                    return res.status(404).send({
                        message: "Reason not found with id " + req.params.reasonId
                    });
                }
                res.send(reason);
            }).catch(err => {
                return res.status(500).send({
                    message: "Error updating reason with id " + req.params.reasonId
                });
            });

    })
undeliveryreasonRouter
    .route('/undeliveryreasonss/:reasonId')
    .put(checkAuth, function (req, res) {
        // Find reason and update it with the request body
        Undeliveryreason.findByIdAndUpdate(req.params.reasonId, {
            state: false,
            updated_by: req.userData._id
        }, { new: true })
            .then(reason => {
                if (!reason) {
                    return res.status(404).send({
                        message: "Reason not found with id " + req.params.reasonId
                    });
                }
                res.send(reason);
            }).catch(err => {
                return res.status(500).send({
                    message: "Error disabling reason with id " + req.params.reasonId
                });
            });
    })
module.exports = undeliveryreasonRouter;