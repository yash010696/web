var express = require('express');
var Customer1 = require('../models/customer1');

var customer1Router = express.Router();

customer1Router
  .route('/customers')
  .post(function (request, response) {

    console.log('POST /customers');

    var customer = new Customer(request.body);

    customer.save();

    response.status(201).send(customer);
  })
  .get(function (request, response) {

    console.log('GET /customers');

    Customer1.find(function (error, customers) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(customers);

      response.json(customers);
    });
  });

  customer1Router
  .route('/customers1/:customerId')
  .get(function (request, response) {

    console.log('GET /customer/:customerId');

    var customerId = request.params.customerId;

    Customer1.findOne({ id: customerId }, function (error, customer) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(customer);

      response.json(customer);

    });
  })
  .put(function (request, response) {

    console.log('PUT /customers/:customerId');

    var customerId = request.params.customerId;

    Customer1.findOne({ id: customerId }, function (error, customer) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      if (customer) {
        customer.name = request.body.name;
        customer.age = request.body.age;
        
        customer.save();

        response.json(customer);
        return;
      }

      response.status(404).json({
        message: 'Customer with id ' + customerId + ' was not found.'
      });
    });
  })
  .patch(function (request, response) {

    console.log('PATCH /customers/:customerId');

    var customerId = request.params.customerId;

    Customer.findOne({ id: customerId }, function (error, customer) {
      
      if (error) {
        response.status(500).send(error);
        return;
      }

      if (customer) {

        for (var property in request.body) {
          if (request.body.hasOwnProperty(property)) {
            if (typeof customer[property] !== 'undefined') {
              customer[property] = request.body[property];
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

        customer.save();

        response.json(customer);
        return;
      }

      response.status(404).json({
        message: 'Customer with id ' + customerId + ' was not found.'
      });
    });
  })
  .delete(function (request, response) {

    console.log('DELETE /customers/:customerId');

    var customerId = request.params.customerId;

    Customer.findOne({ id: customerId }, function (error, customer) {
      
      if (error) {
        response.status(500).send(error);
        return;
      }

      if (customer) {
        customer.remove(function (error) {

          if (error) {
            response.status(500).send(error);
            return;
          }

          response.status(200).json({
            'message': 'Customer with id ' + customerId + ' was removed.'
          });
        });
      } else {
        response.status(404).json({
          message: 'customer with id ' + customerId + ' was not found.'
        });
      }
    });
  });

module.exports = customer1Router;