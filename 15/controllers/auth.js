const User = require('../models/user');
const bcryptjs = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
    .then(userExist => {
      if(!userExist){
        return redirect('/');
      }
      bcryptjs.compare(password, userExist.password)
        .then(areMatch=>{
          if(areMatch){
            req.session.isLoggedIn = true;
            req.session.user = userExist;
            req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
        })
        .catch(err=>console.log(err))      
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassord =req.body.confirmPassword
  User.findOne({eamil: email})
    .then(userExist=>{ 
      if(userExist) return res.redirect('/signup');        //check if user exist
      bcryptjs.hash(password,12)                           //hashed the password(encrypt) while 12 is number of round to encrypt //minimum 12 is the limit 
        .then(encryptedPassword=>{
            const user = new User({email,password: encryptedPassword, cart:{items:[]}});
            return user.save();                       
        })
        .then(result=>res.redirect('/login'))
        .catch(err=>console.log(err))
  })
  .catch(err=>console.log(err))
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
