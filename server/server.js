
require("dotenv").config()
const express = require("express");
const app = express(); 
const cors = require("cors");
const fs = require("fs");

const jwt = require("jsonwebtoken");

let list;
// konstansba syncbe szokás
fs.readFile("./list.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    list = JSON.parse(jsonString);
    console.log("List is:", list); 
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

// statust beleírni kóddal
//data propertyre rakjuk és todos prop esetleg
app.use(cors());

app.use(express.json())

app.get("/todos", function(req, res) {
  res.json({ "data": list });
});

app.post("/todos", function(req, res) {
  //meglévő todokról
  let newData = req.body;
  console.log(JSON.stringify(newData))
  list.push(newData)
  const data = JSON.stringify(list, null, 2)
  fs.writeFileSync('./list.json', data, err => {
    if(err) throw err;
    
    console.log("New data added");
  });
  res.send('Data Received: ' + JSON.stringify(newData));
  res.status(201).json(newData)
});

app.put("/todos", function(req, res) {
  let newData = req.body;
  console.log('updated data', JSON.stringify(newData))
  let newList = [];
  list.map(item => {
    item.id == newData.id ? newList.push(newData) : newList.push(item)
  })
  console.log('newlist',newList)
  const data = JSON.stringify(newList, null, 2)
  fs.writeFileSync('./list.json', data, err => {
    if(err) throw err;
    console.log("New data added");
  });
  res.json(newList);
});

app.delete("/todos", function(req, res) {
  const itemToDelete = req.body;
  let newList = [];
  list.map(item => {
    item.id == itemToDelete.id ? console.log('delete : ', item) : newList.push(item)
  });
  const data = JSON.stringify(newList, null, 2)
  fs.writeFileSync('./list.json', data, err => {
    if(err) throw err;
  });
  res.json(newList);
});

app.get("/login", function(req, res) {
  console.log('LOGIN');
  const username = req.body.username;
  const user = { name: username}
  
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken: accessToken})
});

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  // felette lévő sor [1]: Bearer TOKEN
  if(token == null){
    res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err){
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}

app.listen(5000, () => {
  console.log("server is running on port 5000");
});