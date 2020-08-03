// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

//type [base_url]/api/whoami
//example {"ipaddress":"159.20.14.100","language":"en-US,en;q=0.5","software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}
// your first API endpoint... 
/*app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});*/
const requestIp = require('request-ip');
// inside middleware handler
var ipMiddleware = function(req, res, next) {
 const clientIp = requestIp.getClientIp(req); 
 next();
};
//As Connect Middleware
app.use(requestIp.mw())

app.get("/api/whoami", function (req,res){
  const ipaddress = req.clientIp;
  const language = req.header('Accept-Language');
  const software = req.header('User-Agent');
  res.json({
    ipaddress,
    language,
    software
  });
})
