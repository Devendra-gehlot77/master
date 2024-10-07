const express = require('express');
const path = require('path')

const app = express();
const filepath = path.join(__dirname,'public')

app.use(express.static(path.join(__dirname,'public')))

app.get('/', (req,res)=>{
    res.sendfile(`${filepath}/home.html`)
})


app.get('/about', (req,res)=>{
    res.sendfile(`${filepath}/about.html`)
})


app.get('/course', (req,res)=>{
    res.sendfile(`${filepath}/course.html`)
})


app.get('/contact', (req,res)=>{
    res .sendfile(`${filepath}/contact.html`)
})

app.get('*',(req,res)=>{
    res.sendfile(`${filepath}/404.html`)
})


app.listen(5000, ()=>{
    console.log('server is runing')
})