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
var orderworksheetRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
//Create router for  register the new role.
orderworksheetRouter
  .route('/orderworksheet')
  .get(checkAuth, function(req, res) {
    if (req.userData.role == "admin") {
        Order.
        find({order_status:"TO Workshop"}).
        sort({ order_id: 'ascending' }).
            // sort('order_id', 'descending').
        populate('customer servicetype franchise').
        exec(function(err, orders) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            console.log('The Price  is %s', orders);
            res.json(orders);
        });
    } else {
        Order.
        find({ franchise: req.userData.franchise , order_status:"TO Workshop"}).
        sort({ order_id: 'ascending' }).
        populate('customer servicetype franchise').
        exec(function(err, orders) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(orders);
        });
    }
});
  module.exports = orderworksheetRouter;