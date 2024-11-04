const express = require('express');
const { createProduct,
    readProducts,
    permanentDeleteProduct,
    updateStatusProduct,
    deleteProduct,
    deletedProducts,
    recoverProduct,
    deleteProducts,
    readProductByID,
    updateProduct } = require('../../controllers/controllers');
const upload = require('../../middlewares/multer');

const productRoutes = express();

productRoutes.post('/create-product', upload('product'), createProduct);
productRoutes.get('/read-products', readProducts);
productRoutes.get('/read-product/:_id', readProductByID);
productRoutes.put('/update-status/:_id', updateStatusProduct);
productRoutes.put('/delete-product/:_id', deleteProduct);
productRoutes.put('/delete-products', deleteProducts);
productRoutes.get('/deleted-products', deletedProducts);
productRoutes.put('/recover-product/:_id', recoverProduct);
productRoutes.put('/update-product/:_id', upload('product'), updateProduct);
productRoutes.delete('/permanent-delete-product/:_id', permanentDeleteProduct);

module.exports = productRoutes