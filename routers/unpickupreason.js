var express = require('express');
const config = require('../config/config');
// var passport = require('passport');
// require('../config/passport')(passport);
// var jwt = require('jsonwebtoken');
var Unpickupreason = require('../models/unpickupreason');
// var Verifytoken = require('./loginadmin');
var unpickupreasonRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');

//Create router for  register the new area.
unpickupreasonRouter
    .route('/unpickupreason')
    .post(checkAuth, function (req, res) {
        // Validate request
        if (!req.body) {
            return res.status(400).send({
                message: "Reason can not be empty"
            });
        }
        // Create a Reason
        const reason = new Unpickupreason({
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
        Unpickupreason.find()
            .then(reasons => {
                res.send(reasons);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving reason."
                });
            });
    });

    unpickupreasonRouter
    .route('/aunpickupreason')
    .get(checkAuth, function (req, res) {
        Unpickupreason.find({ status: true, state: true })
            .then(reasons => {
                res.json({unpickupreason:reasons});
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving active reason."
                });
            });
    });
    unpickupreasonRouter
    .route('/unpickupreasons/:reasonId')
    .get(checkAuth, function (req, res) {
       // console.log('GET /areas/:areaId');
        var reasonId = req.params.reasonId;
        Unpickupreason.findOne({ id: reasonId }, function (err, reason) {
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
        Unpickupreason.findByIdAndUpdate(req.params.reasonId, {
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
    unpickupreasonRouter
    .route('/unpickupreasonss/:reasonId')
    .put(checkAuth, function (req, res) {
        // Find reason and update it with the request body
        Unpickupreason.findByIdAndUpdate(req.params.reasonId, {
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
module.exports = unpickupreasonRouter;