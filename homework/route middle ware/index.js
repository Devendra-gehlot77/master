const exp = require("constants");
const express = require("express");

const app = express();
const router2 = express.Router();
const router3 = express.Router();
const router4 = express.Router();

const m1 = (req, res, next) => {
  console.log("m");
  next();
};

const m2 = (req, res, next) => {
  console.log("m1");
  next();
};

const m3 = (req, res, next) => {
  console.log("m2");
  next();
};

const m4 = (req, res, next) => {
    console.log("m3 ");
    next();
  };


  app.use(m1);
  router2.use(m2);
  router3.use(m3);
  router4.use(m4);


app.get("/r1", (req, res) => {
  res.send("hello r1");
});
app.get("/r2", (req, res) => {
  res.send("hello r2");
});
app.get("/r3", (req, res) => {
  res.send("hello r3");
});
app.get("/r4", (req, res) => {
  res.send("hello r4");
});
app.get("/r5", (req, res) => {
  res.send("hello r5");
});

router2.get("/r6", (req, res) => {
  res.send("hello r6");
});
router2.get("/r7", (req, res) => {
  res.send("hello r7");
});

router2.get("/r8", (req, res) => {
  res.send("hello r8");
});
router2.get("/r9", (req, res) => {
  res.send("hello r9");
});
router2.get("/r10", (req, res) => {
  res.send("hello r10");
});

router3.get("/r11", (req, res) => {
  res.send("hello r11");
});

router3.get("/r12", (req, res) => {
  res.send("hello r12");
});
router3.get("/r13", (req, res) => {
  res.send("hello r13");
});

router3.get("/r14", (req, res) => {
  res.send("hello r14");
});

router3.get("/r15", (req, res) => {
  res.send("hello r15");
});
router4.get("/r16", (req, res) => {
  res.send("hello r16");
});
router4.get("/r17", (req, res) => {
  res.send("hello r17");
});

router4.get("/r18", (req, res) => {
  res.send("hello r18");
});
router4.get("/r19", (req, res) => {
  res.send("hello r19");
});
router4.get("/r20", (req, res) => {
  res.send("hello r20");
});

app.use('/cat2-user',router2);
app.use('/cat3-user',router3);
app.use('/cat4-user',router4);



app.listen(5299, (req, res) => {
  console.log("server is running on port 5299");
});
