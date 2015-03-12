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

// Endpoint device OutdoorModule
router.route('/Device/OutdoorModule')
  .get(deviceCtrl.getOutdoorModule);

// Endpoint device Thermostate (not the same as thermometer)
router.route('/Device/Thermostate')
  .get(deviceCtrl.getThermostate);

// Endpoint device switch on/off power
router.route('/Device/Switch')
  .get(deviceCtrl.getSwitch);

// Endpoint device SensorInfo
router.route('/Device/Sensor')
  .get(deviceCtrl.getSensor);

module.exports = router;
