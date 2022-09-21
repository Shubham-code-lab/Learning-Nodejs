const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const controllerProducts = require('../controller/products');

const router = express.Router();


// /admin/add-product => GET
router.get('/add-product', controllerProducts.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', controllerProducts.postAddProduct);

exports.routes = router;

