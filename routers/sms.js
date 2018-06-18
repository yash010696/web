var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Sms = require('../models/sms');
var Verifytoken = require('./loginadmin');
var smsRouter = express.Router();


///Create router for  register the new user.
smsRouter
.route('/sms')
.post(passport.authenticate('jwt', { session: false}),function (req, res) {
  

    if (!req.body) {
        res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else { 
      
      var counter;

      Sms.find().exec(function (err, results) {
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
      var sms = new Sms({
          id:cc,
          message: req.body.message,
          // customer_Id:req.body.customer_Id,
          // order_Id:req.body.order_Id,
          created_by:req.body.created_by,
          created_at:myDateString,
          updated_by:req.body.updated_by,
          updated_at:req.body.updated_at,
          status:true
        });
        sms.save(function (err) {
          if (err) {
              res.status(400).send(err);
              return;
          }
          res.json({ success: true, msg: 'Successful created new customerfeedback.' });
      });

    }
  
})


//Create router for fetching All subservice.
.get(passport.authenticate('jwt', { session: false}),function (req, res) {


  Sms.find(function (err, smses) {

  if (err) {
    res.status(500).send(err);
    return;
  }
  console.log(smses);
  res.json(smses);
});

});

//Create router for fetching Single user.
smsRouter
.route('/smss/:smsId')
.get(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('GET /smss/:smsId');

var smsId = req.params.smsId;

Sms.findOne({ id: smsId }, function (err, sms) {

  if (err) {
    res.status(500).send(err);
    return;
  }

  console.log(sms);

  res.json(sms);

});
})

//Create router for Updating .
.put(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('PUT /smss/:smsId');

var smsId = req.params.smsId;

Sms.findOne({ id: smsId }, function (err, sms) {

  if (err) {
    res.status(500).send(err);
    return;
  }
  var myDateString = Date();
  if (sms) {
    sms.status = req.body.status;
    sms.updated_by = req.body.updated_by;
    sms.updated_at = req.body.updated_at;
    sms.save();

    res.json(sms);
    return;
  }

  res.status(404).json({
    message: 'Unable to found.'
  });
});
})
module.exports = smsRouter;