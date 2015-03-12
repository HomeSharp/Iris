var http = require('http');
var HTTPError = require('node-http-error');
var oauth = require('oauth')
var response = require("../ResponseModel");

var telldusState = {
 1    : "On",
 2    : "Off",
 16   : "Dimmed"
};

var unit = {
  "Temperature"  : "Celsius",
  "CO2"          : "Parts per million",
  "Humidity"     : "Percent",
  "Rain"         : "Millimeter",
  "Noise"        : "Decibel",
  "Pressure"     : "Millibar",
  "Time"         : "Seconds"
};

function telldusOauthRequest(options, callback) {

  // Oauth npm style
  var telOauth = new oauth.OAuth(
    "http://api.telldus.com/oauth/requestToken",
    "http://api.telldus.com/oauth/accessToken",
    options.publicKey,
    options.privateKey,
    "1.0",
    null,
    "HMAC-SHA1"
  );

  telOauth.get(
    options.host + options.path,
    options.token,
    options.tokenSecret,
    function(err, data, res){
      if(err){
        error = JSON.parse(data).error
        callback(new HTTPError(401, "Got error: " + error)); //Dunno if the statuscode is right...
      }else{
        callback(null,data)
      }
    }
  )
};


exports.getDevices = function (req, callback) {
  var options = {
    host: 'http://api.telldus.com/json',
    path: '/devices/list?supportedMethods=1023',
    queryMethods: 1023,
    publicKey:    req.publicKey,
    privateKey:   req.privateKey,
    token:        req.token,
    tokenSecret:  req.tokenSecret
  };

  telldusOauthRequest(options, function(err, deviceAnswer){
        if(err) {
            callback(err);
        }
        else {
            
            getSensors(req, deviceAnswer, callback);
            
        }
   });

};

//By id
exports.getSensor = function (req, callback) {
  var options = {
    host: 'http://api.telldus.com/json',
    path: '/sensor/info?id=' + req.query.deviceId + "&supportedMethods=1023",    
    queryMethods: 1023,
    publicKey: req.publicKey,
    privateKey: req.privateKey,
    token: req.token,
    tokenSecret: req.tokenSecret
  };
  
  telldusOauthRequest(options, function (err, answer) {
    if (err) {
      callback(err);
    }
    else {

      var info = JSON.parse(answer);

      var reModel = new response.ResponseModel(
        req.query.deviceId,
        req.query.moduleId, //underfine in Telldus
        "Sensor",
        info.name,        
        [
          new response.MeasureModel("Temperature", info.data[0].value, unit.Temperature),
          
          new response.MeasureModel("Humidity", info.data[1].value, unit.Humidity),
          
        ],
        info.time_exec, //underfine in Telldus
        info.time_server //underfine in Telldus
      );
      
      callback(null, reModel.makeJSON());
            
    }
  });
};

//All
getSensors = function(req, deviceAnswer, callback) {
    var options = {
        host: 'http://api.telldus.com/json',
        path: '/sensors/list?supportedMethods=1023',
        queryMethods: 1,
        publicKey: req.publicKey,
        privateKey: req.privateKey,
        token: req.token,
        tokenSecret: req.tokenSecret
    };
    
    telldusOauthRequest(options, function (err, sensorAnswer) {
        if (err) {
            callback(err);
        }
        else {

            var devices = JSON.parse(deviceAnswer);
            var sensors = JSON.parse(sensorAnswer); 
            
            var answer = mergeDevicesSensors(devices, sensors);

            callback(null, answer);
        }
    });
};


mergeDevicesSensors = function (devices, sensors) {
    var usersDeviceList = { };
    var deviceList = [];
    var sensorList = [];
        
    for (var key in devices) {
        if (key === 'length' || !devices.hasOwnProperty(key)) continue;
        var deviceList = devices[key];       
    }
   
    for (var key in sensors) {
        if (key === 'length' || !sensors.hasOwnProperty(key)) continue;
        var sensorList = sensors[key];       
    }
    
    usersDeviceList.devices = deviceList;
    usersDeviceList.sensors = sensorList;
    
    return usersDeviceList;
}


exports.getUser = function(req, callback){
  var options = {
    host: 'http://api.telldus.com/json',
    path: '/user/profile?',
    queryMethods: 1,
    publicKey:    req.publicKey,
    privateKey:   req.privateKey,
    token:        req.token,
    tokenSecret:  req.tokenSecret
  };


  telldusOauthRequest(options, function(err, answer){
    if(err) {
      callback(err);
    }
    else {
      answer = JSON.parse(answer);
      userRe = new response.UserResponseModel("Telldus", answer.email, null, null);

      callback(null, userRe.makeJSON());
    }
  });

};

exports.getSwitch = function(req, callback) {
  var options = {
    host: 'http://api.telldus.com/json',
    path: '/device/info?id=' + req.query.deviceId + "&supportedMethods=1023",
    queryMethods: 1023,
    publicKey:    req.publicKey,
    privateKey:   req.privateKey,
    token:        req.token,
    tokenSecret:  req.tokenSecret
  };

  telldusOauthRequest(options, function(err, answer){
    if(err) {
      callback(err);
    }
    else {
      var info = JSON.parse(answer);

      var reModel = new response.ResponseModel(
        req.query.deviceId,
        req.query.moduleId,
        "Switch",
        info.name,
        [
          new response.MeasureModel("State",  telldusState[info.state], "State")
        ],
        info.time_exec,
        info.time_server
      );

      callback(null, reModel.makeJSON());
    }
  });
};
