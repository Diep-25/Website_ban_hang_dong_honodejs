const express = require('express');
const router = express.Router();
const productController = require('../../../app/controllers/ProductController');

router.get('/all', productController.index);

router.post('/add-cart/:id', productController.addCart);

router.get('/detail/:id', productController.detail);

router.get('/modal/:id', productController.modal);

router.get('/discount', productController.addDiscount);

module.exports = router;