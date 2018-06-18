var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Item1 = require('../models/item1');
var Verifytoken = require('./loginadmin');
var item1Router = express.Router();

item1Router
  .route('/items1')
  .post( passport.authenticate('jwt', { session: false}), function(req, res) {
    var token =Verifytoken.getToken(req.headers);
    if (token) {

    var item = new Item(req.body);

    item.save().then((doc) =>{
      res.send(doc);
  },(e) =>{
      res.status(400).send(e); 
  })
}
else {
  return res.status(403).send({success: false, msg: 'Unauthorized.'});
}
  })

  .get(passport.authenticate('jwt', { session: false}), function (request, response) {

    console.log('GET /items');

    Item1.find(function (error, items) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(items);

      response.json(items);
    });
  });

item1Router
  .route('/items1/:itemId')
  .get(function (request, response) {

    console.log('GET /items/:itemId');

    var itemId = request.params.itemId;

    Item1.findOne({ _id: itemId }, function (error, item) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(item);

      response.json(item);

    });
  })
  .put(function (request, response) {

    console.log('PUT /items/:itemId');

    var itemId = request.params.itemId;

    Item1.findOne({ id: itemId }, function (error, item) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      if (item) {
        item.name = request.body.name;
        item.description = request.body.description;
        item.quantity = request.body.quantity;
        
        item.save();

        response.json(item);
        return;
      }

      response.status(404).json({
        message: 'Item with id ' + itemId + ' was not found.'
      });
    });
  })
  .patch(function (request, response) {

    console.log('PATCH /items/:itemId');

    var itemId = request.params.itemId;

    Item1.findOne({ id: itemId }, function (error, item) {
      
      if (error) {
        response.status(500).send(error);
        return;
      }

      if (item) {

        for (var property in request.body) {
          if (request.body.hasOwnProperty(property)) {
            if (typeof item[property] !== 'undefined') {
              item[property] = request.body[property];
            }
          }
        }

        // if (request.body.name) {
        //   item.name = request.body.name;
        // }

        // if (request.body.description) {
        //   item.description = request.body.description;
        // }

        // if (request.body.quantity) {
        //   item.quantity = request.body.quantity;
        // }

        item.save();

        response.json(item);
        return;
      }

      response.status(404).json({
        message: 'Item with id ' + itemId + ' was not found.'
      });
    });
  })
  .delete(function (request, response) {

    console.log('DELETE /items/:itemId');

    var itemId = request.params.itemId;

    Item1.findOne({ id: itemId }, function (error, item) {
      
      if (error) {
        response.status(500).send(error);
        return;
      }

      if (item) {
        item.remove(function (error) {

          if (error) {
            response.status(500).send(error);
            return;
          }

          response.status(200).json({
            'message': 'Item with id ' + itemId + ' was removed.'
          });
        });
      } else {
        response.status(404).json({
          message: 'Item with id ' + itemId + ' was not found.'
        });
      }
    });
  });

module.exports = item1Router;