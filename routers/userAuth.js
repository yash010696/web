const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var passport = require('passport');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const UserAuth = require('../models/userAuth');
const userLoginRouter = express.Router();
const config = require('../config/config');

userLoginRouter
    .route('/login')
    .post((req, res) => {
        console.log(req.body);
        UserAuth.find({
                username: req.body.username
            })
            .populate("role")
            .exec()
            .then(user => {
                console.log(user);
                if (user.length < 1) {
                    return res.status(401).json({
                        error: "User not found"
                    });
                }
                console.log(user[0].password)
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(401).json({
                            error: "Auth failed"
                        });
                    }
                    if (result) {
                        console.log(user);
                        // const payload = {
                        //     userId: user[0]._id,
                        //     email: user[0].email,
                        //     username: user[0].username,
                        //     role: user[0].role.name,
                        //     created_by: user[0].created_by,
                        // };
                        // const token = jwt.sign(
                        //     payload,
                        //     config.secret, {
                        //         expiresIn: "1h"
                        //     }
                        // );
                        // return res.status(200).json({
                        //     message: "Auth successful",
                        //     token: token
                        // });
                    }
                    res.status(401).json({
                        error: "Wrong Password"
                    });
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

userLoginRouter
    .route("/singupUser")
    .post((req, res) => {
        UserAuth.find({
                email: req.body.email
            })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: "Mail exists"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const user = new UserAuth({
                                _id: new mongoose.Types.ObjectId(),
                                first_Name: req.body.first_Name,
                                last_Name: req.body.last_Name,
                                franchise: req.body.franchise,
                                role: req.body.role,
                                email: req.body.email,
                                mobile: req.body.mobile,
                                username: req.body.username,
                                password: hash,
                                address: req.body.address,
                                pincode: req.body.pincode,
                                city: req.body.city,
                                state: req.body.state,
                                // created_by: req.body.admin_id,
                                created_at: new Date(),
                                updated_by: null,
                                updated_at: new Date(),
                                status: true
                            });
                            user
                                .save()
                                .then(result => {
                                    res.status(201).json({
                                        message: "User created"
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }
                    });
                }
            });
    });

module.exports = userLoginRouter;