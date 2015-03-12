var Bubbles = require('../Bubbles/bubbles');
var HTTPError = require('node-http-error');
var ctrlMethods = require('./controllerMethods');

exports.turnOn = function(req, res) {
  ctrlMethods.requiredHeaders(req, function(err, reqInfo){
    if(err) {
      ctrlMethods.respondError(err, res)
    }else {
      Bubbles.turnOn(reqInfo, function(err, device) {
        if (err !== null) {
          ctrlMethods.respondError(err);
        } else {
          res.send(device);
        }
      });
    }
  });
};

exports.turnOff = function(req, res) {
  ctrlMethods.requiredHeaders(req, function(err, reqInfo){
    if(err) {
      ctrlMethods.respondError(error, res)
    }else {
      Bubbles.turnOff(reqInfo, function(err, device) {
        if (err) {
          ctrlMethods.respondError(err);
        } else {
          res.send(device);
        }
      });
    }
  });
};
