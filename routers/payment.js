var express = require('express');

var createHash = require('js-sha512');
var payumoney = require('payumoney-node');
var crypto = require('crypto');
var generateMail = require('./../middlewear/mail');
var generateSms = require('./../middlewear/sms');
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
// KEY = "F1z7coeW",
// SALT = "JjckyBbOBD"

// KEY = "gtKFFx",
// SALT = "eCwWELxi"

//generate SHA512 key
paymentRouter
    .post('/getShaKey', function (req, res) {
        var newdate = new Date();
        var date = formatDate(newdate);
        var txnid = 'Tx' + date + '' + req.body.order_id;

        console.log(txnid);
        payumoney.setKeys('F1z7coeW', 'JjckyBbOBD', 'Mf6swfJ/ifF7PGYf5lmGbY5w+Ao78i5GzHb+Ch4EH6s=');
        KEY = "F1z7coeW",
            SALT = "JjckyBbOBD"
        // console.log("Hash Generated", req.body);
        var shasum = crypto.createHash('sha512'),
            dataSequence = KEY + '|' + txnid + '|' + req.body.amount + '|' + req.body.productinfo + '|' + req.body.firstname + '|' + req.body.email + '|||||||||||' + SALT,
            resultKey = shasum.update(dataSequence).digest('hex');
        console.log(resultKey);
        // res.end(resultKey);
        var paymentData = {
            productinfo: req.body.productinfo,
            txnid: txnid,
            amount: req.body.amount,
            email: req.body.email,
            phone: req.body.phone,
            firstname: req.body.firstname,
            surl: "http://localhost:3000/api/success", //"http://localhost:3000/payu/success"
            furl: "http://localhost:3000/api/cancel", //"http://localhost:3000/payu/fail"
        };
        console.log('==============', paymentData);

        payumoney.makePayment(paymentData, function (error, response) {
            if (error) {
                res.json({ error });
            } else {
                // Payment redirection link
                console.log(response);
            
                
                generateSms('9673067099',
                    `Dear yash, Your Payment Link is ${response}.`
                );
                generateMail('yash.shah@encureit.com',
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

                        <tr>${response}</tr><br><br>
                           
                        <tr>Happy Cleaning!</tr><br><br>
                                                                   
                        <tr>Thanks,</tr><br><br>
                                                                           
                        <tr>Team 24Klen Laundry Science</tr>
                    </body>
                    </html>`,

                    'Payment Link'
                );
                res.json({ "Link": response });
            }
        });

    })

    .post('/success', function (req, res) {
        console.log("==========", req.body.hash);
        var shasum = crypto.createHash('sha512'),
            dataSequence = SALT + '|' + req.body.status + '|||||||||||' + req.body.email + '|' + req.body.firstname + '|' + req.body.productinfo + '|' + req.body.amount + '|' + req.body.txnid + '|' + KEY,
            resultKey = shasum.update(dataSequence).digest('hex');
        console.log(resultKey);
        if (req.body.hash == resultKey) {
            console.log("==========", req.body);
            var success = {
                mihpayid: req.body.mihpayid,
                addedon: req.body.addedon,
                status: req.body.status,
                txnid: req.body.txnid,
                bank_ref_num: req.body.bank_ref_num,
                mode: req.body.mode,
                net_amount_debit: req.body.net_amount_debit
            }
            res.send({ success });
        } else {
            res.send("Something went wrong");
        }

    })

    .post('/cancel', (req, res) => {
        res.send(" okkkkkkkkkkk cancel");
    });

module.exports = { paymentRouter };