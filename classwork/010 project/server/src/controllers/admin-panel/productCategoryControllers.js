const path = require("path");
const productCategoryModel = require("../../models/productCategoryModel");
const fs = require('fs');

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
        if (error.name == 'ValidationError') return res.status(400).json({ message: 'required fields are missing!' })
        res.status(500).json({ message: 'Internal server error' })
    }
}

const readProductCategory = async (req, res) => {
    try {
        const data = await productCategoryModel.find({ deleted_at: null }).populate('parent_category');
        const filepath = `${req.protocol}://${req.get('host')}/frankandoakservices/admin-panel/`;
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
        // console.log(req.body.checkedCategoriesIDs);

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
        const filepath = `${req.protocol}://${req.get('host')}/frankandoakservices/admin-panel/`;
        res.status(200).json({ message: 'data by ID', data, filepath })
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const updateProductCategory = async (req, res) => {
    try {
        const ProductCategory = JSON.parse(req.body.ProductCategory); // Object sent from frontend using JSON.stringify should be converted using JSON.parse to read in backend
        if (req.files) {
            if (req.files.thumbnail) {
                if (ProductCategory.thumbnail) { // checking if there is a thumbnail key in the old data
                    if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product-category', ProductCategory.thumbnail))) { // checking if old file exists || __dirname giving path of this current productCategoryController.js file but not the path of project root directory, so used process.cwd() because it is giving path of root directory
                        fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product-category', ProductCategory.thumbnail)); // deleting old file if it exists
                    }
                }
                ProductCategory.thumbnail = req.files.thumbnail[0].filename;
            }
        }

        const response = await productCategoryModel.findByIdAndUpdate(req.params._id, ProductCategory)
        res.status(200).json({ message: 'successfully Updated', response });

        // if(Object.keys(req.files).length > 0) console.log(req.files); // if(req.files) <- this one was not working so used if(Object.keys(req.files).length > 0)
    }
    catch (error) {
        console.log(error);
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).send({ message: "Category already exists." });
        }
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
    updateProductCategory
};