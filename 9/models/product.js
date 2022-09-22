const fs = require('fs');
const path = require('path');
const Cart = require('../models/cart');
const cart = require('../models/cart');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      // console.log(JSON.parse(fileContent));
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if(this.id){
        const existingProductIndex = products.findIndex(product=>parseFloat(product.id) === parseFloat(this.id));
        products[existingProductIndex] = this;
      }
      else{
      this.id = Math.random().toString();
      products.push(this);
      }
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id){
    getProductsFromFile(products=>{
      const productIndex = products.findIndex(product=>parseFloat(product.id) === parseFloat(id));
      const price = products[productIndex].price;
      console.log(id, price);
      Cart.deleteProduct(id,price);
      products.splice(productIndex, 1);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb){
    getProductsFromFile(products=>{
      const product = products.find(product => parseFloat(product.id) === parseFloat(id));
      // console.log(products[0].id, id);
      // console.log(typeof products[0].id,typeof id);
      // let temp1 = Number.parseFloat(products[0].id);
      // let temp2= Number.parseFloat(id);
      // console.log('temp',typeof temp1 === typeof temp2);
      // console.log('temp',temp1 === temp2);
      // console.log(products[0].id === id);
      // console.log('prod',product);
      cb(product);
    });
  }
};
