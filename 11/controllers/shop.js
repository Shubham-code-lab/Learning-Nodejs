const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  // we can add where condition in findAll method
  Product.findAll()
    .then(products=>{                  //[product:{dataValues:{},metaData:{}},product:{dataValues:{},metaData:{}}]
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err=>console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // Product.findAll({where: {id: prodId}})
  // .then(([{dataValues}])=>{        //[product:{dataValues:{},metaData:{}},product:{dataValues:{},metaData:{}}]
  //   res.render('shop/product-detail', {
  //     product: dataValues,
  //     pageTitle: dataValues.title,
  //     path: '/products'
  //    });
  //  })
  // .catch(err=>console.log(err))


  Product.findOne ({where: {id: prodId}})
    .then(({dataValues}) => {         //product:{dataValues:{},metaData:{}}
      res.render('shop/product-detail', {
        product: dataValues,
        pageTitle: dataValues.title,
        path: '/products/any'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  console.log("shop index");
  // we can add where condition in findAll method
  Product.findAll()
    .then(products=>{                 //[product:{dataValues:{},metaData:{}},product:{dataValues:{},metaData:{}}]
      res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
      });
  })
    .catch(err=>console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

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
