const fs = require('fs');
const path = require("path")

let session = require('./session.json');
console.log('loading session:', session.title);
console.log('possible PCs:', session.PCs);

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

const content = getAllFiles('content');

const express = require('express');

var app = express();
var http = require('http').createServer(app);

app.use( express.json() ); //parses application/json and populates req.body

app.use('/', 
  (req, res, next) => {
    console.log(req.method, req.path);
    next();
  }
);

app.use('/content', 
  express.static('content')
);

app.get('/api/board', (req, res) => {
  res.json(session["current-board"]);
});

app.post('/api/board', 
  (req, res) => {
    if (req.body["background"] != undefined){
      session["current-board"]["background"] = req.body["background"];
    }
    res.json(session["current-board"]);
  }
);

app.get('/api/content', (req, res) => {
  res.json({files: content});
});

app.get('/api/notes', (req, res) => {
  fs.readFile("content/notes/Eolan.md", (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data.toString());
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});
