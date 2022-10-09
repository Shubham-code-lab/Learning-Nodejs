const getDB = require('../util/database').getDB;

class Product{
  constructor(title, price ,description, imgeUrl){
    this.title =title;
    this.price = price;
    this.description = description;
    this.imgeUrl = imgeUrl;
  }

  save(){
    const db = getDB();
    db.collection('products').insertOne(this)  //this is just object  //insertOne({})   //insertMany([{},{}])
    .then(result=>console.log(result))
    .catch(err=>console.log(err))
  }
}

module.exports = Product;
