const fs = require('fs');
const path = require('path');

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
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
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
