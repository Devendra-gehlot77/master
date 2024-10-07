const express = require('express');
const multer = require('multer');
const path = require('path')

const app = express();

const storage = multer.diskStorage({
     destination:(req,res,cb)=>{
        cb(null,'uploads')
     },
     fileName:(req,res,cb)=>{
        cb(null,date-now()+Math.floor(math.random()*999999)+ path.extname(file.originalname));
     }
     
})

// single field & single file
// const upload = multer({storage:storage}).single('thumnail');

// single field & multiple file
// const upload = multer({storage:storage}).array('thumnail',10);

// multiple field & multipel file
const upload = multer({storage:storage}).fields(
    [
        {name:'thumnail',maxCount:1},
        {name:'images',maxCount:10}  
    ]
)

app.post('/upload-files', upload,(req,res)=>{
    try{
        // single field & single file
        const data = req.body;
        if(req.files.file){
            if(req.files.thumnail) data = req.files.thumnail[0] .fileName;
            if(req.files.images) data.images = req.files.images.map((file)=> file.fileName )

           
        }
        console.log(req.files,data);
        res.send('sucess')
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'server internal error'})
    }   
})

app.listen(9999, ()=>{
    console.log('server is running on port 9999')
})