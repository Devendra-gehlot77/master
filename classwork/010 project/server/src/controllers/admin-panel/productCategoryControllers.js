const path = require("path");
const productCategoryModel = require("../../models/productCategoryModel");
const fs = require('fs');
const productModel = require("../../models/productModel");

const createProductCategory = async (req, res) => {
    try {
        const data = req.body;
        if (req.files) {
            if (req.files.thumbnail) data.thumbnail = req.files.thumbnail[0].filename
        }
        const dataToSave = new productCategoryModel(data);
        const response = await dataToSave.save();
        res.status(200).json({ message: 'successful', data: response });
    }
    catch (error) {
        if (error.code === 11000) { 
            return res.status(400).send({ message: "Category already exists." });
        }

        if (error.name == 'ValidationError') return res.status(400).json({ message: 'required fields are missing!' })
        res.status(500).json({ message: 'Internal server error' });
    }
}

const readProductCategory = async (req, res) => {
    try {
        const data = await productCategoryModel.find({ deleted_at: null }).populate('parent_category');
        const filepath = `${req.protocol}://${req.get('host')}/frankandoakservices/admin-panel/product-category/`;

        res.status(200).json({ message: 'successful', data, filepath });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

const updateStatusProductCategory = async (req, res) => {
    try {
        const response = await productCategoryModel.findByIdAndUpdate(req.params._id, { status: req.body.status })
        res.status(200).json({ message: 'successfully Updated', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const updateIsFeaturedProductCategory = async (req, res) => {
    try {

        const response = await productCategoryModel.findByIdAndUpdate(req.params._id, { is_featured: req.body.is_featured })
        res.status(200).json({ message: 'successfully Updated', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const deleteProductCategory = async (req, res) => {
    try {
        const response = await productCategoryModel.findByIdAndUpdate(req.params._id, { deleted_at: Date.now() })
        res.status(200).json({ message: 'successfully Deleted', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Serer Error' });
    }
}

const deleteProductCategories = async (req, res) => {
    try {
        const response = await productCategoryModel.updateMany(
            { _id: req.body.checkedCategoriesIDs }, {
            $set: {
                deleted_at: Date.now()
            }
        });
        res.status(200).json({ message: 'Successfully Deleted', response });
        

    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deletedProductCategories = async (req, res) => {
    try {
        const data = await productCategoryModel.find({ deleted_at: { $ne: null } }).populate('parent_category');
        res.status(200).json({ message: 'success', data });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const recoverProductCategory = async (req, res) => {
    try {
        const response = await productCategoryModel.findByIdAndUpdate(req.params._id, { deleted_at: null })
        res.status(200).json({ message: 'successfully Updated', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const productCategoryByID = async (req, res) => {
    try {
        const data = await productCategoryModel.find({ _id: req.params._id }).populate('parent_category');
        const filepath = `${req.protocol}://${req.get('host')}/frankandoakservices/admin-panel/product-category/`;
        res.status(200).json({ message: 'data by ID', data, filepath })
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const updateProductCategory = async (req, res) => {
    try {

        const oldData = await productCategoryModel.findById(req.params);
        const data = req.body;
        if (req.files) {
            if (req.files.thumbnail) {
                if (oldData.thumbnail) { 
                    if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product-category', oldData.thumbnail))) { 
                        fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product-category', oldData.thumbnail)); 
                    }
                }
                data.thumbnail = req.files.thumbnail[0].filename;
            }
        }
        const response = await productCategoryModel.findByIdAndUpdate(req.params._id, data)
        res.status(200).json({ message: 'successfully Updated', response });

        
    }
    catch (error) {
        console.log(error);
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).send({ message: "Category already exists." });
        }
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const activatedProductCategories = async (req, res) => {
    try {
        const data = await productCategoryModel.find({ status: true, deleted_at: null });
        res.status(200).json({ message: 'success', data })
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const activeProductCategoriesByParentCategory = async (req, res) => {
    try {
        const data = await productCategoryModel.find({ status: true, deleted_at: null, parent_category: req.params._id }).populate('parent_category');
        res.status(200).json({ message: 'success', data })
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const permanentDeleteProductCategory = async (req, res) => {
    try {

        const products = await productModel.find({ product_category: req.params._id });
        const productCategories = await productCategoryModel.find(req.params);

        console.log('products', products)
        console.log('productCategory', productCategories);

        products.map((product) => {
            if (product.thumbnail) {
                if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product', product.thumbnail))) {
                    fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product', product.thumbnail)); 
                }
            }

            if (product.image_on_hover) {
                if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product', product.image_on_hover))) { 
                    fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product', product.image_on_hover));
                }
            }

            if (product.gallery) {
                product.gallery.map((img) => {
                    if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product', img))) { 
                        fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product', img)); 
                    }
                })
            }
        })


        productCategories.map((productCategory) => {
            if (productCategory.thumbnail) {
                if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product-category', productCategory.thumbnail))) { 
                    fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product-category', productCategory.thumbnail)); 
                }
            }
        })


        await productModel.deleteMany({ product_category: req.params._id })
        await productCategoryModel.deleteOne(req.params);

        res.status(200).json({ message: 'Permanetly Deleted Successfully' })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

module.exports = {
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
    activatedProductCategories,
    activeProductCategoriesByParentCategory,
    permanentDeleteProductCategory
};