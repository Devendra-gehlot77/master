const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const multer = require("multer");
const path = require("path");

const app = express();
app.use('/api-files',express.static(path.join(__dirname,+'uploads')))
//  const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBCLUSTER}.${process.env.DBCODE}.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=${process.env.DBCLUSTER}`;

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

const config = async () => {
  await client.connect();
  const db = await client.db("api_temp");

  return db();
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() +
          Math.floor(Math.random() * 999999) +
          path.extname(file.originalname)
      );
    },
  }),
}).fields([
  {
    name: "thumbnail",
    maxCount: 5,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

// insert data
app.post("/insert-data", upload, async (req, res) => {
  const db = await config();
  const collection = db.collection("products");

  const data = req.body;
  if (req.files) {
    if (req.files.thumbnail) data.thumbnail = req.files.thumbnail[0].filename;
    if (req.files.images)
      data.images = req.files.images.map((img) => img.filename);
  }

  console.log(data);

  const response = await collection.insertOne(data);

  res.status(200).json({ message: "success", data: response });
});

// read
app.get("/read-data", async (req, res) => {
  const db = await config();
  const collection = db.collection("products");

  const data = await collection.find().toArray();

  const path = 'localhost:5000/api-files '

  res.status(200).json({ message: "success", data, path });
});

app.listen(process.env.PORT, () => {
  console.log(`server is running port on ${process.env.PORT}`);
});
