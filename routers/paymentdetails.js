var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Customer = require('../models/customer');
var Paymentdetail = require('../models/paymentdetail');
var paymentdetailsRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
//Create router for  register the new role.
paymentdetailsRouter
  .route('/paymentdetails/:customerid')
  .get(checkAuth, function (req, res) {
    console.log('GET/paymentdetails/:customerid');
    var customerid = req.params.customerid;
    Paymentdetail.
    findOne({customer:customerid}).
    // populate('customer servicetype ').
    populate('customer').
    exec(function (err, paymentdetails) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(paymentdetails);
    });
  })  
  module.exports = paymentdetailsRouter;