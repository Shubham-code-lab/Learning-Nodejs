const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class Product{
  constructor(title, imageUrl, price ,description, id){
    this.title =title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  save(){
    const db = getDB();
    let dbOP;
    if(this._id){  //update
      dbOP = db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this})  //OR {$set:{title:this.title,......}}
    }
    else{
      // add to existing collecction or create new collection
       dbOP = db.collection('products').insertOne(this)  //this is just object  //insertOne({})   //insertMany([{},{}])
    }
    return dbOP.then(result=>console.log(result))
    .catch(err=>console.log(err))
  }

  static fetchAll(){
    const db = getDB();
    return db.collection('products')  //which collection to connect to
    .find()       //find({title:'A book'})  to filter result  //find() return cursor and object provided by mongodb so as to not return all the document at once (to avoid million of data being fetched)
    .toArray()    //get all document and turn them into array
    .then(products=>{
      console.log("fetchAll",products);
      return products
    })
    .catch(err=>console.log(err));
  }

  static findById(prodId){
    const db = getDB();
    return db.collection('products')
    //mongodb uses bSOn format not only because it is fast but also it store special type of data(dataType) ObjectId so we have to type cast it
    //mongodb uses ObjectId to handle/manage ID hence _id is type of ObjectId
    .find({_id: new mongodb.ObjectId(prodId)})  //return cursor even when only one document we get
    .next()  //we get next or last document instead of cursor
    .then(product=>{                //{}
      console.log("findById",product)
      return product
    })
    .catch(err=>console.log(err))
  }

}

module.exports = Product;
