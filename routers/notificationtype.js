var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Notificationtype = require('../models/notificationtype');
var Verifytoken = require('./loginadmin');
var notificationtypeRouter = express.Router();

//Create router for  register the new service.
notificationtypeRouter
    .route('/notificationtype')
    .post(passport.authenticate('jwt', { session: false}),function (req, res) {
      

        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          
          var counter;

          Notificationtype.find().exec(function (err, results) {
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
          var notificationtype = new Notificationtype({
              id:cc,
              notification_Type: req.body.notification_Type,
              created_by:req.body.created_by,
              created_at:myDateString,
              updated_by:req.body.updated_by,
              updated_at:req.body.updated_at,
              status:true
            });
            notificationtype.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({ success: true, msg: 'Successful created new service.' });
          });
    
        }
      
    })


//Create router for fetching All services.
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {


    Notificationtype.find(function (err, notificationtypes) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(notificationtypes);
      res.json(notificationtypes);
    });

  });

//Create router for fetching Single service.
notificationtypeRouter
  .route('/notificationtypes/:notificationtypeId')
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('GET /notificationtypes/:notificationtypeId');

    var notificationtypeId = req.params.notificationtypeId;

    Notificationtype.findOne({ id: notificationtypeId }, function (err, notificationtype) {

      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log(notificationtype);

      res.json(notificationtype);

    });
  })

  //Create router for Updating service.
  .put(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('PUT /notificationtypes/:notificationtypeId');

    var notificationtypeId = req.params.notificationtypeId;

    Notificationtype.findOne({ id: notificationtypeId }, function (err, notificationtype) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      if (notificationtype) {
 
        notificationtype.updated_by = req.body.updated_by;
        notificationtype.updated_at =myDateString
        
        notificationtype.save();

        res.json(notificationtype);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  module.exports = notificationtypeRouter;