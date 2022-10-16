const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class Product{
  constructor(title, imageUrl, price ,description, id, userId){   //id is set null when creating product otherwise ObjectId when we want to update
    this.title =title;
    this.price = price;
    this.description = description; 
    this.imageUrl = imageUrl;
    console.log("constructor id ", userId)
    this.userId = userId;
    if(id)                                   //true while updating 
    this._id = new mongodb.ObjectId(id);
    else
    this._id = id;                           //true while inserting
    console.log("udefine ObjectId",new mongodb.ObjectId(undefined)); //while updateing this._id will be of type mongodb.ObjectId() //{_id:this._id}//{$set:{_id:this._id}}
  }

  save(){
    const db = getDB();
    let dbOP;
   if(this._id){  //update
      console.log(new mongodb.ObjectId(this._id));   //condition     //key value to update
      dbOP = db.collection('products').updateOne({_id: this._id}, {$set: this})  //OR {$set:{title:this.title,......}}
    }                                  //updateMany()
    else{
      // add to existing collecction or create new collection
      console.log("================id to save",this);
       dbOP = db.collection('products').insertOne(this)  //this is just object  //insertOne({})   //insertMany([{},{}])
    }                                   //insertMany()
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

  static deleteById(prodId){
    const db = getDB();
    return db.collection('products')
    .deleteOne({_id: new mongodb.ObjectId(prodId)})
    .then(result=>{
      console.log(result)
      return result;
    })
    .catch(err=>console.log(err))
  }
}

module.exports = Product;
