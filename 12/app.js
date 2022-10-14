const path = require('path');
const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { MongoDBNamespace } = require('mongodb');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("63458644466005aa01ba432d")
  .then(user=>{
    req.user = new User(user.name, user.email, user.cart, user._id);    //understand we create new instance of User and set it to existing user from database
    console.log("app.use() user", req.user);
    next();
  })
  .catch(err=>console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(()=>{
  // User.findById("63458644466005aa01ba432d")
  // .then(user=>{
  //   console.log("");
  //   if(!user){
    // user = new User("Shubham", "shubhamshinde281999@gmail.com", {items:[]}, new mongodb.ObjectId("63458644466005aa01ba432d"));
    // user.save();
//   }})
//   .catch(err=>console.log(err));
  app.listen(3000);
});
