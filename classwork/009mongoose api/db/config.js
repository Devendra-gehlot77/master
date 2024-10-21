const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPPASSWORD}@${process.env.DBCLUSTER}.${process.env.DBCODE}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DBCLUSTER}`;

mongoose.connect(url)
.then(()=>{
    console.log('db connected!');
})
.catch((error)=>{
    console.log(error);
});