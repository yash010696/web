var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Price = require('../models/price');
var Service = require('./service');
var Subservice = require('./subservice');
// var Servicecategory = require('./servicecategory');
var Servicetype = require('./servicetype');
var Verifytoken = require('./loginadmin');
var priceRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
//Create router for  register the new subservice.
priceRouter
    .route('/price')
    .post(checkAuth, function(req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            var counter;
            Price.find().exec(function(err, results) {
                var count = results.length;
                counter = count + 1;
                savedata(counter);
            });
        }

        function savedata(counter) {
            var myDateString = Date();
            var cc = counter;
            var price = new Price({
                id: cc,
                price: req.body.price,
                servicetype: req.body.servicetype,
                service: req.body.service,
                subservice: req.body.subservice,
                // servicecategory: req.body.servicecategory,
                garment: req.body.garment,
                created_by: req.userData._id,
                created_at: myDateString,
                updated_by: null,
                updated_at: myDateString,
                status: true,
                state: true
            });
            price.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                Price.findById({
                        _id: price._id
                    })
                    .populate('servicetype service subservice servicecategory garment').exec(function(error, pricelist) {
                        if (error) {
                            res.status(400).json({
                                error: err
                            });
                            return;
                        }
                        res.json({
                            data: pricelist,
                            success: true,
                            msg: 'Successful created new.'
                        });
                    });
                // res.json({ data: price, success: true, msg: 'Successful created new.' });
            });
        }
    })

.get(checkAuth, function(req, res) {
    Price.
    find({ state: true }).
    populate('servicetype service subservice garment').
    exec(function(err, prices) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(prices);
    });
});

priceRouter
    .route('/pos/pricedetails/:serviceid/:subserviceid/:servicetypeid')
    .get(checkAuth, function(req, res) {

        var serviceId = req.params.serviceid;
        var subserviceId = req.params.subserviceid;
        var servicetypeId = req.params.servicetypeid;
        Price.find({ service: serviceId, subservice: subserviceId, servicetype: servicetypeId })
            .populate('servicetype service subservice garment').exec(function(error, pricelist) {
                if (error) {
                    res.status(404).send(error);
                    return;
                }
                res.send(pricelist);
            })
    });

//Create router for fetching Single subservice.
priceRouter
    .route('/prices/:priceId')
    .get(checkAuth, function(req, res) {
        const priceId = req.params.priceId;

        Price.
        findOne({ id: priceId }).
        populate('servicetype service subservice garment').
        exec(function(err, price) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(price);
        });
    })

//Create router for Updating subservice.
.put(checkAuth, function(req, res) {
    const priceId = req.params.priceId;

    Price.findOne({ _id: priceId }, function(err, price) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        var myDateString = Date();
        if (price) {

            price.servicetype = req.body.servicetype,
                price.service = req.body.service,
                price.subservice = req.body.subservice,
                // price.servicecategory = req.body.servicecategory,
                price.garment = req.body.garment,
                price.price = req.body.price,
                price.status = req.body.status;
            price.updated_by = req.userData._id;
            price.updated_at = myDateString

            price.save();
            setTimeout(() => {

                Price.findOne({
                        _id: priceId
                    })
                    .populate('servicetype service subservice servicecategory garment').exec(function(error, pricelist) {
                        if (error) {
                            return res.status(400).json({
                                error: err
                            });
                        } else {
                            const obj = {
                                "_id": price._id,
                                "id": price.id,
                                "service": price.service,
                                "garment": pricelist.garment,
                                "price": price.price,
                                "status": price.status,
                                "updated_by": price.updated_by,
                                "updated_at": price.updated_at,
                                "created_at": price.created_at,
                                "created_by": price.created_by,
                                "servicetype": pricelist.servicetype,
                                "service": pricelist.service,
                                "subservice": pricelist.subservice
                            };
                            return res.json(obj);
                        }
                    });
            });
        }
    });
})

priceRouter
    .route('/pricess/:priceId')
    .put(passport.authenticate('jwt', { session: false }), function(req, res) {
        const priceId = req.params.priceId;
        Price.findOne({ _id: priceId }, function(err, price) {
            if (err) {
                res.status(500).send({ error: err });
                return;
            }
            if (price) {
                price.state = false;

                price.save();
                res.json(price);
                return;
            }

            res.status(404).json({
                error: 'Unable to found.'
            });
        });
    })

module.exports = priceRouter;