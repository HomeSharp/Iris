// Required packages
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var router = require('./app/router');

// Express application
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

// all routes go through /api
app.use('/api', router);

// start server
app.listen(3000);
console.log('Something happens on port ' + 3000);
