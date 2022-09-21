const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
);

//problem i face :- 
//1.) product.id === id //don't work even if typof,value are same so i parse them to flaot before comparing 
//2.) nodemon restart everytime file cart.json update so observe terminal carefully knowing that
//3.) readFile callback function parameter order (err,filecontent) is right not the (filecontent, err)
module.exports = class Cart{
    static addProduct(id, productPrice){
        fs.readFile(p, (err, fileContent)=>{
            let cart = {products:[], totalPrice: 0};   //product:[{id,qty}]
            if(!err){ 
                cart = JSON.parse(fileContent);
            }
            let existingProductIndex = cart.products.findIndex(product => parseFloat(product.id) === parseFloat(id));    //-1 != false
            let existingProduct = cart.products[existingProductIndex];  //arr[-1]  undefine
            if(existingProduct){                                            //undefine                         
                cart.products[existingProductIndex].qty++;
                console.log("cart qty++");
            }
            else{
                cart.products.push({id, qty:1});
                console.log("cart add new product");
            }
            cart.totalPrice = +cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err)=>console.log(err));
        })
    }
}