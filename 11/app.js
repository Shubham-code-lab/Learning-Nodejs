const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');

const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{                   //execute for all rounte
    User.findOne({where:{id:1}})
        .then(user=>{
            req.user = user;            //we can set our own property to req object
            next();     //call next only when we set req.user as this is asyncronice code 
        })
        
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//define realtion
// one to many
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})  //multiple product can be created by one user
User.hasMany(Product);  //user has many product

// one to many
User.hasOne(Cart);  //one user has one cart
Cart.belongsTo(User); //one cart has one user

// many to many
// thorough -> where the connection is store
Cart.belongsToMany(Product, {through: CartItem}); //same cart has many product
Product.belongsToMany(Cart,  {through: CartItem}); //same product in many cart

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

//create table and relation
//force true recreate table each time even when they exist
sequelize
// .sync({force: true})
.sync()
.then(result=>{
    // console.log(result);
    return User.findOne({where:{id:1}});
})
.then(user=>{             
    // console.log(user);
    if(!user)          //create user if not exist 
        return User.create({name:"Shubham", email:"shubhamshinde@gmail.com"});
    return user;
})
.then(user=>user.createCart())
.then(cart=>app.listen(3000))
.catch(err=>{
    console.log(err);
})

