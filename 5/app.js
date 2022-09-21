// const http = require('http');

const express = require('express');

const path = require('path');

const adminRoutes = require('./routes/admin.js');    //import the routes
const userRoutes = require('./routes/shop.js');

const app = express();

const bodyParser = require('body-parser');      //only data  (from tag) not from file, json 

app.use(bodyParser.urlencoded({extended: false}));  //middleware that does parsing for us and call next()  automatically  /extended: false parse non-default

//grant access to public folder now <link href="/cc/main.css"> client can request to this files
app.use(express.static(path.join(__dirname, 'public')));

//using the imported routes order is important
//   /admin  is fiter for  /admin/(any routes that is present in adminRoutes)
app.use('/admin',adminRoutes);        
app.use(userRoutes);

app.use((request,response, next)=>{
        
        // response.status(404).send('<h1>Page not found</h1>');
        response.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
});

app.listen(3000);
//oR
// const server = http.createServer(app);
// server.listen(3000);
