const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' ) {
        cb(null, true); // upload the file
    }else{
        cb(null, false); // ignore the file
        console.log("Not Pitmitted type");
        
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 1
    }
});

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price productImage')
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                products: result.map( doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
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

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
        .then(result => {
            console.log(res);
            res.status(201).json({ // 201 => resource created successfully
                message: 'handeing POST REquest to /products',
                product: result,
                request: {
                    type: "GET",
                    url: "http://localhost:5000/products/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err
            });
        });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .select('name price productImage')
        .exec()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "product fetched",
                    product: result,
                    request: {
                        type: "PATCH",
                        url: "http://localhost:5000/products/" + result._id,
                        body: { name: "String", price: "Number" },
                        description: "You can update product "
                    }
                });
            } else {
                console.log("not found");
                res.status(404).json('resource not found for that id'); // wrong id
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err }); // invalid id

        });

});


router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
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


router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "product deleted",
                request: {
                    description: "You can post new product ",
                    type: "Post",
                    url: "http://localhost:5000/products/",
                    body: { name: "String", price: "Number" }
                }
            });
        })
        .catch(err => {
            console.log("error");
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;