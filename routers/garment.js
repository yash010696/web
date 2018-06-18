var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Garment = require('../models/garment');
var Verifytoken = require('./loginadmin');
var garmentRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');

//Create router for  register the new subservice.
garmentRouter
  .route('/garment')
  .post(checkAuth, function (req, res) {
    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else {
      var counter;
      Garment.find().exec(function (err, results) {
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
      var code = req.body.code.toUpperCase();
      var garment = new Garment({
        id: cc,
        name: req.body.name,
        code: code,
        // service_Id:req.body.service_Id,
        // subservice_Id:req.body.subservice_Id,
        created_by: req.userData._id,
        created_at: myDateString,
        updated_by: null,
        updated_at: myDateString,
        status: true,
        state: true
      });
      garment.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.json({ data: garment, success: true, msg: 'Successful created new Garment.' });
      });
    }
  })
  //Create router for fetching All subservice.
  .get(checkAuth, function (req, res) {
    Garment.find({ state: true }, function (err, garments) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(garments);
      res.json(garments);
    });
  });

garmentRouter.route('/pos/garments')
  .get(checkAuth, function (req, res) {
    Garment.find({ status: true }, function (err, garment) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(garment);
    })
  });

//Create router for fetching Single subservice.
garmentRouter
  .route('/garments/:garmentId')
  .get(checkAuth, function (req, res) {
    console.log('GET /Garment/:GarmentId');
    var garmentId = req.params.garmentId;
    Garment.findOne({ id: garmentId }, function (err, garment) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(garment);
      res.json(garment);
    });
  })
  //Create router for Updating subservice.
  .put(checkAuth, function (req, res) {
    console.log('PUT /garment/:garmentId');
    var garmentId = req.params.garmentId;
    Garment.findOne({ _id: garmentId }, function (err, garment) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      var code = req.body.code.toUpperCase();
      if (garment) {
        garment.name = req.body.name,
        garment.code = code,
        garment.status = req.body.status;
        garment.updated_by = req.userData._id;
        garment.updated_at = myDateString
        garment.save();
        res.json(garment);
        return;
      }
      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
garmentRouter
  .route('/garmentss/:garmentId')
  .put(checkAuth, function (req, res) {
    console.log('PUT /garmentss/:garmentId');
    var garmentId = req.params.garmentId;
    Garment.findOne({ _id: garmentId }, function (err, garment) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (garment) {
        garment.state = false;

        garment.save();
        res.json(garment);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
module.exports = garmentRouter;