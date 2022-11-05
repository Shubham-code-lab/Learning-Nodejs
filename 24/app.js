//API endpoint (http method + url)

const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>         //work for request comming from <form> tag
app.use(bodyParser.json()); // application/json

//when our client and server run on same domain/server there is no cors error (cross-origin-resourse-sharing)
//but when they both are on diffrent domain client browser porvide a secuirty mechanisum for not sharing resources across diffrent domain
//in order to tell browser to accept resources we need to add some header to all responses
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');      //all domain to access our server  //second argument domain that can accept i.e 'codepen.io,google.com' or we just use wilcard '*' for all domain
    res.header('Access-Control-Allow-Methods', 'GET ,POST, PUT, PATCH, DELETE');     //what method can  it accesss
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')      //header that client set on their request  //we can use wildcard '*' for all //some default header are always set weather we specify them or not
    next();
});

app.use('/feed', feedRoutes);

app.listen(8080);        

//1
//Ajax, fetch, axios
//client side code

//2
//GET request to server

// fetch('http://localhost:8080/feed/posts')
// .then(res=>res.json())
// .then(resData=>{console.log(resData)})


//3
//POST request to server
//before browser send our POST request first it send OPTIONS request on it own to check if post request is ollowed or not

// fetch('http://localhost:8080/feed/post',{
//     method: 'POST',
//     body:  JSON.stringify({     //we have to convert js object into json before passing it to server through request
//         title: 'this is title',
//         content: 'this is content'
//     }),
//     header:{          //setting header of request 
//         'Content-Type': 'application/json'
//     }
// })


