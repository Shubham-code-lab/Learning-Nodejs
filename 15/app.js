const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');         
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
'mongodb+srv://Shubham:8806166977a@cluster0.pjapwbk.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();  //csrf funtion //it can accept object with configuration //defualt is fine

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//After session middleware use csrfProtection middleware  
//using this middleware we get req.csrfToken() method on each request using which we can set token and sent it to view
//then in <form> tag we have to pass token as value field and name as _csrf that it
app.use(csrfProtection); 
//csrf work for post request as they are used for changing data not for get request
//for any post request this package look for csrf token in your view(request)

app.use(flash());    //now we can create session property which is destroy automatically when we use it just once

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn; // locals are express feature which allow us to send certain data to all the views that we render
  res.locals.csrfToken = req.csrfToken();  //while csrfToken() generate and encrypted hashed token
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: 'Max',
    //       email: 'max@test.com',
    //       cart: {
    //         items: []
    //       }
    //     });
    //     user.save();
    //   }
    // });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
