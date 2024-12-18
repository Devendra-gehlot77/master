//Admin controllers
const { testAdmin,
    adminLogin,
    registerAdmin,
    updateAdmin,
    generateOTP,
    updateEmail } = require('./admin-panel/adminControllers')

//Color controllers
const { addColor,
    readColor,
    updateStatusColor,
    deleteColor,
    deleteColors,
    colorByID,
    updateColor,
    deletedColors,
    recoverColor,
    activatedColors, 
    permanentDeleteColor} = require('./admin-panel/colorController')

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
    activatedParentCategories,
    permanentDeleteParentCategory,
    searchParentCategeries, } = require('./admin-panel/parentCategoryController')

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
    updateProductCategory,
    activatedProductCategories,
    activeProductCategoriesByParentCategory, 
    permanentDeleteProductCategory} = require('./admin-panel/productCategoryControllers')

//Product controllers
const { createProduct,
    readProducts, 
    permanentDeleteProduct,
    updateStatusProduct,
    deleteProduct,
    deletedProducts,
    recoverProduct,
    deleteProducts,
    readProductByID,
    updateProduct} = require('./admin-panel/productControllers')

//Size controllers
const { createSize,
    readSize,
    updateStatusSize,
    deleteSize,
    deleteSizes,
    sizeByID,
    updateSize,
    deletedSizes,
    recoverSize,
    activatedSizes, 
    permanentDeleteSize,
    recoverSizes,
    permanentDeleteSizes} = require('./admin-panel/sizeController')


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
    updateProductCategory,
    updateAdmin,
    generateOTP,
    updateEmail,
    activatedProductCategories,
    activatedSizes,
    activatedColors,
    activeProductCategoriesByParentCategory,
    createProduct,
    readProducts,
    permanentDeleteParentCategory,
    permanentDeleteProduct,
    updateStatusProduct,
    deleteProduct,
    deletedProducts,
    recoverProduct,
    deleteProducts,
    readProductByID,
    updateProduct,
    permanentDeleteProductCategory,
    permanentDeleteSize,
    permanentDeleteColor,
    recoverSizes,
    permanentDeleteSizes,
    searchParentCategeries
}