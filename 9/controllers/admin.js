const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    edit: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next)=>{   
  const prodId = req.params.productId;    //"12345"
  const edit = !!req.query.edit;           //!!"true"  === true   (string is not empty so it is true)  !"true" === false
  // console.log(typeof req.params.productId);  //type of params and edit is always string 
  // console.log(typeof req.query.edit);
  console.log(prodId,edit);
  if(!edit)return;
  Product.findById(prodId,(product)=>{
    if(!product)return;
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      edit,                                 //it's type is same boolean in ejs files
      product
    });
  });
};

exports.postEditProduct = (req, res, next)=>{
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(id, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next)=>{
  const prodId =req.body.productId;
  Product.deleteProduct(prodId);
  res.redirect('/admin/products');
};