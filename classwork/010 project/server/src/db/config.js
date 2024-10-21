
const mongoose = require('mongoose');
const { registerAdmin } = require('../controllers/controllers');
require('dotenv').config();

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUTER}.${process.env.DB_CODE}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_CLUTER}`;

(async ()=>{try {
    await  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Succefully Connected to Database.')
            registerAdmin();
        })
}
catch (error) {
    console.error('Unable to Connect to Database !', error);
}})()