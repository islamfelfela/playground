const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'handeing GET REquest to /orders'
    });
});

router.post('/', (req, res, next)=>{
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }

    res.status(201).json({ // 201 => resource created successfully
        message: 'handeing POST REquest to /orders',
        order
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