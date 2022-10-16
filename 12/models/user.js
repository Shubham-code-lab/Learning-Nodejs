const getDb = require('../util/database').getDB;
const mongodb = require('mongodb');
const Product = require('./product');

class User{
  constructor(userName, email, cart, userId){
    this.name = userName;
    this.email = email;
    this.cart = cart;         //{items: []}
    this._id = userId;
  }

  save(){
    let db = getDb();
    return db.collection('users').insertOne(this)
    .then(user=>{
      console.log("save() User",user);
      return user;
    })
    .catch(err=>console.log(err))
  }

  addToCart(prodId){    //we retirive user data  from database(app.js) and created new user instance just to call addToCart on it so we have access to that retirve user cart,id,etc
    const cartProductIndex =this.cart.items.findIndex(cartProduct=>cartProduct.productId.toString() === prodId.toString())    //both might be of diffrent string format //object or primitive string

    const newQuantity = 1;

    if(cartProductIndex >=0)  //product exist
      this.cart.items[cartProductIndex].quantity += newQuantity;    //update quantity
    else                      //product not exist
      this.cart.items.push({productId: prodId, quantity: newQuantity});  //add new product to cart

    const db = getDb();
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{ cart: this.cart}}); //update databasr cart array with this.cart
  }

  getCartProducts(){
    const cartProductId = this.cart.items.map(cartItem=>cartItem.productId);    //[{id,qty},{id,qty}]
    const db = getDb();
    return db.collection('products')
    .find({_id: {$in:cartProductId}})            //return all product from products database by all id in cartproductId array [id1,id2,...]
    .toArray()
    .then(products=>{ // [{productDetial},{productDetail}]
      return products.map(product=>{           //map products to return new array
        return {                               //the array that return object  [{productDetail also contain quantity property},{productDetail also contain quantity property}]  //
          ...product,                          //productDetail         
          quantity: this.cart.items.find(cartItem=>cartItem.productId.toString()===product._id.toString()).quantity}  //quantity :- find product from cart by comparing id from product and extract it's quantity  property
      })
    })
  }

  deleteCartProduct(prodId){
    const db = getDb();
    this.cart.items = this.cart.items.filter(cartProduct=>cartProduct.productId.toString()!==prodId.toString());  //convert both to string type 
    return db.collection('users').updateOne({_id: this._id},{$set:{cart: this.cart}});
  }

  addOrder(){
    const db = getDb();
    return this.getCartProducts()    //getting cart product by memeber method
    .then(products=>{                //[{productDetail also contain quantity property},{productDetail also contain quantity property}]
      const order = {                //order  format to insert
        items: products,
        user: {
          _id : new mongodb.ObjectId(this._id),
          name: this.name
          }
        }
      return db.collection('orders').insertOne(order)   //inserting the formatted order
    })
    .then(result=>{
      this.cart = {items:[]};                              //resetting cart
      return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{cart: this.cart}}); //updating the resetted cart
    })
    .catch(err=>console.log(err))
  }

  getOrders(){
    const db = getDb();
    return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray() 
    //result:- [{_id,items:[{productDetail also contain quantity property},{productDetail also contain quantity property}],user:{_id,name}},{_id,items:[{productDetail also contain quantity property},{productDetail also contain quantity property}],user:{_id,name}}]
    .then(result=>{f
      // console.log("get orders", result);
      return result;
    })
    .catch(err=>console.log(err))
  }

  static findById(userId){
    let db = getDb();
    return db.collection('users')
    .findOne({_id: new mongodb.ObjectId(userId)}) //OR  find().next()
    .then(user=>{
      console.log("user findById",user);
      return user;
    })
    .catch(err=>console.log(err));
  }
};

module.exports = User;
