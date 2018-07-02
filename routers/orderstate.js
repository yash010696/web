var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Orderstate = require('../models/orderstate');
var Verifytoken = require('./loginadmin');
var orderstateRouter = express.Router();

//Create router for  register the new role.
orderstateRouter
    .route('/orderstate')
    .post(passport.authenticate('jwt', { session: false}),function (req, res) {
      

        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          
          var counter;

          Orderstate.find().exec(function (err, results) {
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
          var orderstate = new Orderstate({
              // id:cc,
              state: req.body.state,
              created_by:req.body.created_by,
              created_at:myDateString,
              updated_by:null,
              updated_at:myDateString,
              status:true
            });
            orderstate.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({ success: true, msg: 'Successful created new orderstate.' });
          });
    
        }
      
    })


//Create router for fetching All roles.
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {


    Orderstate.find(function (err, orderstates) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(orderstates);
      res.json(orderstates);
    });

  });

//Create router for fetching Single role.
orderstateRouter
  .route('/orderstates/:orderstateId')
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('GET /orderstates/:orderstateId');

    var orderstateId = req.params.orderstateId;

    Orderstate.findOne({ id: orderstateId }, function (err, orderstate) {

      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log(orderstate);

      res.json(orderstate);

    });
  })

  //Create router for Updating role.
  .put(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('PUT /orderstates/:orderstateId');

    var orderstateId = req.params.orderstateId;

    Orderstate.findOne({ id: orderstateId }, function (err, orderstate) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      if (orderstate) {
        orderstate.state = req.body.state;
        orderstate.updated_by = req.body.updated_by;
        orderstate.updated_at =myDateString
        
        orderstate.save();

        res.json(orderstate);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  module.exports = orderstateRouter;