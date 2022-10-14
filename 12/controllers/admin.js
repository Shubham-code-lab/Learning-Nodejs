const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  console.log("post add product",req.user._id);
  const product = new Product(title, imageUrl, price, description, null, userId);
  product.save()
  .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  console.log("get edit id",prodId);
  Product.findById(prodId)
    .then(product => {        //{}
      if (!product) {
        return res.redirect('/');
      }
      console.log("get Edit",product);
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const userId = req.user._id;
  // Product.findById(prodId)
  // .then(product=>{
  //   const id = product._id;
  console.log("post Edit", prodId);
     const newProduct = new Product(updatedTitle, updatedImageUrl, updatedPrice,  updatedDesc, prodId, userId);
     newProduct.save() 
  // })

  // Product.findByPk(prodId)
  //   .then(product => {
  //     product.title = updatedTitle;
  //     product.price = updatedPrice;
  //     product.description = updatedDesc;
  //     product.imageUrl = updatedImageUrl;
  //     return product.save();
  //   })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()  
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
  .then(result => {
    console.log('DESTROYED PRODUCT');
    req.user.deleteCartProduct(new mongodb.ObjectId(prodId))   //also delete product from user cart
    .then(result=>{
      res.redirect('/admin/products');
    })
  })
  .catch(err => console.log(err));
};
