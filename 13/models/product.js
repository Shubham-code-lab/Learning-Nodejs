const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//as mongodb is schemaless our data has some structure to it and mongoose need to know about our data inorder to only work on our data not on mongodb query
//we can call schema as :- data defination,blueprint
const productSchema = new Schema({     //_id is added automatically
    // title: String        
    title: {  
        type: String,
        required: true  //force all object to have title property which reduce mongodb flexibility
    },
    price: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

//through model name we can use our schema
//mongoose turn model name to lowercase and make it prular for naming collection name (model name Product) to (collection name products)
module.exports = mongoose.model('Product', productSchema);
