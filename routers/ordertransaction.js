var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Ordertransaction = require('../models/ordertransaction');
var Order = require('../models/order');
var Verifytoken = require('./loginadmin');
var Customer = require('../models/customer');
var Service = require('../models/service');
var Servicetype = require('../models/servicetype');
var Subservice = require('../models/subservice');
var Garment = require('../models/garment');
var Price = require ('../models/price');
var Color = require ('../models/color');
var Specialservice = require ('../models/specailservice');
var Brand = require ('../models/brand');
var Pattern = require ('../models/pattern');
var Clothdefect = require ('../models/clothdefect');
var Coupon = require ('../models/coupon');
var ordertransactionRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
//Create router for  register the new role.
ordertransactionRouter
  .route('/ordertransaction/:orderid')
  .get(checkAuth, function (req, res) {
    console.log('GET /ordertransaction/:orderid');
    var orderid = req.params.orderid;
    Ordertransaction.
    find({order_id:orderid}).
    // populate('customer servicetype ').
    populate('customer franchise servicetype service ').
    exec(function (err, orderdata) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log('The Price  is %s', orderdata);
      res.json(orderdata);
    });
  })
  module.exports = ordertransactionRouter;