const {validationResult} = require('express-validator/check');
const fs = require('fs');
const path = require('path');
const Post = require('../models/post.js'); 

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.currentPage || 1;
  const postPerPage = 2;
  let totalPosts = 0;
  Post.find()
  .countDocuments()
  .then(totalDocumnet=>{
    totalPosts = totalDocumnet;
    return Post.find().skip((currentPage-1) * postPerPage).limit(postPerPage)
  })
  .then(posts=>{
    res.status(200).json({message:'Fetched posts successfully',posts, totalItems: totalPosts});
  })
  .catch(err=>{
    if(!err.statusCode){
      err.statusCode = 500; 
    }
    next(err);
  })
};

exports.createPost = (req, res, next) => {
  console.log("inside createPost");
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
  const imageUrl = req.file.path.replaceAll('\\', '/');  //mutator attach path of file to request

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
    // console.log("get single post", post);
    res.status(200).json({message:'Single post fetch!!', post})
  })
  .catch(err=>{
    if(!err.statusCode){ 
      err.statusCode = 500; 
    }
    next(err);
  })
};

exports.updatePost = (req, res, next)=>{
  const postId = req.params.postId;
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('validation failed, enter data is incorrect');
    error.statuscode = 422;
    throw error;  
  }
  
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;  //existing URL
  if(req.file){   
    imageUrl = req.file.path.replaceAll('\\', '/');
  }
  if(!imageUrl){  //don't set imageUrl
    const error = new Error('NO file picked');
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
  .then(post=>{
    if(!post){
      const error = new Error('could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if(imageUrl !== post.imageUrl){ //image change
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    return post.save()
  })
  .then(result=>{
    res.status(200).json({message: 'Post updating successfully', post: result})
  })
  .catch(err=>{
    if(!err.statusCode){ 
      err.statusCode = 500; 
    }
    next(err);
  })
};

exports.deletePost = (req, res, next)=>{
  console.log("delete post");
  const postId = req.params.postId;
  Post.findById(postId)
  .then(post=>{
    if(!post){
      const error = new Error('could not find post.');
      error.statusCode = 404;
      throw error;
    }
    //check if post belong to user

    clearImage(post.imageUrl);
    return Post.findByIdAndRemove(postId);
  })
  .then(result=>{
    res.status(200).json({message: 'Delete post successfully'});
  })
  .catch(err=>{
    if(!err.statusCode){ 
      err.statusCode = 500; 
    }
    next(err);
  })
}

const clearImage = filePath =>{
  //__dirname = D:/study mainterial/......./
  //..  = cd ../
  //filePath = images/2022-11-15T22-21-37.740Zproject2.jpg
  filePath = path.join(__dirname, '..', filePath);
  console.log("file path", filePath);
  fs.unlink(filePath, err=> console.log(err));
}