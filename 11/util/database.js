const Sequelize = require('sequelize');          //constructor function or class

                                //database name  //username //password
const sequelize = new Sequelize('node-complete', 'root', '8806166977a', {
  dialect: 'mysql',     //make it clear we use sql database
  host: 'localhost'     //
});

module.exports = sequelize;    //dataase connection pool setup by sequqlize
