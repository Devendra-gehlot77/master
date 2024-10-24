//Admin controllers
const { testAdmin,
    adminLogin,
    registerAdmin } = require('./admin-panel/adminControllers')

//Color controllers
const { addColor,
    readColor,
    updateStatusColor,
    deleteColor,
    deleteColors,
    colorByID,
    updateColor,
    deletedColors,
    recoverColor } = require('./admin-panel/colorController')

//Parent Category controllers
const { createParentCategory,
    readParentCategory,
    updateStatusParentCategory,
    deleteParentCategory,
    deleteParentCategories,
    parentCategoryByID,
    updateParentCategory,
    deletedParentCategories,
    recoverParentCategory,
    activatedParentCategories } = require('./admin-panel/parentCategoryController')

//Product Category controllers
const { createProductCategory,
    readProductCategory,
    updateStatusProductCategory,
    updateIsFeaturedProductCategory,
    deleteProductCategory,
    deleteProductCategories, 
    deletedProductCategories,
    recoverProductCategory,
    productCategoryByID,
    updateProductCategory} = require('./admin-panel/productCategoryControllers')

//Size controllers
const { createSize,
    readSize,
    updateStatusSize,
    deleteSize,
    deleteSizes,
    sizeByID,
    updateSize,
    deletedSizes,
    recoverSize } = require('./admin-panel/sizeController')


module.exports = {
    testAdmin,
    adminLogin,
    registerAdmin,
    createParentCategory,
    readParentCategory,
    updateStatusParentCategory,
    addColor,
    readColor,
    updateStatusColor,
    createSize,
    readSize,
    updateStatusSize,
    deleteParentCategory,
    deleteParentCategories,
    deleteColor,
    deleteColors,
    deleteSize,
    deleteSizes,
    parentCategoryByID,
    updateParentCategory,
    colorByID,
    updateColor,
    sizeByID,
    updateSize,
    deletedParentCategories,
    recoverParentCategory,
    deletedSizes,
    recoverSize,
    deletedColors,
    recoverColor,
    activatedParentCategories,
    createProductCategory,
    readProductCategory,
    updateStatusProductCategory,
    updateIsFeaturedProductCategory,
    deleteProductCategory,
    deleteProductCategories,
    deletedProductCategories,
    recoverProductCategory,
    productCategoryByID,
    updateProductCategory
}