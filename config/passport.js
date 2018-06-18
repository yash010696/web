var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the admin model
var Admininfo = require('../models/admininfo');
var Customer = require('./../models/customer');
var config = require('./config'); // get db config file

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {

        Admininfo.findOne({ id: jwt_payload.id }, function (err, user) {

            if (err) {
                return done(err, false);
            }
            else if (user == null) {
                Customer.findOne({ id: jwt_payload.id }, function (err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    if (user) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            } else {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            }
        });
    }));
};
