require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const users = require("./routes/users");
const posts = require("./routes/posts");
const tags = require("./routes/tags");
const replies = require("./routes/replies");
const { spawn } = require('child_process');
const app = express();
// const fetch1 = require('node-fetch');

let mongoDBURL = process.env.mongoDBURL;

mongoose
  .connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("could not connect to mongoDB"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("request successfully sent!");
});

app.use("/users", users);
app.use("/posts", posts);
app.use("/tags", tags);
app.use("/reply", replies);

const port = process.env.PORT || 4000;

// const express = require('express');


// app.use(express.json());

app.get('/maps/:id', async (req, res) => {
  try {
    const cur_query  = req.params.id;
    const apiKey = 'PUT YOUR GOOGLE MAPS API KEY';
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=tuitions%${cur_query}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/child', (req, res)=>{
  const { spawn } = require('child_process');
  const childPython = spawn('python', ['codespace.py']);
  // const output="";
  childPython.stdout.on('data', (data) => {
      //ana chahiye
      console.log(data.toString()+' 1');
      res.json(data.toString());
      // childPython.kill();
  });

  childPython.stderr.on('data', (data) => {
      //aa rha hai
      //console.log("Error in file");
      console.log(data.toString() + '2');
      // res.json(data.toString());

  });
  
  childPython.stdout.on('close', (code) => {
      console.log("closed");
      // childPython.kill();
  });
})

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
