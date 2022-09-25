const db = require('../util/database');
const Cart = require('./cart');


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
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {  //? to prevent cross site cristing attack
    return db.execute('insert into products (title, price, description, imageUrl) values(?,?,?,?)', [this.title, this.price, this.description, this.imageUrl]);
  }

  static deleteById(id) {
    
  }

  static fetchAll() {
    return db.execute('Select * from products');
  }

  static findById(id) {
    return db.execute(`select * from products where products.id = ?`, [id]);  
  }
};
