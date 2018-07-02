var express = require('express');

var crypto = require('crypto');
var createHash = require('js-sha512');
var paymentRouter = express.Router();


    KEY = "F1z7coeW",
    SALT = "JjckyBbOBD"

paymentRouter
    .post('/getShaKey', function (req, res) {
        console.log("Hash Generated", req.body);
        var shasum = crypto.createHash('sha512'),
            reqData = req.body,
            dataSequence = KEY + '|' + reqData.txnid + '|' + reqData.amount + '|' + reqData.productinfo + '|' + reqData.firstname + '|' + reqData.email + '|||||||||||' + SALT,
            resultKey = shasum.update(dataSequence).digest('hex');
        console.log(resultKey);
        res.end(resultKey);
    })


    .post('/success', function (req, res) {
        console.log("==========", req.body.hash);
        var shasum = crypto.createHash('sha512'),
            reqData = req.body,
            dataSequence = SALT + '|' + reqData.status + '|||||||||||' + reqData.email + '|' + reqData.firstname + '|' + reqData.productinfo + '|' + reqData.amount + '|' + reqData.txnid + '|' + KEY,
            resultKey = shasum.update(dataSequence).digest('hex');
        console.log(resultKey);
        if (req.body.hash == resultKey) {
            console.log("==========", req.body);
            var success = {
                mihpayid: reqData.mihpayid,
                addedon: reqData.addedon,
                status: reqData.status,
                txnid: reqData.txnid,
                bank_ref_num: reqData.bank_ref_num,
                mode: reqData.mode,
                net_amount_debit: reqData.net_amount_debit
            }
            res.send({ success });
        } else {
            res.send("SOmething went wrong");
        }

    })

    .post('/cancel', (req, res) => {
        res.send(" okkkkkkkkkkk cancel");
    })

    module.exports = { paymentRouter };
