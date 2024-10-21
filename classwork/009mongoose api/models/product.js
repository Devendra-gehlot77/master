const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    name:String,
    price:Number,
    images:Object,
    description:String,
    thumbnail:String,
    status:{
        type:Boolean,
        default:true
    }
});


const Product = mongoose.model('products', productSchema);

module.exports = Product;