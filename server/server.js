
require("dotenv").config()
const express = require("express");
const app = express(); 
const cors = require("cors");
const fs = require("fs");
const path = require('path');
app.use(cors());
app.use(express.json());
const jwt = require("jsonwebtoken");



const pathName =  path.join(__dirname, '/list.json');
const todos = JSON.parse(fs.readFileSync(pathName, "utf-8"));
console.log(__dirname)


app.get("/todos", (_req, res) => res.json({ "data": todos }));

app.post("/todos", authenticateToken, function(req, res) {
  let newData = req.body;
  console.log(JSON.stringify(newData))
  todos.push(newData)
  const data = JSON.stringify(todos)
  fs.writeFileSync('./list.json', data, err => {
    if(err) throw err;
    console.log("New data added", data);
  });
  res.status(201).json({status: 'Data Received: ', data: newData})
});

app.put("/todos", authenticateToken, function(req, res) {
  let newData = req.body;
  console.log('updated data', JSON.stringify(newData))
  const newList = todos.map(item => {
    return item.id == newData.id ? newData : item
  })
  console.log('newlist',newList)
  const data = JSON.stringify(newList)
  fs.writeFileSync('./list.json', data, err => {
    if(err) throw err;
    console.log("New data added");
  });
  res.status(200).json({status: 'Data Received: ', data: newData})
  //res.json(newList);
});

app.delete("/todos", authenticateToken, function(req, res) {
  const itemToDelete = req.body;
  let newList = [];
  todos.map(item => {
    item.id == itemToDelete.id ? console.log('delete : ', item) : newList.push(item)
  });
  const data = JSON.stringify(newList)
  fs.writeFileSync('./list.json', data, err => {
    if(err) throw err;
  });
  console.log('STATUS')
  res.status(200).json({status: 'Data deleted: ', data: newList})
});

app.post("/login", function(req, res) {
  console.log('LOGIN');
  const username = req.body.username;
  const user = { name: username}
  console.log(user)
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken: accessToken})
});

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  // felette lévő sor [1]: Bearer TOKEN
  if(token == null){
    console.log('NULL')
    return res.status(401).json({status: '401', data: null})
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err){
      console.log('ERR',  err)
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}

app.listen(5000, () => {
  console.log("server is running on port 5000");
});