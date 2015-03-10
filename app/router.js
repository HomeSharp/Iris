var express = require('express');
var userCtrl = require('./controllers/user');
var deviceCtrl = require('./controllers/device');

// Express router
var router = express.Router();

// Endpoint user
router.route('/User')
  .get(userCtrl.getUser);

// Endpoint user devices
router.route('/User/Devices')
    .post(userCtrl.postDevice)
    .get(userCtrl.getDevices);

// Endpoint WeatherStation
router.route('/Device/WeatherStation')
  .get(deviceCtrl.getWeatherStation);

// Endpoint module
router.route('/Device/Module')
  .get(deviceCtrl.getModule);

// Endpoint device RainGauge
router.route('/Device/RainGauge')
  .get(deviceCtrl.getRainGauge);

// Endpoint device IndoorModule
router.route('/Device/IndoorModule')
    .get(deviceCtrl.getIndoorModule);

// Endpoint device Thermostate (not the same as thermometer)
router.route('/Device/Thermostate')
  .get(deviceCtrl.getThermostate);

module.exports = router;
