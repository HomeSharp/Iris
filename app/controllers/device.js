var Bubbles = require('../Bubbles/bubbles');
var ctrlMethods = require('./controllerMethods');

exports.getOutdoorModule = function(req, res) {
  ctrlMethods.requiredHeaders(req, function(err, reqInfo){
    if(err) {
      ctrlMethods.respondError(err, res);
    }else {
      Bubbles.getOutdoorModule(reqInfo, function(err, device) {
        if (err) {
          ctrlMethods.respondError(err, res);
        }
        res.send(device);
      });
    }
  });
};

exports.getIndoorModule = function(req, res){
  ctrlMethods.requiredHeaders(req, function(err, reqInfo){
    if(err) {
      ctrlMethods.respondError(err, res);
    }else {
      Bubbles.getIndoorModule(reqInfo, function(err, indoorModule){
        if(err) {
          ctrlMethods.respondError(err, res);
        }else {
          res.send(indoorModule);
        }
      });
    }
  });
};

exports.getRainGauge = function(req, res) {
  ctrlMethods.requiredHeaders(req, function(err, reqInfo) {
    if(err) {
      ctrlMethods.respondError(err, res);
    } else {
      Bubbles.getRainGauge(reqInfo, function (err, device) {
        if (err) {
          ctrlMethods.respondError(err, res);
        }else{
          res.send(device);
        }
      });
    }
  });
};

exports.getThermostate = function(req, res) {
  ctrlMethods.requiredHeaders(req, function(err, reqInfo){
    if(err){
      ctrlMethods.respondError(err, res)
    } else{
      Bubbles.getThermostate(reqInfo, function(err, device) {
        if (err) {
          ctrlMethods.respondError(err, res);
        }
        res.send(device);
      });
    }
  });
};


exports.getWeatherStation = function(req, res) {
  ctrlMethods.requiredHeaders(req, function(err, reqInfo) {
    if(err) {
      ctrlMethods.respondError(err, res);
    } else {
      Bubbles.getWeatherStation(reqInfo ,function(err, device) {
        if(err) {
          ctrlMethods.respondError(err, res);
        }else{
          res.send(device);
        }
      });
    }
  });
};

exports.getSwitch = function(req, res) {
  ctrlMethods.requiredHeaders(req, function(err, reqInfo) {
    if(err) {
      ctrlMethods.respondError(err, res);
    } else {
      Bubbles.getSwitch(reqInfo, function(err, device) {
        if(err) {
          ctrlMethods.respondError(err, res);
        } else {
          res.send(device);
        }
      });
    }
  });
};

exports.getSensor = function(req, res) {
  requiredHeaders(req, function(err, reqInfo) {
    if(err) {
      respondError(err, res);
    } else {
      Bubbles.getSensor(reqInfo, function(err, device) {
        if(err) {
          respondError(err, res);
        } else {
          res.send(device);
        }
      });
    }
  });
};
