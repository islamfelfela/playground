const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next)=>{
   Product.find()
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
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
    .then(result => {
        console.log(res);
        res.status(201).json({ // 201 => resource created successfully
            message: 'handeing POST REquest to /products',
            product : result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });
});

router.get('/:id', (req, res, next)=>{
    const id = req.params.id;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json(doc);    
        }else{
            console.log("not found");
            res.status(404).json('resource not found for that id'); // wrong id
        }
     })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err}); // invalid id
        
    });
    
});


router.patch('/:id', (req, res, next)=>{
    const id = req.params.id;
    Product.findByIdAndUpdate({ _id: id}, { $set:  req.body}, { new: true })
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


router.delete('/:id', (req, res, next)=>{
   const id = req.params.id;
   Product.remove({ _id: id})
   .exec()
   .then(result => {
       console.log(result);
       res.status(200).json(result);
   })
   .catch(err => {
       console.log("error");
       res.status(500).json({
           error: err
       });
   });
});

module.exports = router;