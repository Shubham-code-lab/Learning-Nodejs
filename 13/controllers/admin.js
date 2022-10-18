const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title,       //title:title
    price,
    description,
    imageUrl,
    userId: req.user  //req.user._id  mongoose will automatically pick _id field from user model
    // null,
    // req.user._id
  });
  product
    .save()    //provided by mongoose for update and insert
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)       //mongoose findById(prodId) where prodId is type coersion by mangoose into ObjectId(prodID)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)   //findById() will return a product which is special mongoose object
  .then(product=>{
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save()      //on this mongoose special object we can call save()
  })
  .then(result => {
    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  console.log(req.user);
  //find return all product to return cursor we use Product.find().cursor().eachAsync()
  Product.find()
        // .select('title price -_id')   //only get title and price while exclude _id 
        //  .populate('userId', 'name -email')//second argument is what to get and what to exclude  //if argument can be nested 'user.items.productId' if nested   //as we referced user model into product model using ref we can get entire user document related to that product
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)    //to delete document by id
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
