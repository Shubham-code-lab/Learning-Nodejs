const modelProducts = require('../model/products');

exports.getProduct=(req, res, next) => {
  // const products = adminData.products;
  modelProducts.Product.fetchProduct((products)=>{
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  }); 
}

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
}

exports.postAddProduct= (req, res, next) => {
    const newProduct = new modelProducts.Product(req.body.title);
    newProduct.save();
    // products.push({ title: req.body.title });
    res.redirect('/');
}