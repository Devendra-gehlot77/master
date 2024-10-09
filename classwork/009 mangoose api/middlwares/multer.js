const multer = require("multer");
const path = require('path');


const storage = (foldername)=>  multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(foldername)
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        Math.floor(Math.random() * 99999 + path.extname(file.originalname))
    );
  }
})

const uploads = (foldername)=> multer({
  Storage: storage(foldername)}).fields([
  {
    name: "images",
    maxCount: 5,
  },
  {
    name: "thumbnai",
    maxCount: 1,
  },
]);

module.exports = uploads;
