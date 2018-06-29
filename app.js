require('./config/config');
var express = require('express');
var nodeMailer = require('nodemailer');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var { mongoose } = require('./db/mongoose');
var cors = require('cors');
const userAuth = require('./routers/userAuth');

// const fileType = require('file-type')
// const fs = require('fs')

var item1Router = require('./routers/item1');
var customer1Router = require('./routers/customer1');
var admininfoRouter=require('./routers/loginadmin');
var areaRouter=require('./routers/area');
var roleRouter=require('./routers/role');
var orderRouter=require('./routers/order');
var ordertransactionRouter=require('./routers/ordertransaction');
var orderstatusRouter=require('./routers/orderstatus');
var ordertypeRouter=require('./routers/ordertype');
var servicetypeRouter=require('./routers/servicetype');
var serviceRouter=require('./routers/service');
var servicecategoryRouter=require('./routers/servicecategory');
var subserviceRouter=require('./routers/subservice');
var garmentRouter=require('./routers/garment');
var colorRouter=require('./routers/color');
var patternRouter=require('./routers/pattern');
var brandRouter=require('./routers/brand');
var clothdefectRouter=require('./routers/clothdefect');
var priceRouter=require('./routers/price');
var timeslotRouter=require('./routers/timeslot');
var userRouter=require('./routers/user');
var franchiseRouter=require('./routers/franchise');
var couponRouter=require('./routers/coupon');
var notificationtypeRouter=require('./routers/notificationtype');
var customerRouter=require('./routers/customer');
var tagRouter=require('./routers/tag');
var overallfeedbackRouter=require('./routers/overallcustomerfeedback');
var orderwisefeedbackRouter=require('./routers/orderwisecustomerfeedback');
var smsRouter=require('./routers/sms');
var mailRouter=require('./routers/mail');
var orderstateRouter=require('./routers/orderstate');
var batchcategoryRouter=require('./routers/batchcategory');
var batchsubcategoryRouter=require('./routers/batchsubcategory');
var batchprogramRouter=require('./routers/batchprogram');
var batchRouter=require('./routers/batch');
var workshopacivityRouter=require('./routers/workshopactivity');
var gstRouter=require('./routers/gst');
var referralRouter=require('./routers/referral');


//WEB Services
var {mobilecustomerRouter}=require('./routers/mobilecustomer');
var { customerProfileRouter } = require('./routers/customerprofile');
var { otpRouter } = require('./routers/otp');
var { mrequestordersRouter } = require('./routers/mrequestorders');
var { MyOrdersRouter } = require('./routers/myorders');
var { pickupboyserviceRouter } = require('./routers/pickupboyservices');
var { creditdebitRouter } = require('./routers/creditdebit');
var {mfranchiseRouter}=require('./routers/mfranchise');
var {mpickupdeliveryboyRouter}=require('./routers/mpickupdeliveryboy');


const router = express.Router()
var app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));
app.use(passport.initialize());
app.use(cors());

app.use('/api', item1Router);
app.use('/api', customer1Router);
app.use('/api',admininfoRouter);
app.use('/api',areaRouter);
app.use('/api',roleRouter);
app.use('/api',orderRouter);
app.use('/api',ordertransactionRouter);
app.use('/api',orderstatusRouter);
app.use('/api',ordertypeRouter);
app.use('/api',servicetypeRouter);
app.use('/api',serviceRouter);
app.use('/api',servicecategoryRouter);
app.use('/api',subserviceRouter);
app.use('/api',garmentRouter);
app.use('/api',colorRouter);
app.use('/api',patternRouter);
app.use('/api',brandRouter);
app.use('/api',clothdefectRouter);
app.use('/api',priceRouter);
app.use('/api',timeslotRouter);
app.use('/api',userRouter);
app.use('/api',franchiseRouter);
app.use('/api',couponRouter);
app.use('/api',notificationtypeRouter);
app.use('/api',customerRouter);
app.use('/api',overallfeedbackRouter);
app.use('/api',orderwisefeedbackRouter);
app.use('/api',tagRouter);
app.use('/api',smsRouter);
app.use('/api',mailRouter);
app.use('/api',orderstateRouter);
app.use('/api',batchcategoryRouter);
app.use('/api',batchsubcategoryRouter);
app.use('/api',batchprogramRouter);
app.use('/api',batchRouter);
app.use('/api',workshopacivityRouter);
app.use('/api',gstRouter);
app.use('/api',referralRouter);

//WEB Services
app.use('/api', mobilecustomerRouter);
app.use('/api', otpRouter);
app.use('/api', mrequestordersRouter);
app.use('/api', MyOrdersRouter);
app.use('/api', pickupboyserviceRouter);
app.use('/api', customerProfileRouter);
app.use('/api', creditdebitRouter);
app.use('/api', mfranchiseRouter);
app.use('/api', mpickupdeliveryboyRouter);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/send-email', function(req, res) {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'ajitpawar005@gmail.com',
            pass: '@engineering@05'
        }
    });
    let mailOptions = {
        from: '"Ajit Pawar" <ajitpawar005@gmail.com>', // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.body, // plain text body
        html: '<h1>Welcome</h1><br><p>ELaundry</p>' // html body
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json({ success: true, msg: 'Successful Mail Sent.' });
    });
});



app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
// app.use('/api', router);
// router.get('/uploads/images/:imagename', (req, res) => {

//     let imagename = req.params.imagename;
//     let imagepath = "http://localhost:3000" + "/uploads/images/" + imagename;
//     // let image = fs.readFileSync(imagepath)
//     // let mime = fileType(image).mime

// 	// res.writeHead(200, {'Content-Type': mime })
// 	res.end(imagepath, 'binary');
// })
module.exports = { app };