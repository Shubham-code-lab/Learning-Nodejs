const product = require('../models/product');
const Product = require('../models/product');
const Order  = require('../models/order');

exports.getProducts = (req, res, next) => {
  //find return all product to return cursor we use Product.find().cursor().eachAsync()
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)       //mongoose findById(prodId) where prodId is type coersion by mangoose into ObjectId(prodID)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  //find return all product to return cursor we use Product.find().cursor().eachAsync()
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')   //populate will get document for the coresponding Id
    .then(user => {
      const products = user.getCartProduct();  //custome getCart method called on model instance
      console.log("getCart",products);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)    //no need to get entire product as we only work with Product _id field
    .then(product => {
      return req.user.addToCart(product);
    })  
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)   //custome method called on model intance
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')   //populate will get document for the coresponding Id
    .then(user => {        
      const products = user.getCartProduct();  //custome getCart method called on model instance
      console.log("post Order",products);
      user.addOrder(products)
      .then(result => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
    })
};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
