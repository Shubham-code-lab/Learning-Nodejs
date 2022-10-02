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
  // sequelize create method to execute insert method there is also built method that create javascript object but we have to manualy insert it
  Product.create({title,imageUrl,price, description})
         .then(result=>{
          // console.log(result);
          console.log("new product is added");
          res.redirect('/admin/products');
        })
         .catch(err=>console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findOne ({where: {id: prodId}})  //product:{dataValues:{},metaData:{}}
  .then(product=>{
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
  .catch(err=>console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findOne ({where: {id: prodId}})    //product:{dataValues:{},metaData:{}}
    .then(product=>{
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      product.price = updatedPrice;
      return product.save()      //update the old if exist or create new one
    })
    .then(result=>{   //As save() is return we call then on save()
      console.log("updated product");
      res.redirect('/admin/products');      //redirect when product is updated save()
    })
    .catch(err=>console.log(err));  //handle for both findOne() and save()
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products=>{           //[product:{dataValues:{},metaData:{}},product:{dataValues:{},metaData:{}}]
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err=>console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findOne({where: {id: prodId}})   
  .then(product=>{                       //product:{dataValues:{},metaData:{}}
    return product.destroy();
  })
  .then((result)=>{       //destroy()
    console.log("product deleted");
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));   //findOne() and destroy()
};
