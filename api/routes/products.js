const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (rec, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (rec, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (rec, file, cb) => {
    // reject a file;
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', ProductsController.getAll);


router.post('/', checkAuth, upload.single('productImage'), ProductsController.create);

router.get('/:productId', ProductsController.getById);

router.patch('/:productId', checkAuth, ProductsController.update);

router.delete('/:productId', checkAuth, ProductsController.delete);

module.exports = router;