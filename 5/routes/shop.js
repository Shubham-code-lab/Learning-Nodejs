const express = require('express');

const path = require('path');

const router = express.Router();

const rootDir = require('../util/path.js');

//get() matches the exact url only / , while use() matches prefix /anything
router.get('/', function(request, response, next){           //this middleware execute for all url it will not execute if previous middleware send response back i.e response.send()
    console.log("first page / middleware ");
    console.log(__dirname);
    console.log();
    // response.send('<h1>First Page</h1><a href="/admin/add-product">click</a>');

    //build path the work on both linux and windows

    //__dirname gives us relative path in current folder form windows root folder
    // response.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
    
    response.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;