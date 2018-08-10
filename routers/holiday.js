const express = require('express');
const holidayRoutes = express.Router();
const { Holiday, WeeklyOff } = require('../models/holiday');
const checkAuth = require('../middlewear/check-auth');

holidayRoutes
    .route("/holiday")
    .post(checkAuth, (req, res) => {
       // console.log(req.body);
        const getDay = new Date(req.body.date);

        const weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

        const day = weekday[getDay.getDay()];

        const holiday = new Holiday({
            'date': req.body.date,
            'day': day,
            'description': req.body.description,
            'created_by': req.userData._id,
            'updated_by': null,
            'status': true,
            'state': true
        });

        holiday.save()
            .then(result => {
                res.status(200).json({
                    success: true,
                    holiday: result
                });
            })
            .catch(err => {
               // console.log(err);
                res.status(500).json({
                    success: false,
                    error: err
                });
            });
    })

.get(checkAuth, (req, res) => {
    Holiday.find()
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                holiday: result
            });
        })
        .catch(err => {
           // console.log(err);
            res.status(500).json({
                success: false,
                error: err
            });
        });
});

holidayRoutes
    .route("/holiday-update/:holidayId")
    .put(checkAuth, (req, res) => {
        const id = req.params.holidayId;

        const getDay = new Date(req.body.date);

        const weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

        const day = weekday[getDay.getDay()];

        Holiday.findById(id)
            .exec()
            .then(docs => {
                if (docs) {
                    docs.date = req.body.date;
                    docs.description = req.body.description;
                    docs.day = day;
                    docs.updated_by = req.userData._id;
                    docs.status = req.body.status;
                    docs.state = req.body.state;

                    Holiday.update({ _id: id }, { $set: docs })
                        .then(result => {
                            res.status(200).json({
                                success: true,
                                holiday: docs
                            });
                        })
                        .catch(err => {
                           // console.log(err);
                            res.status(500).json({
                                success: false,
                                error: err
                            });
                        });
                }
            })
            .catch(err => {
               // console.log(err);
                res.status(500).json({
                    success: false,
                    error: err
                });
            });
    });


holidayRoutes
    .route("/weekly-off")
    .post(checkAuth, (req, res) => {
        const body = req.body;
        const weeklyOff = new WeeklyOff({
            'off_day': req.body.off_day,
            'created_by': req.userData._id,
            'updated_by': null,
            'status': true,
            'state': true
        });
        weeklyOff.save()
            .then(result => {
                res.status(200).json({
                    success: true,
                    weeklyOff: result
                });
            })
            .catch(err => {
               // console.log(err);
                res.status(500).json({
                    success: false,
                    error: err
                });
            });
    })

/*
 * GET WeeklyOff Days
 */
.get(checkAuth, (req, res) => {
    WeeklyOff.find({ state: true })
        .then(result => {
            res.status(200).json({
                success: true,
                weeklyOff: result
            });
        })
        .catch(err => {
           // console.log(err);
            res.status(500).json({
                success: false,
                error: err
            });
        });
});

/**
 * PUT WeeklyOff Day
 */
holidayRoutes
    .route("/weekly-offs/:weeklyOffId")
    .put(checkAuth, (req, res) => {
        const id = req.params.weeklyOffId;
        const body = req.body;

        WeeklyOff.findById(id)
            .exec()
            .then(docs => {
                if (docs) {
                    docs.off_day = body.off_day;
                    docs.updated_by = req.userData._id;
                    docs.status = true;
                    docs.state = true;

                    WeeklyOff.update({ _id: id }, { $set: docs })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                success: true,
                                weeklyOff: docs
                            });
                        })
                        .catch(err => {
                           // console.log(err);
                            res.state(500).json({
                                success: false,
                                error: err
                            });
                        });
                }
            })
            .catch(err => {
               // console.log(err);
                res.status(500).json({
                    success: false,
                    errror: err
                });
            });

    });



module.exports = holidayRoutes;