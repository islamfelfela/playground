const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');

router.get('/', (req, res, next)=>{
    Order.find()
   .exec()
   .then(result => {
       console.log(result);
       res.status(200).json(result);
   })
   .catch(err => {
       res.status(500).json({
           error: err
       });
   });
});

router.post('/', (req, res, next)=>{
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });

    order
    .save()
    .then( result => {
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});


router.patch('/:id', (req, res, next)=>{
    res.status(200).json({
        message: 'Order Updated',
        id: req.params.id
    });
});


router.delete('/:id', (req, res, next)=>{
    res.status(200).json({
        message: 'Order Deleted',
        id: req.params.id
    });
});


module.exports = router;