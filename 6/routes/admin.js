const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];            //as long as our node app run this don't reset 

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  console.log("get /admin/add-product");

  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));

  // res.render('add-product', {pageTitle: "Add Product"});   //PUG

  // res.render('add-product', {      //express-handlebars
  //   pageTitle: "Add Product",
  //   productCSS: true,
  //   formCSS: true,
  //   activeAddProductPage:true,
  //    // layout: false    //when you don't want to use main-layout.hbs
  // });      //.pug extension added automatically

  res.render('add-product', {pageTitle: "Add Product"}); //ejs
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  console.log("post /admin/add-product");

  products.push({productName: req.body.productName});

  res.redirect('/');
});

module.exports.router = router;            //app.js router is used to add aditional middleware
module.exports.products = products;        //exported products data so used in shop.js to display those data