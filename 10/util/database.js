const mysql = require('mysql2');

const pool = mysql.createPool({       //reach out to pool when we have to run query get new connection that manage multiple connection when query is done connection is handle back to pool for new query 
    host: 'localhost',  //databse is running on IP address/name (localhost)
    user: 'root',
    database: 'node-complete',
    password: '8806166977a'
});  //pool is finished when our application shut down