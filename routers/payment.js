var express = require('express');

var createHash = require('js-sha512');
var payumoney = require('payumoney-node');
var crypto = require('crypto');
var generateMail = require('./../middlewear/mail');
var generateSms = require('./../middlewear/sms');
var { BitlyClient } = require('bitly');



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
        var newdate = new Date();
        var date = formatDate(newdate);
        var txnid = 'Tx' + date + '' + req.body.order_id;
        payumoney.setKeys('F1z7coeW', 'JjckyBbOBD', 'Mf6swfJ/ifF7PGYf5lmGbY5w+Ao78i5GzHb+Ch4EH6s=');
        KEY = "F1z7coeW",
            SALT = "JjckyBbOBD"
        var shasum = crypto.createHash('sha512'),
            dataSequence = KEY + '|' + txnid + '|' + req.body.amount + '|' + req.body.productinfo + '|' + req.body.firstname + '|' + req.body.email + '|||||||||||' + SALT,
            resultKey = shasum.update(dataSequence).digest('hex');
        var data = {
            Hash: resultKey,
            txnid: txnid
        }
        res.status(200).json({ success: true, data });
    })
    .post('/getShaKey', function (req, res) {
        var newdate = new Date();
        var date = formatDate(newdate);
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
            furl: "http://localhost:3000/api/fail"
        };
        payumoney.makePayment(paymentData, function (error, response) {
            if (error) {
                res.json({ error });
            } else {
                const bitly = new BitlyClient('e882848e14f6f402b175cb53c404afe9ead68ec3', {});
                bitly.shorten(response).then((result) => {
                    generateSms(req.body.phone,
                        `Dear yash, Your Payment Link is ${result.url}.`
                    )
                }).catch(function (error) {
                    res.status(400).json({ error });
                });
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
                        <tr><b>Dear Yash,</b></tr><br><br>

                        <tr><a href="${response}">${response}</a></tr><br><br>
                           
                        <tr>Happy Cleaning!</tr><br><br>
                                                                   
                        <tr>Thanks,</tr><br><br>
                                                                           
                        <tr>Team 24Klen Laundry Science</tr>
                    </body>
                    </html>`,

                    'Payment Link'
                );
                res.json({ "Link": response });
            }
        })
    })

    .post('/success', function (req, res) {
        var shasum = crypto.createHash('sha512'),
            dataSequence = SALT + '|' + req.body.status + '|||||||||||' + req.body.email + '|' + req.body.firstname + '|' + req.body.productinfo + '|' + req.body.amount + '|' + req.body.txnid + '|' + KEY,
            resultKey = shasum.update(dataSequence).digest('hex');
        if (req.body.hash == resultKey) {
            var success = {
                mihpayid: req.body.mihpayid,
                addedon: req.body.addedon,
                status: req.body.status,
                txnid: req.body.txnid,
                bank_ref_num: req.body.bank_ref_num,
                mode: req.body.mode,
                net_amount_debit: req.body.net_amount_debit
            }
            res.status(200).json({ Success: true,Message :"Payment Successfull" });
        } else {
            res.status(200).json({ Success: false, Message: "Something went wrong" });
        }
    })

    .post('/fail', (req, res) => {
        res.status(200).json({ Success: false });
    })

module.exports = { paymentRouter };