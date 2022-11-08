const crypto = require('crypto');     //create secure randow values built in library
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');  

const User = require('../models/user');

const transporter = nodemailer.createTransport(   //tell nodemailer how to deliver mail as nodejs don't send mail
  {
    service: 'gmail',
    auth: {
      user: 'shubhamhemant08@gmail.com',  //follow bellow process to allow nodemailer to send email through email id having 2-step verifaction
      pass: 'ueylblefnlvyblnv'           //https://stackoverflow.com/questions/45478293/username-and-password-not-accepted-when-using-nodemailer
    }
  }
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash(
          'error',
          'E-Mail exists already, please pick a different one.'
        );
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');                //we redirect before sending mail becoz sometime mail might cause error and user don't get response we be redirect to response on sendMail()
          return transporter.sendMail({         //we send mail
            from: 'shubhamhemant08@gmail.com', 
            to: email,
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};


exports.postReset = (req, res, next)=>{
  crypto.randomBytes(32, (err,buffer)=>{           //first argument 32 random bytes  //second argument is callback contain buffer which has random bytes and another err when error occur
    if(err){                                       
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');      //information that value is hexadecimal  that need to be converted into string ASCII
    User.findOne({email: req.body.email})      //find email with provided email id
    .then(user=>{
      if(!user){
        req.flash('error', 'no email found');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;   //current time in millisecond + 1 hour in millisecond
      user.save()     //updating user data
          .then(result=>{
            res.redirect('/');                
            return transporter.sendMail({        
              from: 'shubhamhemant08@gmail.com', 
              to: req.body.email,
              subject: 'Reset password!',  
              html: `                                     
                <p>You requested password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset a password </p>  
              `
              //Dynamic path segment
            });
          })
          .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  })
};

exports.getNewPassword = (req, res, next)=>{
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration:{$gt: Date.now()}})   //get user by token and token is not expire
  .then(user=>{
    if(!user){
      return res.redirect('/');
    }
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New password',
      errorMessage: message,
      userId: user._id.toString(),
      resetToken: token
    });
  })
  .catch(err=>console.log(err))
};

exports.postNewPassword = (req, res, next)=>{
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.resetToken;
  User.findOne({_id: userId, resetToken: token, resetTokenExpiration:{$gt:Date.now()}})
  .then(user=>{
    if(!user){
      req.flash('error', 'fail to update password');
      return res.redirect('/reset');
    }
    bcrypt.hash(newPassword, 12)
          .then(hashedPassword=>{
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            user.save()
                .then(result=>{
                  res.redirect('/login');
                })
                .catch(err=>console.log(err))
          })
  })
  .catch(err=>console.log(err))
}