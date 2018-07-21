var createHash = require('js-sha512');
var payumoney = require('payumoney-node');
var crypto = require('crypto');
var { BitlyClient } = require('bitly');
var Order = require('./../models/order');
var Invoice = require('../models/invoice');


module.exports = function payumoney(order_id) {
    console.log("in hereeee", order_id);
    return new Promise((resolve, reject) => {

        Order.findOne({ 'order_id': order_id }).then((order) => {

            console.log(order.paymentstatus);
            if (paymentstatus == "Paid") {
                resolve(true)
            } else {
                function formatDate(d) {
                    var month = d.getMonth();
                    var date = d.getDate().toString();
                    var year = d.getFullYear();
                    year = year.toString().substr(-2);
                    month = (month + 1).toString();
                    if (month.length === 1) {
                        month = "0" + month;
                    }
                    if (date.length === 1) {
                        date = "0" + date;
                    }
                    return date + month + year;
                }

                var newdate = new Date();
                var date = formatDate(newdate);
                var order_id = req.body.order_id;
                var txnid = 'Tx' + date + '' + req.body.order_id;
                payumoney.setKeys('F1z7coeW', 'JjckyBbOBD', 'Mf6swfJ/ifF7PGYf5lmGbY5w+Ao78i5GzHb+Ch4EH6s=');

                KEY = "F1z7coeW"; SALT = "JjckyBbOBD"

                var shasum = crypto.createHash('sha512'),
                    dataSequence = KEY + '|' + txnid + '|' + req.body.amount + '|' + req.body.productinfo + '|' + req.body.firstname + '|' + req.body.email + '|||||||||||' + SALT,
                    resultKey = shasum.update(dataSequence).digest('hex');
                var paymentData = {
                    productinfo: req.body.productinfo,
                    txnid: txnid,
                    amount: req.body.amount,
                    email: req.body.email,
                    phone: req.body.phone,
                    firstname: req.body.firstname,
                    surl: "http://localhost:3000/api/success",
                    furl: "http://localhost:3000/api/fail",
                    // surl: "https://sheltered-atoll-29861.herokuapp.com/api/success",
                    // furl: "https://sheltered-atoll-29861.herokuapp.com/api/fail"            
                };
                payumoney.makePayment(paymentData, function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        Order.findOneAndUpdate({ 'order_id': order_id }, {
                            $set: { payment_link: response }
                        }).then((data) => {
                            resolve(response);
                            res
                        })
                    }
                })
            }
        })
    })
}

