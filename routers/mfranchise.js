var express = require('express');
var Franchise = require('../models/franchise');
var Area = require('../models/area');

var mfranchiseRouter = express.Router();


mfranchiseRouter
    //Create router for fetching All areas with franchises.
    .get('/getarea1', function (req, res) {
        Franchise.
            find({ statee: true }).
            populate('area').
            exec(function (err, franchises) {
                if (err) {
                    res.status(500).send({ err, Success: false });
                }
                res.status(200).json({ franchises });
            });
    });

module.exports = { mfranchiseRouter };