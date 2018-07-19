var express = require('express');

var createHash = require('js-sha512');
var payumoney = require('payumoney-node');
var crypto = require('crypto');
var generateMail = require('./../middlewear/mail');
var generateSms = require('./../middlewear/sms');
var { BitlyClient } = require('bitly');
var Order = require('./../models/order');


var paymentRouter = express.Router();

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

payumoney.setKeys('F1z7coeW', 'JjckyBbOBD', 'Mf6swfJ/ifF7PGYf5lmGbY5w+Ao78i5GzHb+Ch4EH6s=');

paymentRouter

    .post('/getHash', function (req, res) {
        // var newdate = new Date();
        // var date = formatDate(newdate);
        // var txnid = 'Tx' + date + '' + req.body.order_id;
        payumoney.setKeys('F1z7coeW', 'JjckyBbOBD', 'Mf6swfJ/ifF7PGYf5lmGbY5w+Ao78i5GzHb+Ch4EH6s=');
        KEY = "F1z7coeW",
            SALT = "JjckyBbOBD"
        var shasum = crypto.createHash('sha512'),
            dataSequence = KEY + '|' + req.body.txnid + '|' + req.body.amount + '|' + req.body.productinfo + '|' + req.body.firstname + '|' + req.body.email + '|||||||||||' + SALT,
            // dataSequence = KEY + '|' + req.body.txnid + '|' + req.body.amount + '|' + req.body.productinfo + '|' + req.body.firstname + '|' + req.body.email + '||||||' + SALT,
            // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
            Hash = shasum.update(dataSequence).digest('hex');
        res.status(200).json({ success: true, Hash });
    })

    .post('/getShaKey', function (req, res) {
        var newdate = new Date();
        var date = formatDate(newdate);
        var order_id = req.body.order_id;
        var txnid = 'Tx' + date + '' + req.body.order_id;
        payumoney.setKeys('F1z7coeW', 'JjckyBbOBD', 'Mf6swfJ/ifF7PGYf5lmGbY5w+Ao78i5GzHb+Ch4EH6s=');

        KEY = "F1z7coeW",
            SALT = "JjckyBbOBD"

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
                res.json({ error });
            } else {
                Order.findOneAndUpdate({ 'order_id': order_id }, {
                    $set: { payment_link: response }
                }).then((data) => {


                    const bitly = new BitlyClient('e882848e14f6f402b175cb53c404afe9ead68ec3', {});
                    bitly.shorten(response).then((result) => {
                        generateSms(req.body.phone,
                            `Dear Customer, Your Order [Booking No] consist of [Quantity] garments are out for delivery and it will be delivered today. Amount due 100.You can now pay for your order with the link below ${result.url} Thanks 24:Klen Laundry Science.`
                        )
                    })
                    generateMail(req.body.email,
                        `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <title>Page Title</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
                    <script src="main.js"></script>                                                
                    </head>
                    <body>
                    <table>
                        <tr><td style="width:100%;text-align:left;"><b>Dear Yash,</b></td></tr>
                        
                        <tr><td>Your order is successfully created and in-progress. You can now pay for your order with the link below.</td></tr>

                        <tr><td>Your order details are:</td></tr>
                        <br>
                        <tr><td>Order ID: [OrderID]</td></tr>
                        <tr><td>Amount to pay: 100</td></tr>
                        <tr>    
                        <td style="width:100%;text-align:left;">
                        <br>
                        <a style="background-color: #22b9ff;max-width: 100px;padding: 7px 17px;text-decoration: none;color: #fff;opacity: 1;text-transform: uppercase;font-weight: 600;margin-top: 15px;margin-bottom: 20px;border-radius: 30px;" href="${response}">Pay Now</a>
                        <br><br>
                        </td>
                        </tr>
                                                                 
                        <tr><td style="width:100%;text-align:left;">Thanks,</td></tr><br>
                                                                           
                        <tr><td style="width:100%;text-align:left;">Team 24Klen Laundry Science</td></tr>
                    </table>    
                    </body>
                    </html>`,
                        'Payment Link for [Order ID]'
                    );
                    res.status(200).json({ "Link": response });
                }).catch(function (error) {
                    res.status(400).json({ error });
                });
            }
        })
    })

    .post('/success', function (req, res) {
        KEY = "F1z7coeW"; SALT = "JjckyBbOBD"
        console.log('////////////', req.body);
        payumoney.paymentResponse(req.body.txnid, function (error, response) {
            if (error) {
                console.log('error:', error);
            } else {
                console.log('response=', response);
            }
        })
        var shasum = crypto.createHash('sha512'),
            dataSequence = SALT + '|' + req.body.status + '|||||||||||' + req.body.email + '|' + req.body.firstname + '|' + req.body.productinfo + '|' + req.body.amount + '|' + req.body.txnid + '|' + KEY,
            resultKey = shasum.update(dataSequence).digest('hex');
        if (req.body.hash == resultKey) {
            var success = {
                payment_type: 'Online',
                mihpayid: req.body.mihpayid,
                addedon: req.body.addedon,
                status: req.body.status,
                txnid: req.body.txnid,
                bank_ref_num: req.body.bank_ref_num,
                mode: req.body.mode,
                net_amount_debit: req.body.net_amount_debit
            }

            var txnid = req.body.txnid;
            var order_id = txnid.slice(8, txnid.length);
            Order.findOneAndUpdate({ 'order_id': order_id }, { $push: { payment_details: success }, $set: { paymentstatus: 'Paid' } }).then((data) => {
                res.status(200).json({ Success: true, Message: "Payment Successfull" });
            }).catch((error) => {
                res.status(400).json({ error });
            })
        } else {
            res.status(200).json({ Success: false, Message: "Something went wrong" });
        }
    })

    .post('/fail', (req, res) => {
        Order.findOne({ 'payment_details.0.txnid': req.body.txnid }).then((data) => {
            // console.log(data);
            if (data.paymentstatus == 'Paid') {
                res.status(200).json({ Success: true, Message: "The Payment Has Been Done Already!" });
            } else {
                res.status(200).json({ Success: false });
            }
        })
    })

module.exports = { paymentRouter };