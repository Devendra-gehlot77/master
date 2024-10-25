const mongoose = require("mongoose");
const { registerAdmin } = require("../controllers/controllers");
require("dotenv").config();

const url = `mongodb+srv://gehlotdevendra611:${process.env.DBPPASSWORD}@cluster0.oa91k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

(async () => {
  try {
    await mongoose
      .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log("Succefully Connected to Database.");
        registerAdmin();
      });
  } catch (error) {
    console.log(error);
    console.error("Unable to Connect to Database !", error);
  }
})();
