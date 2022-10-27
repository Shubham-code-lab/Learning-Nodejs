const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);  //return function on which we pass session as argument

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//we execute session and we pass configuration object which contain
//secret //used for assigning the hash which store our id in cookie
//resave  //so that session is not save on every request only save on when session changes(for performance)
//saveUninitialized  //ensure session don't save when it don't need to save
//cookie:{expires}   //we can also configure session cookie which contain session id
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false}) );

app.use((req, res, next) => {
  User.findById('634cf44a51a2251fd8ec6409')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://Shubham:8806166977a@cluster0.pjapwbk.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Shubham',
          email: 's@.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
