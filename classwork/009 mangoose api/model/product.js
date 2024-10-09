const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: Object,
  thumbnail: String,
  status: {
    type: Boolean,
    default: true,
  },
});


const Products = mongoose.model('products',productSchema);


module.exports = {
    Products,
  };