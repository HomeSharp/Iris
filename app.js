// Required packages
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var userCtrl = require('./app/controllers/user');
var deviceCtrl = require('./app/controllers/device');

// Express application
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

// Express router
var router = express.Router();

// Endpoint user
//router.route('/User')
//  .get(userCtrl.getUser);

// Endpoint user devices
router.route('/User/Devices')
  .post(userCtrl.postDevice)
  .get(userCtrl.getDevices);

// Endpoint device lamp
//router.route('/Device/Lamp')
//  .get(deviceCtrl.getLamp);

// Endpoint device thermometer
//router.route('/Device/Thermometer')
//  .get(deviceCtrl.getThermometer);

// all routes go through /api
app.use('/api', router);

// start server
app.listen(3000);
console.log('Something happens on port ' + 3000);
