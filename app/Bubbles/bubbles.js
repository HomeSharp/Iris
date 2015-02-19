var NetatmoBubble = require('./NetatmoBubble/NetatmoBubble');
var TelldusBubble = require('./TelldusBubble/TelldusBubble');

var HTTPError = require('node-http-error');

function getBrandBubble(req, callback){ //Utbrytning av "getBrandBubble"
  // 1 choose proper bubble
  var callBubble = chooseBubble(req.reqInfo.brand);
  if(callBubble === undefined) {
    // Bubble not found
    callback(new HTTPError(400, "Brand not found"));
  }
  return callBubble;
}
function requierdParams(paramsToCheckForArr, req, callback){
  for(var i = 0; i < paramsToCheckForArr.length; i++){
    if(req.reqInfo.query[paramsToCheckForArr[i]] === undefined){
      callback(new HTTPError(400, "query not found"));
    }
  }
  callback(null);
}

exports.getDevices = function(req, callback) {
  var callBubble;
  // 1 choose proper bubble

  if(callBubble = getBrandBubble(req, callback)) { // Hämtning av callBubble är utbruten...

    // 2 call that bubble
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
      }else if(user === undefined){
        //Couldn't get User
        console.log("Could not get user, user was undefined");

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

    callBubble.getRainGauge(req.reqInfo, function(error, RainGauge){

      if(error !== null){

        callback(error);
      }else if(RainGauge === undefined) {
        callback(new HTTPError(404, "RainGauge not found"));
      }else{
        callback(null,RainGauge);
      }

    });
  }
};


exports.getThermostate = function(req, callback){
  var callBubble;

  if(callBubble = getBrandBubble(req,callback)){

    callBubble.getThermostate(req.reqInfo, function(error, Thermostate){

      if(error !== null){
        callback(error);
      }else if(Thermostate === undefined) {
        callback(new HTTPError(404, "Thermostate not found"));
      }else{
        callback(null,Thermostate);
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



exports.getModule = function(req, callback){
  var callBubble;

  if(callBubble = getBrandBubble(req,callback)){

    callBubble.getModule(req.reqInfo, function(error, module){

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

exports.getIndoorModule = function(req, callback){
  var callBubble;

  if(callBubble = getBrandBubble(req,callback)){

    requierdParams(["deviceId", "moduleId"], req, function(error){ //Checks for valid parameters

      if(error !== null){
        callback(error);
      }else{
        callBubble.getIndoorModule(req.reqInfo, function(error, IndoorModule){

          if(error !== null){

            callback(error);
          }else if(module === undefined) {
            callback(new HTTPError(404, "IndoorModule not found"));
          }else{
            callback(null,IndoorModule);
          }

        });
      }
    })
  }
};