var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Workshopacivity = require('../models/workshopactivity');
var Verifytoken = require('./loginadmin');
var workshopacivityRouter = express.Router();

//Create router for  register the new role.
workshopacivityRouter
    .route('/workshopactivity')
    // .post(passport.authenticate('jwt', { session: false}),function (req, res) {
      

    //     if (!req.body) {
    //         res.json({ success: false, msg: 'Please Enter Required Data.' });
    //     } else { 
          
    //       var counter;

    //       Batch.find().exec(function (err, results) {
    //         var count = results.length;
    //         counter=count +1;
    //         savedata(counter);
             
    //       });
            

    //     }    
    //     function savedata(counter){
    //       var myDateString = Date();
    //       var cc=counter;
    //        console.log('cc',cc);
    //       // var area = new Area(req.body);
    //       var workshopactivity = new Batch({
    //           id:cc,
    //           batchcategory_Id:req.body.batchcategory_Id,
    //           batchprogram_Id:req.body.batchprogram_Id,
    //           no_Of_Pieces:req.body.no_Of_Pieces,
    //           weight:req.body.weight,
    //           temperature:req.body.temperature,
    //           dosage:req.body.dosage,
    //           batch_Status:req.body.batch_Status,
    //           created_by:req.body.created_by,
    //           created_at:myDateString,
    //           updated_by:null,
    //           updated_at:myDateString
    //         });
    //         workshopactivity.save(function (err) {
    //           if (err) {
    //               res.status(400).send(err);
    //               return;
    //           }
    //           res.json({ success: true, msg: 'Successful created new workshopactivity.' });
    //       });
    
    //     }
      
    // })


//Create router for fetching All roles.
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {


    Workshopacivity.find(function (err, workshopactivities) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(workshopactivities);
      res.json(workshopactivities);
    });

  });

//Create router for fetching Single role.
workshopacivityRouter
  .route('/workshopactivities/:workshopactivityId')
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('GET /workshopactivities/:workshopactivityId');

    var workshopactivityId = req.params.workshopactivityId;

    Workshopacivity.findOne({ id: workshopactivityId }, function (err, workshopactivity) {

      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log(workshopactivity);

      res.json(workshopactivity);

    });
  })

  //Create router for Updating role.
  .put(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('PUT /workshopactivities/:workshopactivityId');

    var workshopactivityId = req.params.workshopactivityId;

    Workshopacivity.findOne({ id: workshopactivityId }, function (err, workshopactivity) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      if (workshopactivity) {
        workshopactivity.reason = req.body.reason;
        workshopactivity.updated_by = req.body.updated_by;
        workshopactivity.updated_at =myDateString
        
        batch.save();

        res.json(batch);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  module.exports = workshopacivityRouter;