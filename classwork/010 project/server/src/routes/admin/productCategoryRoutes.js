const express = require('express');

const { createProductCategory,
    readProductCategory,
    updateStatusProductCategory,
    updateIsFeaturedProductCategory,
    deleteProductCategory,
    deleteProductCategories,
    deletedProductCategories,
    recoverProductCategory,
    productCategoryByID,
    updateProductCategory } = require('../../controllers/controllers');

const upload = require('../../middlewares/multer');

const productCategoryRoutes = express();

productCategoryRoutes.post('/create-category', upload('product-category'), createProductCategory);
productCategoryRoutes.get('/read-category', readProductCategory);
productCategoryRoutes.put('/update-status/:_id', updateStatusProductCategory)
productCategoryRoutes.put('/update-IsFeatured/:_id', updateIsFeaturedProductCategory)
productCategoryRoutes.put('/delete-category/:_id', deleteProductCategory);
productCategoryRoutes.put('/delete-categories', deleteProductCategories);
productCategoryRoutes.get('/deleted-categories', deletedProductCategories);
productCategoryRoutes.put('/recover-category/:_id', recoverProductCategory);
productCategoryRoutes.get('/read-category/:_id', productCategoryByID);
productCategoryRoutes.put('/update-category/:_id', upload('product-category'), updateProductCategory)

module.exports = productCategoryRoutes;