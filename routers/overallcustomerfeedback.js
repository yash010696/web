var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Feedback = require('../models/overallcustomerfeedback');
var Customer = require('../models/customer');
var Verifytoken = require('./loginadmin');
var overallfeedbackRouter = express.Router();


///Create router for  register the new user.
overallfeedbackRouter
.route('/feedback')
.post(passport.authenticate('jwt', { session: false}),function (req, res) {
  
    if (!req.body) {
        res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else { 
      
      var counter;

      Feedback.find().exec(function (err, results) {
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
      var feedback = new Feedback({
          id:cc,
          message: req.body.message,
          rating: req.body.rating,
          customer:req.body.customer,
          created_at:myDateString,
          updated_at : myDateString,
          status:true
        });
        
        feedback.save(function (err) {
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
Feedback.
find({status: "Active"}).
populate('customer').
exec(function (err, feedbacks) {
  if (err) {
    res.status(500).send(err);
    return;
  }
  console.log('The Feedback  is %s', feedbacks);
  res.json(feedbacks);
});
});

//Create router for fetching Single user.
overallfeedbackRouter
.route('/feedbacks/:feedbackId')
.get(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('GET /feedbacks/:feedbackId');

var feedbackId = req.params.feedbackId;

Feedback.findOne({ id: feedbackId }, function (err, feedback) {

  if (err) {
    res.status(500).send(err);
    return;
  }

  console.log(feedback);

  res.json(feedback);

});
})

//Create router for Updating .
.put(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('PUT /feedbackIds/:feedbackId');

var feedbackId = req.params.feedbackId;

Feedback.findOne({ _id: feedbackId }, function (err, feedback) {

  if (err) {
    res.status(500).send(err);
    return;
  }
  var myDateString = Date();
  if (feedback) {
    feedback.status = false;
    feedback.updated_at =myDateString;
    feedback.save();

    res.json(feedback);
    return;
  }

  res.status(404).json({
    message: 'Unable to found.'
  });
});
})
module.exports = overallfeedbackRouter;