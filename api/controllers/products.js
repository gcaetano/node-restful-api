const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getAll = (req, res, next) => {
    Product.find()
        .select('nome price _id productImage')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message })
        });
};

exports.create = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests for /products',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message })
        });
}

exports.getById = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('nome price _id productImage')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(200).json({ message: "No valid entity found for the provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
};

exports.update = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    console.log(req.body);
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, {
        $set: updateOps
    })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated.',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
}

exports.delete =  (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: {
                        name: "String",
                        price: 'Number'
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
}