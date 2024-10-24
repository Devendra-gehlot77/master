const colorModel = require("../../models/colorModel");

const addColor = async (req, res) => {
    try {
        console.log('hello')
        console.log(req.body);
        const dataToSave = new colorModel(req.body);
        const savedData = await dataToSave.save();
        res.status(200).json({ message: 'Color Controller', data: savedData });
    }
    catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).send({ message: "Color already exists." });
        }

        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const readColor = async (req, res) => {
    try {
        const data = await colorModel.find({ deleted_at: null });
        res.status(200).json({ message: 'Success', data })
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateStatusColor = async (req, res) => {
    try {
        const response = await colorModel.findByIdAndUpdate(req.params._id, { status: req.body.status })
        res.status(200).json({ message: 'successfully Updated', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const deleteColor = async (req, res) => {
    try {
        const response = await colorModel.findByIdAndUpdate(req.params._id, { deleted_at: Date.now() })
        res.status(200).json({ message: 'successfully Deleted', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Serer Error' });
    }
}

const deleteColors = async (req, res) => {
    try {
        const response = await colorModel.updateMany(
            { _id: req.body.checkedColorsIDs }, {
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

const colorByID = async (req, res) => {
    try {
        const data = await colorModel.find({ _id: req.params._id });
        res.status(200).json({ message: 'success', data })
    }
    catch (error) {
        console.log(error);
    }
}

const updateColor = async (req, res) => {
    try {
        const response = await colorModel.findByIdAndUpdate(req.params._id,
            {
                name: req.body.name,
                code: req.body.code
            })
        res.status(200).json({ message: 'successfully Updated', response });
    }
    catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).send({ message: "Color already exists." });
        }
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const deletedColors = async (req, res) => {
    try {
        const data = await colorModel.find({ deleted_at: { $ne: null } });
        res.status(200).json({ message: 'success', data })
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

const recoverColor = async (req, res) => {
    try {
        const response = await colorModel.findByIdAndUpdate(req.params._id, { deleted_at: null })
        res.status(200).json({ message: 'successfully Updated', response });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Errror' });
    }
}

module.exports = {
    addColor,
    readColor,
    updateStatusColor,
    deleteColor,
    deleteColors,
    colorByID,
    updateColor,
    deletedColors,
    recoverColor
}