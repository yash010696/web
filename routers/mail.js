var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Mail = require('../models/mail');
var Verifytoken = require('./loginadmin');
var mailRouter = express.Router();


///Create router for  register the new user.
mailRouter
.route('/mail')
.post(passport.authenticate('jwt', { session: false}),function (req, res) {
  

    if (!req.body) {
        res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else { 
      
      var counter;

      Mail.find().exec(function (err, results) {
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
      var mail = new Mail({
          id:cc,
          subject: req.body.subject,
          body: req.body.body,
          // customer_Id:req.body.customer_Id,
          // order_Id:req.body.order_Id,
          created_by:req.body.created_by,
          created_at:myDateString,
          updated_by:req.body.updated_by,
          updated_at:req.body.updated_at,
          status:true
        });
        mail.save(function (err) {
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


  Mail.find(function (err, mails) {

  if (err) {
    res.status(500).send(err);
    return;
  }
  console.log(mails);
  res.json(mails);
});

});

//Create router for fetching Single user.
mailRouter
.route('/smss/:smsId')
.get(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('GET /smss/:smsId');

var smsId = req.params.smsId;

Mail.findOne({ id: smsId }, function (err, mail) {

  if (err) {
    res.status(500).send(err);
    return;
  }

  console.log(mail);

  res.json(mail);

});
})

//Create router for Updating .
.put(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('PUT /smss/:smsId');

var smsId = req.params.smsId;

Mail.findOne({ id: smsId }, function (err, mail) {

  if (err) {
    res.status(500).send(err);
    return;
  }
  var myDateString = Date();
  if (mail) {
    mail.status = req.body.status;
    mail.updated_by = req.body.updated_by;
    mail.updated_at = req.body.updated_at;
    mail.save();

    res.json(mail);
    return;
  }

  res.status(404).json({
    message: 'Unable to found.'
  });
});
})
module.exports = mailRouter;