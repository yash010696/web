var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Gst = require('../models/gst');
var Verifytoken = require('./loginadmin');
var gstRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
//Create router for  register the new area.
gstRouter
  .route('/gst')
  .post(checkAuth, function (req, res) {
    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else {
      var counter;
      Gst.find().exec(function (err, results) {
        var count = results.length;
        counter = count + 1;
        savedata(counter);
      });
    }
    function savedata(counter) {
      var cc = counter;
      var gst = new Gst({
        id: cc,
        CGST: req.body.CGST,
        SGST: req.body.SGST,
        // IGST: req.body.IGST,
        GST: req.body.GST,
        created_by: req.userData._id,
        updated_by: null,
        status: true,
        state: true
      });
      gst.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.json({data: gst, success: true, msg: 'Successful created new gst.' });
      });
    }
  })
  //Create router for fetching All areas.
  .get(checkAuth, function (req, res) {
    Gst.find({ state: true },function (err, gsts) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(gsts);
      res.json(gsts);
    });
  });
  gstRouter
  .route('/gsts/:gstId')
  .get(checkAuth, function (req, res) {
    console.log('GET /gsts/:gstId');
    var gstId = req.params.gstId;
    Gst.findOne({ id: gstId }, function (err, gst) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(gst);
      res.json(gst);
    });
  })
  .put(checkAuth, function (req, res) {
    console.log('PUT /gsts/:gstId');
    var gstId = req.params.gstId;
    Gst.findOne({ _id: gstId }, function (err, gst) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (gst) {
        gst.CGST = req.body.CGST;
        gst.SGST = req.body.SGST;
        // gst.IGST = req.body.IGST;
        gst.GST = req.body.GST;
        gst.status = req.body.status;
        gst.updated_by = req.userData._id;
        gst.save();
        res.json(gst);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  gstRouter
  .route('/gstss/:gstId')
  .put(checkAuth, function (req, res) {
    console.log('PUT /gstss/:gstId');
    var gstId = req.params.gstId;
    Gst.findOne({ _id: gstId }, function (err, gst) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (gst) {
        gst.state = false;
       
        gst.save();
        res.json(gst);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
module.exports = gstRouter;