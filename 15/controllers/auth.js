const User = require('../models/user');
const bcryptjs = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  let postFail =  req.flash("error");    //return array
  if(postFail.length  > 0)
    postFail = postFail[0]
  else postFail =  null;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    postFail
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup'
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
    .then(userExist => {
      console.log(userExist);
      if(!userExist){           //if email not exist 
        req.flash('error', 'email is wrong');
        return res.redirect('/login');
      }
      bcryptjs.compare(password, userExist.password)   //compare both password and hashed password(userExist.password)   
        .then(areMatch=>{                 //response return boolean value of the above comparison
          if(areMatch){
            req.session.isLoggedIn = true;
            req.session.user = userExist;
            req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          else{         //email exist but password don't match
            req.flash('error', 'password is wrong');
            return res.redirect('/login');
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
      bcryptjs.hash(password,12)                           //hashed the password(encrypt) while 12 is number of times to encrypt //minimum 12times is safe
        .then(encryptedPassword=>{                         //response return an ecrypted hashed password
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
