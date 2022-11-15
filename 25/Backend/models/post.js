const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    imageUrl :{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    creator:{
        type: Object,
        required: true
    }
},{timestamps: true} //createdAt //mongoose add timestamp when new version is added to database
);


module.exports =mongoose.model('POST', postSchema);