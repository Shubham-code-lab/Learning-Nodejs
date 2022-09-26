const Sequelize = require('sequelize');    //class/constructor function

const sequelize = require('../util/database'); //database onnection pool manage by sqeuelize that we configure

//model name product which table in db second argument is structure of model
const Product = sequelize.define('product', {  
  id: {   //attribute field                  
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false, 
    primaryKey: true  
  },
  title: Sequelize.STRING, //if we only want to set type
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;
