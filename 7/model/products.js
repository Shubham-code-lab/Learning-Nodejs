// const products = []
const rootDir = require('../util/path');
const fs = require('fs');
const path = require('path');
const { join } = require('path');

const getProductFromFile = function(respondClient){
    const productDataPath = path.join(rootDir, 'data', 'products.json') ;
    fs.readFile(productDataPath, (err, fileContent)=>{
        const products = [];
        if(!err){
            return respondClient(JSON.parse(fileContent));   
        }
            return respondClient(products);
    })
    // return products; 
}

exports.Product = class Product{
    constructor(title){
        this.title = title
    }
    save(){
        // products.push(this);
        const productDataPath = path.join(rootDir, 'data', 'products.json') ;
        getProductFromFile.call(this,products=>{
            products.push(this);
            console.log("saving file");
            fs.writeFile(productDataPath, JSON.stringify(products), (err)=>console.log(err));
        });
    }
    static fetchProduct(respondClient){
        getProductFromFile(respondClient);
    }
}