const exp = require('constants')
const express = require('express');

const app = express();
const router1 = express.Router()
const router2 = express.Router()



const m = (req,res,next)=>{
   console.log('m')
    next();
};


const m1 = (req , res, next)=>{
  console.log('m1')
    next();
}

const m2 = (req,res,next)=>{
 console.log('m2')
    next();
}



app.use(m);
router1.use(m1);
router2.use(m2);

app.get('/r1'  ,(req,res)=>{
    res.send('hello from route 1')
});

app.get('/r2'  ,(req,res)=>{
    res.send('hello from route 2')
});


router1.get('/r3',(req,res)=>{
    res.send('hello from route 3')
});


router1.get('/r4'  ,(req,res)=>{
    res.send('hello from route 4')
});


router2.get('/r5'  ,(req,res)=>{
    res.send('hello from route 5')
});

router2.get('/r6'  ,(req,res)=>{
    res.send('hello from route 6')
});


app.use('/cat1-user',router1);
app.use('/cat2-user',router2);

app.listen(5999,(req,res)=>{
   
    console.log('server is running on port 5999')
});