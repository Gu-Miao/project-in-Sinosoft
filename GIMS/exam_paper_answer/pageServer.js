#!/usr/bin/node

var http = require("http");
var fs = require("fs");
var os = require("os");

var root = __dirname;
console.log(root);
var server = http.createServer(function(req, res) {

  var fileName = root + req.url;

  console.log("req.url: ", req.url);
  console.log("req.headers: ", req.headers);


  if(req.url != "/undefined") {
    fs.createReadStream(fileName).pipe(res);
  }
  
}).listen(8001);