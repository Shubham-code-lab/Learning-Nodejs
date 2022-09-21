//to import module or other script
//require('./file') will import file.js file from current folder(.js added automatically)
//require('http') will import node http core module
const http = require('http'); 

const routes = require('./router');

console.log(routes.someText);
const server = http.createServer(routes.handler);

//nodejs keep server runing to let server listen to the request
server.listen(3000);