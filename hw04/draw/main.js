require('./wi2c');

var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('app'));

http.listen(80, function(){
  console.log('[ HTTP ] The server has started.');
});
