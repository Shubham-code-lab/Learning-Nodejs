const Sequelize = require('sequelize');    //class/constructor function

const sequelize = require('../util/database'); //database onnection pool manage by sqeuelize that we configure

//model name product which table in db second argument is structure of model
const Order = sequelize.define('order', {  
  id: {   //attribute field                  
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false, 
    primaryKey: true  
  }
});

module.exports = Order;