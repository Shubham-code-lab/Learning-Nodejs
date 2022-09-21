const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct); //function calling order //getProduct(),findById(cb1),getProductsFromFile(cb2),cb2(),cb1()

module.exports = router;
