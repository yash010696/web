var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Batchsubcategory = require('../models/batchsubcategory');
var Verifytoken = require('./loginadmin');
var batchsubcategoryRouter = express.Router();

//Create router for  register the new role.
batchsubcategoryRouter
    .route('/batchsubcategory')
    .post(passport.authenticate('jwt', { session: false}),function (req, res) {
      

        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          
          var counter;

          Batchsubcategory.find().exec(function (err, results) {
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
          var batchsubcategory = new Batchsubcategory({
              id:cc,
              batchcategory:req.body.batchcategory,
              subcategory: req.body.subcategory,
              created_by:req.body.created_by,
              created_at:myDateString,
              updated_by:null,
              updated_at:myDateString,
              status:true
            });
            batchsubcategory.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({ success: true, msg: 'Successful created new batchsubcategory.' });
          });
    
        }
      
    })


//Create router for fetching All roles.
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {


    // Batchsubcategory.find(function (err, batchsubcategories) {

    //   if (err) {
    //     res.status(500).send(err);
    //     return;
    //   }
    //   console.log(batchsubcategories);
    //   res.json(batchsubcategories);
    // });
    Batchsubcategory.
    find().
    populate('batchcategory').
    exec(function (err, batchsubcategories) {
        if (err) {
      res.status(500).send(err);
      return;
    }
      console.log('The Batchsubcategory  is %s', batchsubcategories);
      res.json(batchsubcategories);
    });


  });

//Create router for fetching Single role.
batchsubcategoryRouter
  .route('/batchsubcategories/:batchsubcategoryId')
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('GET /batchsubcategories/:batchsubcategoryId');

    var batchsubcategoryId = req.params.batchsubcategoryId;

    // Batchsubcategory.findOne({ id: batchsubcategoryId }, function (err, batchsubcategory) {

    //   if (err) {
    //     res.status(500).send(err);
    //     return;
    //   }

    //   console.log(batchsubcategory);

    //   res.json(batchsubcategory);

    // });
    Batchsubcategory.
    findOne({ id: batchsubcategoryId }).
      populate('batchcategory').
      exec(function (err, batchsubcategory) {
          if (err) {
        res.status(500).send(err);
        return;
      }
        console.log('The Batchsubcategory  is %s', batchsubcategory);
        res.json(batchsubcategory);
      });


  })

  //Create router for Updating role.
  .put(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('PUT /batchsubcategories/:batchsubcategoryId');

    var batchsubcategoryId = req.params.batchsubcategoryId;

    Batchsubcategory.findOne({ id: batchsubcategoryId }, function (err, batchsubcategory) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      if (batchsubcategory) {
        batchsubcategory.subcategory = req.body.subcategory;
        batchsubcategory.updated_by = req.body.updated_by;
        batchsubcategory.updated_at =myDateString
        
        batchsubcategory.save();

        res.json(batchsubcategory);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  module.exports = batchsubcategoryRouter;