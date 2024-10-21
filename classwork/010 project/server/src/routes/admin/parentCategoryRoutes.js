const express = require('express');
const { createParentCategory,
    readParentCategory,
    updateStatusParentCategory,
    deleteParentCategory,
    deleteParentCategories,
    parentCategoryByID,
    updateParentCategory,
    deletedParentCategories,
    recoverParentCategory,
    activatedParentCategories } = require('./../../controllers/controllers')

const parentCategoryRouter = express.Router();

parentCategoryRouter.post('/create-category', createParentCategory);
parentCategoryRouter.get('/read-category', readParentCategory);
parentCategoryRouter.put('/update-status/:_id', updateStatusParentCategory)
parentCategoryRouter.put('/delete-category/:_id', deleteParentCategory);
parentCategoryRouter.put('/delete-categories', deleteParentCategories);
parentCategoryRouter.get('/read-category/:_id', parentCategoryByID);
parentCategoryRouter.put('/update-category/:_id', updateParentCategory)
parentCategoryRouter.get('/deleted-categories', deletedParentCategories);
parentCategoryRouter.put('/recover-category/:_id', recoverParentCategory);
parentCategoryRouter.get('/activated-categories', activatedParentCategories);


module.exports = parentCategoryRouter;