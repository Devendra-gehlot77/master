const productModel = require("../../models/productModel");
const fs = require('fs');
const path = require('path');

const createProduct = async (req, res) => {
    try {
        const data = req.body;
        if (req.files) {
            if (req.files.thumbnail) data.thumbnail = req.files.thumbnail[0].filename;
            if (req.files.image_on_hover) data.image_on_hover = req.files.image_on_hover[0].filename;
            if (req.files.gallery) data.gallery = req.files.gallery.map(img => img.filename);
        }

        const dataToSave = new productModel(data);
        const savedData = await dataToSave.save();

        res.status(200).json({ message: 'product added', data: savedData });
    }
    catch (error) {

        if (error.errors) {
            if (error.errors.price && error.errors.price.kind == 'Number' || error.errors.mrp && error.errors.mrp.kind == 'Number') return res.status(400).json({ message: 'price/mrp should be in a Number!' })
        }

        if (error.code === 11000) { 
            return res.status(400).send({ message: "Product with the same name already exists." });
        }

        if (error.name == 'ValidationError') return res.status(400).json({ message: 'required fields are missing!' })
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const readProducts = async (req, res) => {
    try {
        const data = await productModel.find({ deleted_at: null }).populate('parent_category').populate('product_category').populate('size').populate('color');
        const filepath = `${req.protocol}://${req.get('host')}/frankandoakservices/admin-panel/product/`;

        res.status(200).json({ message: 'successful', data, filepath });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateStatusProduct = async (req, res) => {
    try {
        const response = await productModel.findByIdAndUpdate(req.params._id, { status: req.body.status })
        res.status(200).json({ message: 'successfully Updated', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const deleteProduct = async (req, res) => { 
    try {
        const response = await productModel.findByIdAndUpdate(req.params._id, { deleted_at: Date.now() })
        res.status(200).json({ message: 'successfully Deleted', response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Serer Error' });
    }
}

const deletedProducts = async (req, res) => {
    try {
        const data = await productModel.find({ deleted_at: { $ne: null } }).populate('parent_category').populate('product_category').populate('size').populate('color');
        res.status(200).json({ message: 'success', data })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const deleteProducts = async (req, res) => {
    try {
        const response = await productModel.updateMany(
            { _id: req.body.checkedProductsIDs }, {
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


const recoverProduct = async (req, res) => {
    try {
        const response = await productModel.findByIdAndUpdate(req.params._id, { deleted_at: null })
        res.status(200).json({ message: 'successfully Updated', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const readProductByID = async (req, res) => {
    try {
        const data = await productModel.find(req.params).populate('parent_category').populate('product_category').populate('size').populate('color');
        const filepath = `${req.protocol}://${req.get('host')}/frankandoakservices/admin-panel/product/`;

        res.status(200).json({ message: 'successful', data, filepath });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const updateProduct = async (req, res) => {
    try {

        console.log(req.files);
        console.log(req.body);
        console.log(req.params);

        const oldData = await productModel.findById(req.params);
        const data = req.body;
        if (req.files) {
            if (req.files.thumbnail) {
                if (oldData.thumbnail) { 
                    if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product', oldData.thumbnail))) {
                        fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product', oldData.thumbnail)); 
                    }
                }
                data.thumbnail = req.files.thumbnail[0].filename;
            }
            if (req.files.image_on_hover) {
                if (oldData.image_on_hover) { 
                    if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product', oldData.image_on_hover))) { 
                        fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product', oldData.image_on_hover)); 
                    }
                }
                data.image_on_hover = req.files.image_on_hover[0].filename;
            }
            if (req.files.gallery) {
                if (oldData.gallery) { 
                    oldData.gallery.map((img) => {
                        if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product', img))) { 
                            fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product', img)); 
                        }
                    })

                }
                data.gallery = req.files.gallery.map((img) => (img.filename));
            }
        }
        const response = await productModel.findByIdAndUpdate(req.params._id, data)
        res.status(200).json({ message: 'successfully Updated', response });
    }
    catch (error) {
        console.log(error);
        if (error.code === 11000) { 
            return res.status(400).send({ message: "Product already exists with the same name." });
        }
        if (error.name == 'ValidationError') return res.status(400).json({ message: 'required fields are missing!' })
        if (error.kind == '[ObjectId]' && error.reason.path == 'size') return res.status(400).json({ message: 'size is required!' });
        if (error.kind == '[ObjectId]' && error.reason.path == 'color') return res.status(400).json({ message: 'color is required!' });
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}


const permanentDeleteProduct = async (req, res) => {
    try {

        const oldData = await productModel.findById(req.params);

        if (oldData) {
            
                if (oldData.thumbnail) { 
                    if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product', oldData.thumbnail))) { 
                        fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product', oldData.thumbnail)); 
                    }
                }
            
            
                if (oldData.image_on_hover) { 
                    if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product', oldData.image_on_hover))) { 
                        fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product', oldData.image_on_hover)); 
                    }
                }
            
            
                if (oldData.gallery) { 
                    oldData.gallery.map((img) => {
                        if (fs.existsSync(path.join(process.cwd(), 'src', 'uploads', 'product', img))) { 
                            fs.unlinkSync(path.join(process.cwd(), 'src', 'uploads', 'product', img)); 
                        }
                    })

                }

        }

        const data = await productModel.findOneAndDelete(req.params); 
        res.status(200).json({ message: 'product deleted permanently', data });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}



module.exports = {
    createProduct,
    readProducts,
    updateStatusProduct,
    deleteProduct,
    deletedProducts,
    recoverProduct,
    deleteProducts,
    readProductByID,
    updateProduct,
    permanentDeleteProduct
}

