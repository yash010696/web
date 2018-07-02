var express = require('express');
const config = require('../config/config');
var passport = require('passport');
// require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Servicetype = require('../models/servicetype');
var Verifytoken = require('./loginadmin');
var servicetypeRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');


//Create router for  register the new role.
servicetypeRouter
  .route('/servicetype')
  .post(checkAuth, function (req, res) {
    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else {
      var counter;
      Servicetype.find().exec(function (err, results) {
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
      var servicetype = new Servicetype({
        // id: cc,
        type: req.body.type,
        code: code,
        no_Of_Days: req.body.no_Of_Days,
        created_by: req.userData._id,
        created_at: myDateString,
        updated_by: null,
        updated_at: myDateString,
        status: true
      });
      servicetype.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.json({data: servicetype,success: true, msg: 'Successful created new servicetype.' });
      });
    }
  })
  //Create router for fetching All roles.
  .get(checkAuth, function (req, res) {
    Servicetype.find(function (err, servicetypes) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(servicetypes);
      res.json(servicetypes);
    });
  });
//Create router for fetching Single role.
servicetypeRouter
  .route('/servicetypes/:servicetypeId')
  .get(checkAuth, function (req, res) {
    console.log('GET /Servicetype/:servicetypeId');
    var servicetypeId = req.params.servicetypeId;
    Servicetype.findOne({ id: servicetypeId }, function (err, servicetype) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(servicetype);
      res.json(servicetype);
    });
  })

  //Create router for Updating role.
  .put(checkAuth, function (req, res) {
    console.log('PUT /servicetypes/:servicetypeId');
    var servicetypeId = req.params.servicetypeId;
    Servicetype.findOne({ _id: servicetypeId }, function (err, servicetype) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      var code = req.body.code.toUpperCase();
      if (servicetype) {
        servicetype.type = req.body.type;
        servicetype.code = code;
        servicetype.no_Of_Days = req.body.no_Of_Days;
        servicetype.status = req.body.status;
        servicetype.updated_by = req.userData._id;
        servicetype.updated_at = myDateString
        servicetype.save();
        res.json(servicetype);
        return;
      }
      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
module.exports = servicetypeRouter;