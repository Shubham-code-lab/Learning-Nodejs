const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('634cf44a51a2251fd8ec6409')  //type coersion into ObjectId
    .then(user => {
      req.user = user;   //as user is special mongoose model so we can use method on it
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(                                                         //if "shop" not provided it create database name "test"
    'mongodb+srv://Shubham:8806166977a@cluster0.pjapwbk.mongodb.net/shop?retryWrites=true&w=majority'
  )      
  .then(result => {
    User.findOne()              //return first document it find
    .then(user=>{
      if(!user){                //create ne user only if there is no user
        const user = new User({
          name: "Shubham",
          email: "s@gmail.com",
          cart: {
            items:[]
          }
        });
        return user.save()
      }
    })
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
