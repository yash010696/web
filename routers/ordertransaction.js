var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Order = require('../models/order');
var Verifytoken = require('./loginadmin');
var Customer = require('../models/customer');
var Service = require('../models/service');
var Servicetype = require('../models/servicetype');
var Subservice = require('../models/subservice');
var Garment = require('../models/garment');
var Price = require ('../models/price');
var Color = require ('../models/color');
var Brand = require ('../models/brand');
var Pattern = require ('../models/pattern');
var Clothdefect = require ('../models/clothdefect');
var Coupon = require ('../models/coupon');
var ordertransactionRouter = express.Router();

//Create router for  register the new role.
ordertransactionRouter
    .route('/ordertransaction')
    .post(passport.authenticate('jwt', { session: false}),function (req, res) {
      

        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          
          var counter;
          var orderid;
          Order.find().exec(function (err, results) {
            var count = results.length;
            counter=count +1;

            var str = "" + counter;
            var pad = "0000";
            var ans = pad.substring(0, pad.length - str.length) + str;
            orderid= 'AU' + ans;
            console.log("orderid",orderid)
            savedata(counter);
             
          });
            

        }    
        function savedata(counter){
          var myDateString = Date();
          var cc=counter;
           console.log('cc',cc);

          // var area = new Area(req.body);
          var order = new Order({
              id:cc,
              order_id: orderid,
              customer:req.body.customer,
              servicetype:req.body.servicetype,
              order_amount:req.body.order_amount,
              created_by:req.body.created_by,
              created_at:myDateString,
              updated_by:null,
              updated_at:myDateString,
              status:true
            });
            order.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({ success: true, msg: 'Successful created new order.' });
          });
    
        }
      
    })


//Create router for fetching All roles.
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {

    Order.
    find().
    populate('customer servicetype ').
    exec(function (err, orders) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log('The Price  is %s', orders);
      res.json(orders);
    });
});

//Create router for fetching Single role.
// orderstateRouter
//   .route('/orderstates/:orderstateId')
//   .get(passport.authenticate('jwt', { session: false}),function (req, res) {

//     console.log('GET /orderstates/:orderstateId');

//     var orderstateId = req.params.orderstateId;

//     Orderstate.findOne({ id: orderstateId }, function (err, orderstate) {

//       if (err) {
//         res.status(500).send(err);
//         return;
//       }

//       console.log(orderstate);

//       res.json(orderstate);

//     });
//   })

  //Create router for Updating role.
  // .put(passport.authenticate('jwt', { session: false}),function (req, res) {

  //   console.log('PUT /orderstates/:orderstateId');

  //   var orderstateId = req.params.orderstateId;

  //   Orderstate.findOne({ id: orderstateId }, function (err, orderstate) {

  //     if (err) {
  //       res.status(500).send(err);
  //       return;
  //     }
  //     var myDateString = Date();
  //     if (orderstate) {
  //       orderstate.state = req.body.state;
  //       orderstate.updated_by = req.body.updated_by;
  //       orderstate.updated_at =myDateString
        
  //       orderstate.save();

  //       res.json(orderstate);
  //       return;
  //     }

  //     res.status(404).json({
  //       message: 'Unable to found.'
  //     });
  //   });
  // })
  module.exports = ordertransactionRouter;