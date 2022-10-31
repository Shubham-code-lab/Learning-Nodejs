const path = require('path');

const is_auth = require('../middleware/is-auth');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', is_auth.is_auth, adminController.getAddProduct);    //we can add multiple middleware on same route they execute from left to right

// /admin/products => GET
router.get('/products', is_auth.is_auth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', is_auth.is_auth, adminController.postAddProduct);

router.get('/edit-product/:productId', is_auth.is_auth, adminController.getEditProduct);

router.post('/edit-product', is_auth.is_auth, adminController.postEditProduct);

router.post('/delete-product', is_auth.is_auth, adminController.postDeleteProduct);

module.exports = router;
