const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res, next) => {
    User.find()
    .exec()
    .then(result => {
        res.status(200).json({
            count: result.length,
            users: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) { // email exists
                console.log(user);
                res.status(409).json({ // conflict data
                    message: "User Exists"
                });
            } else { // email is unique
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({ // resource Created
                                    message: "User Created"
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

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({ // Unautharized
                    message: "Auth Faild 1"
                });
            }

            if (user) {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({ // Unautharized
                            message: "Auth Faild 2"
                        });
                    }

                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                id: user[0]._id
                            },
                            'secret',
                            {
                                expiresIn: "1h"
                            }
                        );

                        return res.status(200).json({
                            message: "Auth Succeded",
                            token
                        });
                    }

                    return res.status(401).json({ // Unautharized
                        message: "Auth Faild 3"
                    });
                });
            }


        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:id', (req, res, next) => {
    User.remove({ _id: req.params.id }).exec()
        .then(result => {
            res.status(200).json({
                message: "User Deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;