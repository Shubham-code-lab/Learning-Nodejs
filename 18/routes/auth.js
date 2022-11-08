const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
//check()  used to check body, parameter, query parameter, header, cookies etc
//body()   get only specific porperties from request body not all other field
const { check, body } = require('express-validator/check');   //import sub-package "check"   //then we destructure and get check function 

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
check('email')
.isEmail()
.withMessage('Invalid Email')
.custom((value, {req})=>{ 
    return User.findOne({ email: value })  //custom function wait for promise,boolean,throw,etc to be return 
    .then(userDoc => {
        if (!userDoc) {
            return Promise.reject('Email id do exist');          //if we return rejected promise to function it create error
        }
        return bcrypt.compare(req.body.password, userDoc.password)
            .then(doMatch => {
                if (!doMatch) {
                    return Promise.reject('password is wrong');
                }
            })
    })
})
,authController.postLogin);

//adding check function that return middleware middleware

//isEmail() check if email from request body is valid email addresss 
//withMessage() uinsg we can customise error message that we get 
//isAlphanumeric()  to check if only contain number and character
//custom() to add our own custom validator
//to add multiple validation we can add multiple middleware  using check function
//OR
//we can wrap all check function in array
router.post('/signup', 
[
check('email')
.isEmail()                                   //built to check if email is valid email
.withMessage('Please enter the valid email') //only if isEmail fail this message is set we have to write again and again for all validator //if validation fail we can add our custom error message default is 'Invalid value'
.custom((value, {req})=>{                 //value is 'email' as pass 'email' to check() function //second argument is object containg various property in case we want something from request use req other are :-location,path
    // if(value === 'test@test.com')
    //     throw new Error('This email address is forbidden');
    // return true;        //otherwise it will give invalid value

    return User.findOne({ email: value })  //custom function wait for promise,boolean,throw,etc to be return 
    .then(userDoc => {
      if (userDoc) {
        return Promise.reject('Email id already exist');          //if we return rejected promise to function it create error
      }
    })
}),
body('password', 'please enter password more then five character')  //if we want same withMessage() for all validation fail we can add it as second argument instead of writting it again and again for each validator
.isLength({min: 5})   //also take max property
.isAlphanumeric(),
body('confirmPassword')
.custom((value, {req})=>{
    if(value !== req.body.password)
        throw new Error("both password don't match");
    return true;
})
]
, authController.postSignup);       

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
