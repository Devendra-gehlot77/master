const multer = require('multer');
const path = require('path');

const storage = (foldername) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./src/uploads/${foldername}`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Math.floor(Math.random() * 99999999) + path.extname(file.originalname));
    }
})

const upload = (foldername) => multer({ storage: storage(foldername) }).fields(
    [
        {
            name: 'thumbnail',
            maxCount: 1
        }
    ]
);

module.exports = upload;