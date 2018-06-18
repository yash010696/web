var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Tag = require('../models/tag');
var Verifytoken = require('./loginadmin');
var tagRouter = express.Router();


///Create router for  register the new user.
tagRouter
.route('/tag')
.post(passport.authenticate('jwt', { session: false}),function (req, res) {
  

    if (!req.body) {
        res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else { 
      
      var counter;

      Tag.find().exec(function (err, results) {
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
      var tag = new Tag({
          id:cc,
          tag_Text: req.body.tag_Text,
          barcode_Number: req.body.barcode_Number,
          // customer_Id:req.body.customer_Id,
          // order_Id:req.body.order_Id,
          created_by:req.body.created_by,
          created_at:myDateString,
          updated_by:null,
          updated_at:myDateString,
          status:true
        });
        tag.save(function (err) {
          if (err) {
              res.status(400).send(err);
              return;
          }
          res.json({ success: true, msg: 'Successful created new tag.' });
      });

    }
  
})


//Create router for fetching All subservice.
.get(passport.authenticate('jwt', { session: false}),function (req, res) {


  Tag.find(function (err, tags) {

  if (err) {
    res.status(500).send(err);
    return;
  }
  console.log(tags);
  res.json(tags);
});

});

//Create router for fetching Single user.
tagRouter
.route('/tags/:tagId')
.get(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('GET /tags/:tagId');

var tagId = req.params.tagId;

Tag.findOne({ id: tagId }, function (err, tag) {

  if (err) {
    res.status(500).send(err);
    return;
  }

  console.log(tag);

  res.json(tag);

});
})

//Create router for Updating .
.put(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('PUT /tags/:tagId');

var tagId = req.params.tagId;

Tag.findOne({ id: tagId }, function (err, tag) {

  if (err) {
    res.status(500).send(err);
    return;
  }
  var myDateString = Date();
  if (tag) {
    tag.status = req.body.status;
    tag.updated_by = req.body.updated_by;
    tag.updated_at = myDateString;
    customer.save();

    res.json(tag);
    return;
  }

  res.status(404).json({
    message: 'Unable to found.'
  });
});
})
module.exports = tagRouter;