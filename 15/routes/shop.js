const path = require('path');

const is_auth = require('../middleware/is-auth');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', is_auth.is_auth, shopController.getCart);  //we can add multiple middleware on same route they execute from left to right

router.post('/cart', is_auth.is_auth, shopController.postCart);

router.post('/cart-delete-item', is_auth.is_auth, shopController.postCartDeleteProduct);

router.post('/create-order', is_auth.is_auth, shopController.postOrder);

router.get('/orders', is_auth.is_auth, shopController.getOrders);

module.exports = router;
