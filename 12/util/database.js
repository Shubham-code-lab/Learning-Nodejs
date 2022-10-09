const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;  //constructor

let _db;

//establish connection and storing
const mongoConnect = (callback)=>{
  // MongoClient.connect('mongodb+srv://Shubham:8806166977a@cluster0.pjapwbk.mongodb.net/?retryWrites=true&w=majority')

                                                                                    //connecte to shop database if not exist create new one
  MongoClient.connect('mongodb+srv://Shubham:8806166977a@cluster0.pjapwbk.mongodb.net/shop?retryWrites=true&w=majority')
  .then(client=>{
    console.log("Connected!!")
    _db = client.db();       //so as to only establish connection once //storing the connection 
    callback();
  })
  .catch(err=>console.log(err))
}

//get the connection/instance we establish of database
//mongodb manages connection pool for us
const getDB = ()=>{
  if(_db){
    return _db;
  }
  throw "Database not found"
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;