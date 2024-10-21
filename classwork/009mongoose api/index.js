const express = require('express');
require('dotenv').config();
const path = require('path');
require('./db/config');

const productRouter = require('./routes/productRoutes');

const app = express();


app.use('/api-files', express.static(path.join(__dirname, 'uploads')));

app.use('/products',productRouter);


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);

});