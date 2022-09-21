const express = require('express');

const path = require('path');

const rootDir = require('../util/path.js');

//express special function that return object to handle routes
const router = express.Router();

//routting is check from top to bottom
router.use('/', function(request, response, next){ 
    console.log("middleware that execute for every request");
    console.log(require.main.filename);
    console.log(path.dirname(require.main.filename));
    next();     //so that other middleware are called hence we should not send response in this function
});

// /admin/add-prouct => GET
router.get('/add-product', function(request, response, next){
    console.log("add-product page /add-product middleware");

    // response.send(`<h1>Second Page</h1>
    //                     <form method="post" action="/admin/product"><input name="name" type="text"><button type="submit">submit</button></form>
    //                 `); //content-type is automatically set

    // response.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
    
    response.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

//app.get(),app.patch(),app.put,app.delete()  //work for specific request app.use() work for all type of request
//while post for post request
//router === app
//  admin/product => POST
router.post('/product', function(request, response, next){
    console.log("product page / middleware ");
    console.log('on product page', request.body);   //undefine if we don't parse so we use body-paerser wich does it for us
    response.redirect('/');             //express function similar to node were we set status code and setheader
});

module.exports = router;