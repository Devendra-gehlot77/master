const mongoose = require("mongoose");

const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBCLUSTER}.${process.env.DBCODE}.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=${process.env.DBCLUSTER}`;

mongoose
  .connect(url)
  .then(() => {
    console.log("db connected!");
  })
  .catch((error) => {
    console.log(error);
  });
