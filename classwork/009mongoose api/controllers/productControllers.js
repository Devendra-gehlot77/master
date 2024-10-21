const Product = require("../models/product");
const fs = require('fs');
const path = require('path');


const addProduct = async (req, res) => {
    try {
        const data = req.body;

        if (req.files) {
            if (req.files.thumbnail) data.thumbnail = req.files.thumbnail[0].filename;

            if (req.files.images) data.images = req.files.images.map((file) => file.filename);
        }

        const dataToSave = new Product(data);

        const response = await dataToSave.save();

        res.status(200).json({ message: 'success', data: response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
};

const readProducts = async (req, res) => {
    try {
        const response = await Product.find();

        const filepath = `${req.protocol}://${req.get('host')}/api-files/`

        res.status(200).json({ message: 'success', data: response, filepath });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}

const updateProduct = async (req, res) => {

    try {
        const preData = await Product.findById(req.params._id);
        console.log(path.join(__dirname, 'uploads', 'products', preData.thumbnail));
        console.log(fs.existsSync(`uploads/products/${ preData.thumbnail}`));

        if(!preData) return res.status(404).json({message:'data not found'})

        const data = req.body;

        if (req.files) {
            if (req.files.thumbnail) {
                data.thumbnail = req.files.thumbnail[0].filename;

                if(fs.existsSync(`uploads/products/${ preData.thumbnail}`)){
                    fs.unlinkSync(`uploads/products/${ preData.thumbnail}`);
                }
            }

            if (req.files.images) {
                data.images = req.files.images.map((file) => file.filename);

                preData.images.forEach((file)=>{
                    if(fs.existsSync(`uploads/products/${ file}`)){
                        fs.unlinkSync(`uploads/products/${ file}`);
                    }
                });
            }
        }

        console.log(req.body);
        console.log(req.files);
        const response = await Product.updateOne(
            req.params,
            {
                $set: data
            });
        res.status(200).json({ message: 'success', data: response });
    }
    catch (error) {
        console.log(error);
        if(error.kind === 'ObjectId') return res.status(400).json({message: 'invalid id'});
        res.status(500).json({ message: 'internal server error' });
    }
};

module.exports = {
    addProduct,
    readProducts,
    updateProduct
};