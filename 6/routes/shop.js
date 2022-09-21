const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const adminData = require('./admin.js');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(adminData.products);
  
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  
  // res.render('shop', {pageTitle: 'Shop', prods: adminData.products});   //PUG :- render shop.pug and passed object  for dynamic content in html
  
  // res.render('shop', {    //express-handlebars
  //   pageTitle: 'Shop', 
  //   hasProduct: adminData.products.length > 0,
  //   prods: adminData.products,
  //   productCSS: true,
  //   activeShopPage: true,
  //   // layout: false    //when you don't want to use main-layout.hbs
  // });   //Express-Handlebars :-

    res.render('shop',  {pageTitle: 'Shop', prods: adminData.products});

});

module.exports = router;
