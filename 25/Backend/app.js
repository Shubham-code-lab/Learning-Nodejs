const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const feedRoutes = require('./routes/feed');
const multer = require('multer'); //to store incoming file from requst

const app = express();

const fileStorage = multer.diskStorage({ //where to store file
    destination: (req, file, cb) => {  
      cb(null, 'images');      //store incoming image/file in images folder
    },
    filename: (req, file, cb) => { 
      cb(null, new Date().toISOString().replaceAll(':', '-') + file.originalname);  //store file/image with name
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (           //only store when file is of below type otherwise reject
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')); //configuring mutator

app.use('/images', express.static(path.join(__dirname, 'images')));  //public available

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use('/feed', feedRoutes);

app.use((error, req,res,next)=>{  //custom error handling function
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message});
})

mongoose.connect('mongodb+srv://Shubham:8806166977a@cluster0.pjapwbk.mongodb.net/messages?retryWrites=true&w=majority')
.then(result=>{
    app.listen(8080);
})
.catch(err=>console.log(err))
