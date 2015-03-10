var express = require('express');
var userCtrl = require('./controllers/user');
var deviceCtrl = require('./controllers/device');

// Express router
var router = express.Router();

// Endpoint user info
router.route('/User')
  .get(userCtrl.getUser);

// Endpoint list of users devices
router.route('/User/Devices')
    .get(userCtrl.getDevices);

// Endpoint WeatherStation
router.route('/Device/WeatherStation')
  .get(deviceCtrl.getWeatherStation);

// Endpoint device RainGauge
router.route('/Device/RainGauge')
  .get(deviceCtrl.getRainGauge);

// Endpoint device IndoorModule
router.route('/Device/IndoorModule')
  .get(deviceCtrl.getIndoorModule);

// Endpoint module
router.route('/Device/OutdoorModule')
  .get(deviceCtrl.getOutdoorModule);

// Endpoint device Thermostate (not the same as thermometer)
router.route('/Device/Thermostate')
  .get(deviceCtrl.getThermostate);

module.exports = router;
