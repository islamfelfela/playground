const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity')
        .populate('product', 'name')
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                orders: result.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/orders/" + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(result => {
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });

            order
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        order: result,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/orders/" + result._id
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                });
        })
        .catch(err => {
            res.status(500).json({
                message: "No Product exist with that id",
                error: err
            });
        });


});


router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Order.findById(id)
        .select(' product quantity')
        .populate('product', 'name price')
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Order fetched",
                    order: result,
                    request: {
                        type: "PATCH",
                        url: "http://localhost:5000/orders/" + result._id
                    }
                });
            } else {
                res.status(404).json("Order Not Found");
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    Order.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Updated",
                order: result,
                request: {
                    descreiption: "youcan delete this order",
                    type: "DELETE",
                    url: "http://localhost:5000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                request: {
                    description: "You can Post new order",
                    type: "GET",
                    url: "http://localhost:5000/orders",
                    body: { productId: "String", quantity: "Number" }
                }
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