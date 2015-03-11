var NetatmoBubble = require('./NetatmoBubble/NetatmoBubble');
var TelldusBubble = require('./TelldusBubble/TelldusBubble');

var HTTPError = require('node-http-error');

function getBrandBubble(req, callback){

  var callBubble = chooseBubble(req.reqInfo.brand);

  // Bubble not found
  if(callBubble === undefined) {
    //TODO: Borde inte vara här.. borde tas hand om i respondError()
    callback(new HTTPError(400, "Brand not found"));
  }
  return callBubble;
}

function requierdParams(paramsToCheckForArr, req, callback){
  var flag = false; // This flag prevent a bug... (callback was calling twice...)

  for(var i = 0; i < paramsToCheckForArr.length; i++){
    if(req.reqInfo.query[paramsToCheckForArr[i]] === undefined){
      console.log(paramsToCheckForArr[i]);

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
  var callBubble;

  if(callBubble = getBrandBubble(req, callback)) {

    callBubble.getDevices(req.reqInfo , function(err, devices) {
      if(err){
        // a Bubble plugin error occured
        callback(err);
      }
      else if(devices === undefined) {
        callback(new HTTPError(404, "Devices not found"));
      } else {
        callback(null, devices);
      }
    });
  }
};

exports.getUser = function(req, callback){
  var callBubble;

  if(callBubble = getBrandBubble(req, callback)) { //get correct bubble

    callBubble.getUser(req.reqInfo, function(error, user){

      if(error !== null){
        callback(error);

      //Couldn't get User
      }else if(user === undefined){
        callback(new HTTPError(404, "User was undefined"));
      }else{
        callback(null, user);
      }
    });
  }
};

exports.getRainGauge = function(req, callback){
  var callBubble;

  if(callBubble = getBrandBubble(req,callback)){
    requierdParams(["deviceId", "moduleId"],req, function(error) {
      if (error !== null) {
        callback(error);
      } else {
        callBubble.getRainGauge(req.reqInfo, function (error, RainGauge) {

          if (error !== null) {

            callback(error);
          } else if (RainGauge === undefined) {
            callback(new HTTPError(404, "RainGauge not found"));
          } else {
            callback(null, RainGauge);
          }

        });
      }
    });
  }
};


exports.getThermostate = function(req, callback){
  var callBubble;

  callBubble = getBrandBubble(req, callback);

  if(callBubble){
    requierdParams(["deviceId", "moduleId"],req, function(error){

      if (error !== null) {
        callback(error);
      } else {
        callBubble.getThermostate(req.reqInfo, function (err, Thermostate) {
          if (err) {
            callback(err);
          } else if (Thermostate === undefined) {
            callback(new HTTPError(404, "Thermostate not found"));
          } else {
            callback(null, Thermostate);
          }

        });
      }
    });

  }
};

function chooseBubble(brand) {
  var bubble;
  switch(brand)
  {
    case "Netatmo":
      bubble = NetatmoBubble;
      break;
    case "Telldus":
      bubble = TelldusBubble;
      break;
  }
  return bubble;
};



exports.getOutdoorModule = function(req, callback){
  var callBubble;

  if(callBubble = getBrandBubble(req,callback)){

    callBubble.getOutdoorModule(req.reqInfo, function(error, module){

      if(error !== null){

        callback(error);
      }else if(module === undefined) {
        callback(new HTTPError(404, "module not found"));
      }else{
        callback(null,module);
      }

    });
  }
};
/*"_id": "03:00:00:00:6a:72",
  "main_device": "70:ee:50:01:ed:f0",*/

exports.getIndoorModule = function(req, callback){
  var callBubble;

  if(callBubble = getBrandBubble(req,callback)) {

    requierdParams(["deviceId", "moduleId"], req, function(error){ //Checks for valid parameters

      if (error !== null) {
        callback(error);
      }else{
        callBubble.getIndoorModule(req.reqInfo, function (error, IndoorModule) {

          if (error !== null) {
            callback(error);
          } else if (IndoorModule === undefined) {
            callback(new HTTPError(404, "IndoorModule not found"));
          } else {
            callback(null, IndoorModule);
          }

        });
      }
    });
  }
};

exports.getWeatherStation = function(req, callback){
    var callBubble;

    if(callBubble = getBrandBubble(req,callback)){

        callBubble.getWeatherStation(req.reqInfo, function(error, weatherStation){

            if(error !== null){

                callback(error);
            }else if(weatherStation === undefined) {
                callback(new HTTPError(404, "weatherStation not found"));
            }else{
                callback(null, weatherStation);
            }

        });
    }
};

exports.getSwitch = function(req, callback) {
  var callBubble = getBrandBubble(req, callback);
  if (callBubble) {
    callBubble.getSwitch(req.reqInfo, function(err, switchInfo) {
      if(err) {
        callback(err);
      } else {
        callback(null, switchInfo);
      }
    });
  }
};

exports.getSensorInfo = function (req, callback) {
    var callBubble = getBrandBubble(req, callback);
    if (callBubble) {
        callBubble.getSensorInfo(req.reqInfo, function (err, sensorInfo) {
            if (err) {
                callback(err);
            } else {
                callback(null, sensorInfo);
            }
        });
    }
};
