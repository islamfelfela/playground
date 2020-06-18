const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity')
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                orders: result.map( doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/orders/"+ doc._id
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
                    type: "",
                    url: ""
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});


router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Order.findById(id)
    .select(' product quantity')
    .exec()
    .then(result => {
        if (result) {
            res.status(200).json({
                message: "Order fetched",
                order: result,
                request: {
                    type: "PATCH",
                    url: "http://localhost:5000/orders/"+ result._id
                }
            });
        }else{
            res.status(404).json("Order Not Found");
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});


router.delete('/:id', (req, res, next) => {
    res.status(200).json({
        message: 'Order Deleted',
        id: req.params.id
    });
});


module.exports = router;