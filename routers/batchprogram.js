var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Batchprogram = require('../models/batchprogram');
var Verifytoken = require('./loginadmin');
var batchprogramRouter = express.Router();

//Create router for  register the new role.
batchprogramRouter
    .route('/batchprogram')
    .post(passport.authenticate('jwt', { session: false}),function (req, res) {
      

        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          
          var counter;

          Batchprogram.find().exec(function (err, results) {
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
          var batchprogram = new Batchprogram({
              id:cc,
              code:req.body.code,
              program: req.body.program,
              created_by:req.body.created_by,
              created_at:myDateString,
              updated_by:null,
              updated_at:myDateString,
              status:true
            });
            batchprogram.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({ success: true, msg: 'Successful created new batchprogram.' });
          });
    
        }
      
    })


//Create router for fetching All roles.
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {


    Batchprogram.find(function (err, batchprograms) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(batchprograms);
      res.json(batchprograms);
    });

  });

//Create router for fetching Single role.
batchprogramRouter
  .route('/batchprograms/:batchprogramId')
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('GET /batchsubcategories/:batchprogramId');

    var batchprogramId = req.params.batchprogramId;

    Batchprogram.findOne({ id: batchprogramId }, function (err, batchprogram) {

      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log(batchprogram);

      res.json(batchprogram);

    });
  })

  //Create router for Updating role.
  .put(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('PUT /batchprograms/:batchprogramId');

    var batchprogramId = req.params.batchprogramId;

    Batchprogram.findOne({ id: batchprogramId }, function (err, batchprogram) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      if (batchprogram) {
        batchprogram.code = req.body.code;
        batchprogram.updated_by = req.body.updated_by;
        batchprogram.updated_at =myDateString
        
        batchprogram.save();

        res.json(batchprogram);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  module.exports = batchprogramRouter;