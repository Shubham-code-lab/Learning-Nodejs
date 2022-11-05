//REST API don't render view/html
exports.getPosts = (req, res, next) => {
  //user need to know if request is fulfilled or rejected so we send status code 200 which is successs(ok)
  res.status(200).json({   //res.json() method provided by express  which does three thing:-  //passed normal js object which is converted by json() to json and send response to client and also set response header
    posts: [{ title: 'First Post', content: 'This is the first post!' }]
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  //default is 200 default 201 is success + created resource
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: new Date().toISOString(), title: title, content: content }
  });
};
