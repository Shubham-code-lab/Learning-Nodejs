const Cart  = require('../models/cart');
const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  console.log("get Index");
  Product.fetchAll(products => {
    res.render('shop/index', { 
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  console.log("get cart");
  Cart.getCartProducts(cart=>{
    Product.fetchAll(products=>{
      const cartProducts = [];
      for(idAndQuatity of cart.products){
        const productData = products.find(product=>parseFloat(product.id) === parseFloat(idAndQuatity.id))
        cartProducts.push({productData,qty: idAndQuatity.qty});
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    })
  })
};

exports.postCart = (req, res , next)=>{
  console.log("post call");
  const prodId = req.body.productId;
  Product.findById(prodId, (product)=>{
    Cart.addProduct(prodId, product.price);
    res.redirect('/cart');
  });
}


exports.postCardDeleteItem = (req,res,next)=>{
  const prodId = req.body.productId;
  Product.findById(prodId,(product)=>{
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getProducts = (req, res, next) => {
  console.log('get products');
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) =>{
  console.log('get product');
  const prodId = req.params.productId
  Product.findById(prodId, (product)=>{
    res.render('shop/product-detail',{product,pageTitle: product.title,path:'/products'});
  });
};