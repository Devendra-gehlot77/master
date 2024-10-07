const express = require('express');

const path = require('path')

const app =  express();

const filepath = path.join(__dirname, 'public' , 'index.html')

const filetpathsecond = path.join (__dirname, 'public')

app.get('/greet',  (req,res)=>{

    console.log(req.query);

    res.send('Hello devendra')
});

app.get('/file',(req,res)=>{
    // res.send('hello devendra post')

    res.sendFile(filepath)
});

app.get('/open-file' , (req,res)=>{
    res.sendFile('test.pdf')
})

app.listen(9999, ()=>{
    console.log('Server is running on port 5200')
})