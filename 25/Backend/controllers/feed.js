const {validationResult} = require('express-validator/check');
const Post = require('../models/post.js'); 

exports.getPosts = (req, res, next) => {
  Post.find()
  .then(posts=>{
    console.log('get all post',posts);
    res.status(200).json({message:'Fetched posts successfully',posts});
  })
  .catch(err=>{
    if(!err.statusCode){
      err.statusCode = 500; 
    }
    next(err);
  })
  
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    // return res.status(422).json({message: 'validation failed, enter data is incorrect', errors: errors.array()})  
    
    //genral error handling function will handle it
    const error = new Error('validation failed, enter data is incorrect');
    error.statuscode = 422;
    throw error;  //terminate the current function if we don't catch it
  }

  if (!req.file) {    //throw error when no images is uploaded by client
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;  //mutator attach path of file to request

  const title = req.body.title;
  const content = req.body.content;
  // Create post in db

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: {
      name: 'Maximilian'
    }
    //_id and createdAt automaticaly created by mongodb
  });

  post.save()
  .then(post=>{
    
    res.status(201).json({
      message: 'Post created successfully!',
      post: post  //along with _id and createdAt 
      // { 
      //    _id: new Date().toISOString(),
      //    title: title,
      //    content: content,
      //    creator: {
      //     name: 'Maximilian'
      //   },
      //    createdAt: new Date() //not creating , not attaching, not creating date //so error?
      //   }
    });
  })
  .catch(err=>{
    if(!err.statusCode){  //if don't have statusCode attach
      err.statusCode = 500; 
    }
    next(err);
  })
};

exports.getPost = (req, res, next) =>{
  const postId = req.params.postId;
  Post.findById(postId)
  .then(post=>{
    if(!post){  
      const error = new Error('could not find post.');
      error.statusCode = 404;
      throw error; //catch will catch the error and send that error to next(error) which is handle by custom error handling function define in app.js
    }
    console.log("get single post", post);
    res.status(200).json({message:'Single post fetch!!', post})
  })
  .catch(err=>{
    if(!err.statusCode){ 
      err.statusCode = 500; 
    }
    next(err);
  })
};