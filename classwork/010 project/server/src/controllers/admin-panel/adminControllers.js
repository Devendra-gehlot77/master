// Admin Controllers

const AdminModel = require("../../models/adminModel");

const testAdmin = (req, res) => {
    res.status(200).json({ message: 'test successful' });
};

const registerAdmin = async () => {
    try {
        const isAvailable = await AdminModel.findOne({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        })

        if (isAvailable) return console.log(isAvailable);

        if (!isAvailable) {
            const data = new AdminModel({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            })
            const response = await data.save();
            console.log(response);
        }
    }
    catch (error) {
        console.log(error)
    }
}

const adminLogin = async (req, res) => {
    try {
        const ifAdmin = await AdminModel.findOne({
            email: req.body.email
        })
        if (!ifAdmin) return res.status(404).json({ message: 'Invalid Email address' });
        if (ifAdmin.password !== req.body.password) return res.status(400).json({ message: 'Invalid Password' });


        const { email, ...password } = ifAdmin;
        console.log(email);
        res.status(200).json({ message: 'success Login', data: email });
    }
    catch (error) {
        res.status(500).json({ message: 'internal server error', error })
    }
}

module.exports = { testAdmin, registerAdmin, adminLogin };