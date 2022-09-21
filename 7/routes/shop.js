const path = require('path');

const express = require('express');

const rootDir = require('../util/path');


const controllerProducts = require('../controller/products');

const router = express.Router();

router.get('/', controllerProducts.getProduct);

module.exports = router;
