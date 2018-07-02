var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Order = require('../models/order');
var Ordertransaction = require('../models/ordertransaction');
var Verifytoken = require('./loginadmin');
var Customer = require('../models/customer');
var Franchise = require('../models/franchise');
var Area = require('../models/area');
var Servicetype = require('../models/servicetype');
var Subservice = require('../models/subservice');
var Garment = require('../models/garment');
var Price = require ('../models/price');
var Color = require ('../models/color');
var Brand = require ('../models/brand');
var Pattern = require ('../models/pattern');
var Clothdefect = require ('../models/clothdefect');
var Coupon = require ('../models/coupon');
var orderRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
//Create router for  register the new role.
orderRouter
    .route('/order')
    .post(checkAuth,function (req, res) {
      // console.log("********************************");
      // console.log(JSON.stringify(req.body, undefined, 2));
      // console.log("********************************");
      let orderTransaction_array = [];
      // let ordergarmentdetailsTransaction_array = [];
    
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          
          var counter;
          var orderid;
          var areacode;
          Franchise.find({ statee: true , area:req.userData.area}).
            populate('area').
            exec(function (err, franchises) {
              if (err) {
                res.status(500).send(err);
                return;
              }
              // console.log('The Franchise  is', franchises[0].area);
              areacode= franchises[0].area.code;
              Order.find({franchise:req.userData.franchise}).exec(function (err, results) {
                var count = results.length;
                counter=count +1;
                var str = "" + counter;
                var pad = "0000";
                var ans = pad.substring(0, pad.length - str.length) + str;
                orderid= areacode + ans;
                // console.log("orderid",orderid)
                savedata(counter,orderid);
                 
              });
            });

        }    
function savedata(counter,orderid){
          var myDateString = Date();
          var cc=counter;

          var order = new Order({
              // id:cc,
              order_id: orderid,
              customer:req.body.orderDetails.userid,
              franchise:req.userData.franchise,
              servicetype:req.body.orderDetails.serviceId,
              order_status:"In Process",
              order_amount:req.body.orderDetails.netAmount,
              created_by:req.userData._id,
              created_at:myDateString,
              updated_by:null,
              updated_at:myDateString,
              status:true,
              state:true
            });
           order.save(function (err) {
             if (err) {
                  res.status(400).send(err);
                  return;
            }
             saveorderdata(counter,orderid);
              // res.json({ success: true, msg: 'Successful created new order.' });
          });


        function saveorderdata(counter,orderid){
          var myDateString = Date();
          var cc=counter;

        var ordertransaction = new Ordertransaction({
          "order_id": orderid,
          // "service": orderTransaction_array,

          "customer": req.body.orderDetails.userid,
          "servicetype": req.body.orderDetails.serviceId,
          // "coupon": req.body.orderDetails.couponId,
          "total_qty": req.body.orderDetails.totalQty,
          "total_beforedis": req.body.orderDetails.totalBeforeDiscount,
          "total_afetrdis":req.body.orderDetails.totalAfterDiscount,
          "net_amount":req.body.orderDetails.netAmount,
          "discount_amount":req.body.orderDetails.discountAmt,
          "cgst": req.body.orderDetails.selectedCGSTAmt,
          "sgst": req.body.orderDetails.selectedSGSTAmt,
          "gst": req.body.orderDetails.selectedCGSTAmt + req.body.orderDetails.selectedSGSTAmt,
          "created_by": req.userData._id,
          "created_at": myDateString,
          "updated_by": null,
          "updated_at": myDateString,
          "status": true,

        });

          req.body.orderServicesList.forEach((service, index) => {
            service.subservices.forEach((subservice, index) => {
              subservice.garmentsList.forEach((garmentlist, index) => {
                const detailsArray = [];
                garmentlist.garmentDetails.forEach((garmentdetails, ind) => {
                  const orderGarmentDetailsTransaction = {
                    'color': garmentdetails.color._id,
                    'brand': garmentdetails.brand._id,
                    'pattern': garmentdetails.pattern._id,
                    'defect': garmentdetails.defect._id,
                  };
                  detailsArray.push(orderGarmentDetailsTransaction);

                });
                let tempArray = detailsArray;
                const orderGarmentTransaction = {
                  'price': garmentlist._id,
                  'service': garmentlist.service._id,
                  'subservice': garmentlist.subservice._id,
                  'garment': garmentlist.garment._id,
                  'qty': garmentlist.qty,
                  'garmentdetails': tempArray
                };
                orderTransaction_array.push(orderGarmentTransaction);

              });
            });
          });
          console.log("garmentlist data ====================", orderTransaction_array);
        // ordertransaction.garmentslist.push(orderTransaction_array);
            ordertransaction.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({success: true, msg: 'Successful created new order.' });
          });

        }
      }
      })
//Create router for fetching All roles.
  .get(checkAuth,function (req, res) {
    if(req.userData.role=="admin"){
      Order.
      find().
      sort({ order_id: 'ascending' }).
      // sort('order_id', 'descending').
      populate('customer servicetype ').
      exec(function (err, orders) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Price  is %s', orders);
        res.json(orders);
      });
    }
    else{
    Order.
    find({franchise:req.userData.franchise}).
    sort({ order_id: 'ascending' }).
    populate('customer servicetype ').
    exec(function (err, orders) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log('The Price  is %s', orders);
      res.json(orders);
    });
  }
});


// Array.prototype.inArray = function(comparer) { 
//   for(var i=0; i < this.length; i++) { 
//       if(comparer(this[i])) return true; 
//   }
//   return false; 
// }; 

// adds an element to the array if it does not already exist using a comparer 
// function
// Array.prototype.pushIfNotExist = function(element, comparer) { 
//   if (!this.inArray(comparer)) {
//       this.push(element);
//   }
// }; 


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
  module.exports = orderRouter;