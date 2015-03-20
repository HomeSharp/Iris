var Bubbles = require('../Bubbles/bubbles');
var ctrlMethods = require('./controllerMethods');

exports.getUser = function(req, res) {
  ctrlMethods.requiredHeaders(req, function(err, reqInfo){
    if(err){
      ctrlMethods.respondError(err, res);
    }else{
      Bubbles.getUser(reqInfo, function(err, user){
        if(err){
          ctrlMethods.respondError(err, res);
        }else{
          res.send(user);
        }
      });
    }
  });
};

exports.getDevices = function(req, res) {
  ctrlMethods.requiredHeaders(req, function(err, reqInfo) {  
    if(err) {
      ctrlMethods.respondError(err, res);
    } else {
      Bubbles.getDevices(reqInfo, function(err, devices) {
        if(err) {
          ctrlMethods.respondError(err, res);
        } else {
          res.send(devices);
        }
      });
    }
  });
};
