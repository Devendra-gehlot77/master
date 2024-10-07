const express = require('express');
const token  = 'tiger';

const app = express();


const middleware = (req,res,cb)=>{
    if(!req.params.key) return res.send('provide a valid key');

    if(req.params.key !== token) return res.send('please enter a valid token');

    cb();   
};


const m1 = (req,res,cb) =>{
    console.log('m1 called');
    cb();
}



const m2 = (req,res,cb) =>{
    console.log('m2 called');
    cb();
}


app.get('/:key?',middleware ,m1 ,m2,(req,res)=>{
    console.log('hello world')
    res.send('welcome to my api')
})

app.listen(5200, ()=>{
    console.log('server is running on 5200 port')
})
