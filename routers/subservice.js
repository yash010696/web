var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Subservice = require('../models/subservice');
var Verifytoken = require('./loginadmin');
var subserviceRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');

//Create router for  register the new subservice.
subserviceRouter
    .route('/subservice')
    .post(checkAuth,function (req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          var counter;
          Subservice.find().exec(function (err, results) {
            var count = results.length;
            counter=count +1;
            savedata(counter);
          });
        }    

        function savedata(counter){
          var myDateString = Date();
          var cc=counter;
           console.log('cc',cc);
          // var area = new Area(req.body);
          var code = req.body.code.toUpperCase();
          var subservice = new Subservice({
              // id:cc,
              name: req.body.name,
              code: code,
              created_by: req.userData._id,
              created_at:myDateString,
              updated_by:null,
              updated_at:myDateString,
              status:true,
              state: true
            });
            subservice.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({data: subservice, success: true, msg: 'Successfully created new subservice.' });
          });
        }
    })

//Create router for fetching All subservice.
  .get(checkAuth,function (req, res) {
    Subservice.find({ state: true },function (err, subservices) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(subservices);
    });
  });

//Create router for fetching Single subservice.
subserviceRouter
  .route('/subservices/:subserviceId')
  .get(checkAuth,function (req, res) {

    console.log('GET /subservice/:subserviceId');

    var subserviceId = req.params.subserviceId;

    Subservice.findOne({ id: subserviceId }, function (err, subservice) {

      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log(subservice);

      res.json(subservice);

    });
  })

  //Create router for Updating subservice.
  .put(checkAuth,function (req, res) {

    console.log('PUT /subservice/:subserviceId');

    var subserviceId = req.params.subserviceId;

    Subservice.findOne({ _id: subserviceId }, function (err, subservice) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      var code = req.body.code.toUpperCase();
      if (subservice) {
        subservice.name= req.body.name,
        subservice.code=code,
        subservice.status = req.body.status;
        subservice.updated_by = req.userData._id;
        subservice.updated_at =myDateString
        
        subservice.save();

        res.json(subservice);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  subserviceRouter
  .route('/subservicess/:subserviceId')
  .put(checkAuth, function (req, res) {
    console.log('PUT /subservicess/:subserviceId');
    var subserviceId = req.params.subserviceId;
    Subservice.findOne({ _id: subserviceId }, function (err, subservice) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (subservice) {
        subservice.state = false;
       
        subservice.save();
        res.json(subservice);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  module.exports = subserviceRouter;