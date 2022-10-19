const mongoose = require('mongoose');
const Product = require('./product');
const Order = require('./order');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    cart:{
        items:[
            {
                productId:{
                    type: Schema.Types.ObjectId,       //ObjectId type
                    required: true,
                    ref:'Product'          //optional fo nested document
                },
                quantity:{
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

//methods allow us to keep our data related logic to models side instead of in controler side
//we call specified method on instance of User model and hence this keywork refer to that instance 
UserSchema.methods.addToCart = function(product){  //product is object which contain all detail about product we only work with it's _id field
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        // productId: new ObjectId(product._id),        //error 
        productId: product._id,                         //mongoose will automatically type cast it
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;  
    return this.save();          //this keyword refer to insatance of User model which we call req.user.addToCart()  //where user is this keyword
}

UserSchema.methods.getCartProduct = function(){
    return this.cart.items.map(cartProduct=>{
      return {                              
               ...cartProduct.productId._doc,
              quantity: cartProduct.quantity
            }
    })
}

UserSchema.methods.deleteItemFromCart = function(productId){
  const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();    //updating user document
}

UserSchema.methods.addOrder = function(products){  //[{product detail with quantity},{product detail with quantity}]
    const orderData = {
      products: products.map(product=>{
        return {
          product:{...product},
          quantity:product.quantity
        }
      }),
      user: {
        userId: this._id,
        name: this.name
      }
    };
    const order = new Order(orderData);
    return order.save()
    .then(result => {
      this.cart = { items: [] };
      return this.save(); 
    });
}



module.exports = mongoose.model('User', UserSchema);
