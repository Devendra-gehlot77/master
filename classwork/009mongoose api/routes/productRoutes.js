const express = require('express');
const uploads = require('../middelwares/multer');
const {
    addProduct,
    readProducts,
    updateProduct
} = require('../controllers/productControllers');

const productRouter = express.Router();

productRouter.post('/insert-data', uploads('products'), addProduct);

productRouter.get('/read-data', readProducts);
productRouter.put('/update-product/:_id',uploads('products'), updateProduct);

module.exports = productRouter;