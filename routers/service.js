var express = require('express');
const config = require('../config/config');
var passport = require('passport');
// require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Service = require('../models/service');
var Verifytoken = require('./loginadmin');
var serviceRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const uploads = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Create router for  register the new service.
serviceRouter
    .route('/service')
    .post(checkAuth, uploads.single("serviceImage"), function (req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            var counter;
            Service.find().exec(function (err, results) {
                var count = results.length;
                counter = count + 1;
                savedata(counter);
            });
        }

        function savedata(counter) {
            var myDateString = Date();
            // var cc = counter;
            var code = req.body.code.toUpperCase();
            let filePath = "";
            if (req.file === undefined) {
                filePath = req.body.serviceImage;
            } else {
                filePath = req.file.path;
            }
            var service = new Service({
                // id: cc,
                name: req.body.name,
                code: code,
                description: req.body.description,
                has_Sub_Service: true,
                created_by: req.userData._id,
                created_at: myDateString,
                updated_by: null,
                updated_at: myDateString,
                status: true,
                state: true,
                serviceImage: filePath
            });
            service.save(function (err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: service, success: true, msg: 'Successful created new service.' });
            });
        }
    })

    //Create router for fetching All services.
    .get(checkAuth, function (req, res) {
        Service.find({ state: true }, function (err, services) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(services);
        });
    });

serviceRouter
    .route('/pos/services')
    .get(checkAuth, function (req, res) {
        Service.find({ status: true }, function (err, service) {
            if (err) {
                res.status(404).send(err);
                return;
            }
            res.json(service);
        })
    });

//Create router for fetching Single service.
serviceRouter
    .route('/services/:serviceId')
    .get(checkAuth, function (req, res) {
        var serviceId = req.params.serviceId;
        Service.findOne({ id: serviceId }, function (err, service) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(service);
        });
    })
    //Create router for Updating service.
    .put(checkAuth, uploads.single("serviceImage"), function (req, res) {
        const serviceId = req.body._id;
        Service.findOne({ _id: serviceId }, function (err, service) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            var myDateString = Date();
            const code = req.body.code.toUpperCase();
            let filePath = "";
            if (service) {
                if (req.file === undefined) {
                    filePath = service.serviceImage;
                } else {
                    filePath = req.file.path;
                }
                service.name = req.body.name,
                    service.code = code,
                    service.description = req.body.description,
                    service.status = req.body.status;
                service.updated_by = req.userData._id;
                service.updated_at = myDateString;
                service.serviceImage = filePath;
                service.save();
                res.json(service);
                return;
            }
            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
serviceRouter
    .route('/servicess/:serviceId')
    .put(checkAuth, function (req, res) {
        var serviceId = req.params.serviceId;
        Service.findOne({ _id: serviceId }, function (err, service) {
            if (err) {
                res.status(500).send({ error: err });
                return;
            }
            if (service) {
                service.state = false;

                service.save();
                res.json(service);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
module.exports = serviceRouter;