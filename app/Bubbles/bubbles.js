var NetatmoBubble = require('./NetatmoBubble/NetatmoBubble');
var TelldusBubble = require('./TelldusBubble/TelldusBubble');

var HTTPError = require('node-http-error');

function getBrandBubble(req, next){
  var bubble;
  switch(req.reqInfo.brand)
  {
    case "Netatmo":
      bubble = NetatmoBubble;
      break;
    case "Telldus":
      bubble = TelldusBubble;
      break;
  }

  if(bubble === undefined){
    next(new HTTPError(400, "Brand not found"));
  } else {
    next(null, bubble);
  }
}

function requierdParams(paramsToCheckForArr, req, callback){
  var flag = false; // This flag prevent a bug... (callback was calling twice...)

  for(var i = 0; i < paramsToCheckForArr.length; i++){
    if(req.reqInfo.query[paramsToCheckForArr[i]] === undefined){
      callback(new HTTPError(400, "query "+paramsToCheckForArr[i]+" is missing"));
      flag = true;
      break;
    }
  }
  if(flag === false){
    callback(null);
  }
}

exports.getDevices = function(req, callback) {
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      bubble.getDevices(req.reqInfo , function(err, devices) {
        if(err) {
          callback(err);
        } else {
          callback(null, devices);
        }
      });
    }
  });
};

exports.getUser = function(req, callback){
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      bubble.getUser(req.reqInfo, function(err, user){
        if(err){
          callback(err);
        }else{
          callback(null, user);
        }
      });
    }
  });
};

exports.getRainGauge = function(req, callback){
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      requierdParams(["deviceId", "moduleId"], req, function(err) {
        if (err) {
          callback(err);
        } else {
          bubble.getRainGauge(req.reqInfo, function (err, rainGauge) {
            if (err) {
              callback(err);
            } else {
              callback(null, rainGauge);
            }
          });
        }
      });
    }
  });
};

exports.getThermostate = function(req, callback){
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      requierdParams(["deviceId", "moduleId"], req, function(err){
      if (err) {
        callback(err);
      } else {
        bubble.getThermostate(req.reqInfo, function (err, thermostate) {
          if (err) {
            callback(err);
          } else {
            callback(null, thermostate);
          }
        });
      }
      });
    }
  });
};

exports.getOutdoorModule = function(req, callback){
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      bubble.getOutdoorModule(req.reqInfo, function(err, module){
        if(err) {
          callback(err);
        }else {
          callback(null, module);
        }
      });
    }
  });
};

exports.getIndoorModule = function(req, callback){
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      requierdParams(["deviceId", "moduleId"], req, function(err){
        if (err) {
          callback(err);
        } else {
          bubble.getIndoorModule(req.reqInfo, function (err, indoorModule) {
            if (err) {
              callback(err);
            } else {
              callback(null, indoorModule);
            }
          });
        }
      });
    }
  });
};

exports.getWeatherStation = function(req, callback){
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      bubble.getWeatherStation(req.reqInfo, function(err, weatherStation){
        if(err) {
          callback(err);
        } else {
          callback(null, weatherStation);
        }
      });
    }
  });
};

exports.getSwitch = function(req, callback) {
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      bubble.getSwitch(req.reqInfo, function(err, switchInfo) {
        if(err) {
          callback(err);
        } else {
          callback(null, switchInfo);
        }
      });
    }
  });
};

exports.getSensor = function (req, callback) {
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      bubble.getSensor(req.reqInfo, function (err, sensorInfo) {
        if (err) {
          callback(err);
        } else {
          callback(null, sensorInfo);
        }
      });
    }
  });
};

exports.turnOn = function (req, callback) {
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      bubble.turnOn(req.reqInfo, function (err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, data);
        }
      });
    }
  });
};

exports.turnOff = function (req, callback) {
  getBrandBubble(req, function(err, bubble) {
    if(err) {
      callback(err);
    } else {
      bubble.turnOff(req.reqInfo, function (err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, data);
        }
      });
    }
  });
};
