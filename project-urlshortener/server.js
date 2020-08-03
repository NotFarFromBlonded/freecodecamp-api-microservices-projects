'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended:false}));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

//POST [project_url]/api/shorturl/new 

// your first API endpoint... 
/*app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});*/
const link = [];
let id = 0;

app.post("/api/shorturl/new", (req,res)=>{
  const {url} = req.body;
  const withoutHTTP = url.replace(/^https?:\/\//,'')
  dns.lookup(withoutHTTP, (err)=>{
    if(err){
      return res.json({
        error: "Invalid URL"
      })
    } else {
      id++;
      const newShortLink=({
        original_url: url,
        short_url: `${id}`
      });
      link.push(newShortLink);
      return res.json(newShortLink);
    }
  })
});

app.get("/api/shorturl/:id",(req,res)=>{
  const {id} = req.params;
  const shortLink = link.find(lin => lin.short_url === id);
  if(shortLink){
    return res.redirect(shortLink.original_url);
  } else {
    return({
      error:"No short URL"
    })
  }
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});