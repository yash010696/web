const express = require('express');
const paymentAdjustmentRoutes = express.Router();
const PaymentAdjustment = require('../models/payment-adjustment');
const checkAuth = require('../middlewear/check-auth');

paymentAdjustmentRoutes
    .route("/payment-adjustment")
    .post(checkAuth, (req, res) => {
        const paymentAdjustment = new PaymentAdjustment({
            adjustment_reason: req.body.adjustment_reason,
            code: req.body.code,
            created_by: req.userData._id,
            created_at: Date(),
            updated_by: null,
            status: true,
            state: true,
        });
        paymentAdjustment
            .save()
            .then(result => {
                res.status(201).json({
                    data: paymentAdjustment,
                    message: "Created successfully",
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    })
    .get(checkAuth, (req, res) => {
        PaymentAdjustment.find({ state: true })
            .exec()
            .then(result => {
                res.status(200).json({
                    Success:true,
                    data: result
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

paymentAdjustmentRoutes
    .route("/update-payment-adjustment/:_id")
    .put(checkAuth, (req, res) => {
        const paymentAdjustmentId = req.params._id;

        PaymentAdjustment.findOne({ _id: paymentAdjustmentId }, (err, paymentResult) => {
            if (err) {
                res.status(500).send(err);
                return;
            } else {
                if (paymentResult) {
                    paymentResult.adjustment_reason = req.body.adjustment_reason,
                        paymentResult.code = req.body.code.toUpperCase(),
                        paymentResult.updated_by = req.userData._id,
                        paymentResult.status = req.body.status,
                        paymentResult.updated_at = Date(),
                        paymentResult.save();
                    res.status(200).json({
                        data: paymentResult,
                        message: "Payment Reason updated",
                    });
                    return;
                }
            }
        });
    });

paymentAdjustmentRoutes
    .route("/update-state-payment-adjustment/:_id")
    .put(checkAuth, (req, res) => {
        const paymentAdjustmentId = req.params._id;
        PaymentAdjustment.findOne({ _id: paymentAdjustmentId }, function(err, paymentRes) {
            if (err) {
                res.status(500).send({ error: err });
                return;
            }
            if (paymentRes) {
                paymentRes.state = false;

                paymentRes.save();
                res.json(paymentRes);
                return;
            }
            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    });

module.exports = paymentAdjustmentRoutes;