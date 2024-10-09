const express = require("express");
const mangoose = require("mangoose  ");
const { default: mongoose,  } = require("mongoose");
require("dotenv").config();
const multer = require("multer");

const app = express();
const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBCLUSTER}.${process.env.DBCODE}.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=${process.env.DBCLUSTER}`;

//  const productSchema = new mangoose.Schema();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);

  mangoose.connect(url)
  .then(()=>{
    console.log('db connected!');
  })
  .catct((error)=>{
        console.log(error)
  })

});
