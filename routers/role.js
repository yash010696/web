var express = require('express');
const config = require('../config/config');
var jwt = require('jsonwebtoken');
var Role = require('../models/role');
var roleRouter = express.Router();
const checkAuth = require('../middlewear/check-auth');
//Create router for  register the new role.
roleRouter
    .route('/role')
    .post(checkAuth, function (req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else {
            var counter;
            Role.find().exec(function (err, results) {
                var count = results.length;
                counter = count + 1;
                savedata(counter);
            });
        }
        function savedata(counter) {
            var myDateString = Date();
            var cc = counter;
            console.log('cc', cc);
            // var area = new Area(req.body);
            var role = new Role({
                // id: cc,
                name: req.body.name.toLowerCase(),
                created_by: req.userData._id,
                created_at: myDateString,
                updated_by: null,
                updated_at: myDateString,
                status: true,
                state: true
            });
            role.save(function (err) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.json({ data: role, success: true, msg: 'Successful created new role.' });
            });
        }
    })
    //Create router for fetching All roles.
    .get(checkAuth, function (req, res) {
        Role.find({ state: true }, function (err, roles) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            console.log(roles);
            const dataRes = roles.filter(element => element.name == "store manager");
            const roleRes = roles.filter(element => element.name !== "store manager" && element.name !== "admin");
            let obj = {
                roles: roles,
                dataRes: dataRes,
                roleRes: roleRes
            }
            res.json(obj);
        });
    });
//Create router for fetching Single role.
roleRouter
    .route('/roles/:roleId')
    .get(checkAuth, function (req, res) {
        console.log('GET /roles/:roleId');
        var roleId = req.params.roleId;
        Role.findOne({ id: roleId }, function (err, role) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            console.log(role);
            res.json(role);
        });
    })
    //Create router for Updating role.
    .put(checkAuth, function (req, res) {
        console.log('PUT /roles/:roleId');
        var roleId = req.params.roleId;
        Role.findOne({ _id: roleId }, function (err, role) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            var myDateString = Date();
            if (role) {
                role.name = req.body.name.toLowerCase();
                role.updated_by = req.userData._id;
                role.status = req.body.status;
                role.updated_at = myDateString;
                role.save();

                res.json(role);
                return;
            }
            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
roleRouter
    .route('/roless/:roleId')
    .put(checkAuth, function (req, res) {
        console.log('PUT /roless/:roleId');
        var roleId = req.params.roleId;
        Role.findOne({ _id: roleId }, function (err, role) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (role) {
                role.state = false;

                role.save();
                res.json(role);
                return;
            }
            res.status(404).json({
                message: 'Unable to found.'
            });
        });
    })
module.exports = roleRouter;