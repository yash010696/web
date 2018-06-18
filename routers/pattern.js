var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Pattern = require('../models/pattern');
var Verifytoken = require('./loginadmin');
var patternRouter = express.Router();
const multer = require('multer');
const checkAuth = require('../middlewear/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const uploads = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Create router for  register the new subservice.
patternRouter
    .route('/pattern')
    .post(checkAuth, uploads.single("patternImage"), function(req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            var counter;
            Pattern.find().exec(function(err, results) {
                var count = results.length;
                counter = count + 1;
                savedata(counter);
            });
        }
        console.log(req.body);

        function savedata(counter) {
            var cc = counter;
            var code = req.body.code.toUpperCase();
            let filePath = "";
            if (req.file === undefined) {
                filePath = req.body.patternImage;
            } else {
                filePath = req.file.path;
            }
            const pattern = new Pattern({
                id: cc,
                pattern_name: req.body.pattern_name,
                code: code,
                created_by: req.userData._id,
                updated_by: null,
                status: true,
                state: true,
                patternImage: filePath
            });
            pattern.save(function(err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: pattern, success: true, msg: 'Successful created new pattern.' });
            });
        }
    })


//Create router for fetching All subservice.
.get(passport.authenticate('jwt', { session: false }), function(req, res) {


    Pattern.find({ state: true }, function(err, patterns) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log(patterns);
        res.json(patterns);
    });

});

//Create router for fetching Single subservice.
patternRouter
    .route('/patterns/:patternID')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {
        const patternID = req.params.patternID;
        Pattern.findOne({ _id: patternID }, function(err, pattern) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(pattern);
        });
    })

//Create router for Updating subservice.
.put(checkAuth, uploads.single("patternImage"), function(req, res) {
    const patternID = req.body._id;
    Pattern.findOne({ _id: patternID }, function(err, pattern) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        var code = req.body.code.toUpperCase();
        let filePath = "";
        if (pattern) {
            if (req.file === undefined) {
                filePath = pattern.patternImage;
            } else {
                filePath = req.file.path
            }
            pattern.pattern_name = req.body.pattern_name,
                pattern.code = code,
                pattern.status = req.body.status;
            pattern.updated_by = req.body.updated_by;
            pattern.patternImage = filePath;

            pattern.save();
            res.json(pattern);
            return;
        }

        res.status(404).json({
            message: 'Unable to found.'
        });
    });
})
patternRouter
    .route('/patternss/:patternId')
    .put(passport.authenticate('jwt', { session: false }), function(req, res) {
        var patternId = req.params.patternId;
        Pattern.findOne({ _id: patternId }, function(err, pattern) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (pattern) {
                pattern.state = false;

                pattern.save();
                res.json(pattern);
                return;
            }

            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
module.exports = patternRouter;