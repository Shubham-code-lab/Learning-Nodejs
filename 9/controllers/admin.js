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
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next)=>{
  const prodId = req.params.productId;    //"12345"
  const edit = !!req.query.edit;           //!!"true"  === true   (string is not empty so it is true)  !"true" === false
  console.log(req.params);
  console.log(prodId,edit);
  if(!edit)return;
  Product.findById(prodId,(product)=>{
    if(!product)return;
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      edit,
      product
    });
  });
};

exports.postEditProduct = (req, res, next)=>{
  console.log("hii");
};