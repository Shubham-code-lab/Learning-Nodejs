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
  console.log(req.user.cart);
  req.user.getCart()             //one to one realtion so we get just one value hence it is singular getCart() not getCarts()
  .then(cart=>cart.getProducts())//many to many realtions so prular getProducts()  
  .then(cartProducts=>{
    res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts
      });
  })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()   //user with one cart
  .then(cart=>{
    fetchedCart = cart;
    return cart.getProducts({where:{id: prodId}})  //cart with many product
  })
  .then(products=>{
    let product
    if(products.length > 0)            //if product already in the cart
      product = products[0];
    if(product){
      let oldQuantity = product.cartItem.quantity;   //product have have access to cartItem as it is through table
      newQuantity += oldQuantity;
      return product                   //get product from cart as it exist and quantity++
    }
    return Product.findOne({where:{id:prodId}})    //get product from Product table       //product and Product is diffrent
  })
  .then(product=>{
    return fetchedCart.addProduct(product,{through:{quantity: newQuantity}})   //add product in the cart
  })
  // .catch(err=>{console.log(err)})
  .then(()=>{
    res.redirect('/cart');
  })
  .catch(err=>console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()                                  //user with one cart
  .then(cart=>cart.getProducts({where:{id:prodId}}))  //cart with many products
  .then(products=>products[0].cartItem.destroy())     //product cart relation ship through cartIteam and then destroy()
  .then(()=>res.redirect('/cart'))
  .catch(err=>console.log(err))
};

exports.postOrder = (req, res, next)=>{
  console.log("post Order");
  let fetchCart;  
 req.user.getCart()      //user with one cart
 .then(cart=>{
  fetchCart = cart;
  cart.getProducts();    //cart with many product
  })
 .then(products=>{
  console.log(products);
    return req.user.createOrder() //creating new order
    .then(order=>{
      return order.addProducts(products.map(product=>{       //hard to undersand
        product.orderItem = {quantity: product.cartItem.quantity}    //product has access to cartItem
        return product
      }));
    })
    .catch(err=>console.log(err));
 })
 .then(result=>{
   return fetchCart.setProducts(null);      //reseting through cartItem table //so as to remove all item from cart
 })
 .then(result=>{res.redirect('/orders')})
 .catch(err=>console.log(err));
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})    //hard to understand
  .then(orders=>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders
    });
  })
  .catch(err=>console.log(err));
};