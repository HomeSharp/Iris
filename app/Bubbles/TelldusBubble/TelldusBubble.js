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
  "Time"         : "Seconds",
  "State"         : "State"
};

function getNameFromMethodNumber(number) {
  number = number.toString();
  //To add more numbers for a Device: include them in the Device-array. (A device have several numbers... each one
  //stands for the device, its just a matter of the version of the device(?)).
  //If you own a Switch and get a method number that isnt declared in methodNumbers.Switch-array, please add it to the array.
  //To add more devices, simply add them to the methodNumber-object and Switch.
  var methodNumbers = {
    "Switch" : ["35", "3"],
    "Dimmer" : ["51"]
  };

  //A case in this Switch match with the number sent into the switch only
  //if it contains within the array in methodNumbers-object.
  //Otherwise null and the switch moves to the next case
  switch(number){
    case methodNumbers.Switch.indexOf(number) !== -1 ? number : null :
      //console.log("Switch: "+ number);
      return "Switch";
      break;
    case methodNumbers.Dimmer.indexOf(number) !== -1 ? number : null :
      //console.log("Dimmer: "+ number);
      return "Dimmer";
      break;
    default :
      console.log("MethodNumber: "+ number + " was not identified by getNameFromMethodNumber");
      return "NotIdentified";
      break;
  }
}

function telldusOauthRequest(options, callback) {

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
        callback(new HTTPError(401, "Got error: " + error));
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

      var arrOfDevices = JSON.parse(deviceAnswer);
      arrOfDevices = arrOfDevices.device;
      var arrOfDeviceResponses = [];
      var obj = {
        devices: null
      }
      console.log(arrOfDevices[0])
      var  regPattern = /Remote\d+#\d\d+/i; //Only support for max of 99 remotes...

      for(var i = 0; i < arrOfDevices.length; i++){

        if(!arrOfDevices[i].name.match(regPattern)){ //Checks that device is not remote

        var reModel = new response.ResponseModel(
          arrOfDevices[i].id,
          arrOfDevices[i].clientDeviceId,
          getNameFromMethodNumber(arrOfDevices[i].methods),
          arrOfDevices[i].name,
          [
            new response.MeasureModel("State", telldusState[arrOfDevices[i].state], unit.State),
            new response.MeasureModel("StateValue", arrOfDevices[i].statevalue)
          ],
          null, null);

        arrOfDeviceResponses.push(reModel.body.devices[0]);
        }
      }
      obj.devices = arrOfDeviceResponses;

      getSensors(req, deviceAnswer, function(err, sensors){
        if (err) {
          callback(err);
        }else{

          for(var i = 0; i < sensors.sensor.length ; i++){
            var reModel = new response.ResponseModel(
              sensors.sensor[i].id,
              null,
              "Sensor",//getNameFromMethodNumber(sensors.sensor[i].methods),
              sensors.sensor[i].name,
              [

              ],
              null, null);

            obj.devices.push(reModel.body.devices[0]);

          }

          callback(null, JSON.stringify(obj));
        }
      });
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
          new response.MeasureModel("Humidity", info.data[1].value, unit.Humidity)
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
    } else {
      callback(null, JSON.parse(sensorAnswer));
    }
  });
};

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

exports.turnOn = function(req, callback) {
  var options = {
    host: 'http://api.telldus.com/json',
    path: '/device/turnOn?id=' + req.query.deviceId + "&supportedMethods=1023",
    queryMethods: 1023,
    publicKey:    req.publicKey,
    privateKey:   req.privateKey,
    token:        req.token,
    tokenSecret:  req.tokenSecret
  };

  telldusOauthRequest(options, function(err, data){
    if(err) {
      callback(err);
    }
    else {
      callback(null, data);
    }
  });
};

exports.turnOff = function(req, callback) {
  var options = {
    host: 'http://api.telldus.com/json',
    path: '/device/turnOff?id=' + req.query.deviceId + "&supportedMethods=1023",
    queryMethods: 1023,
    publicKey:    req.publicKey,
    privateKey:   req.privateKey,
    token:        req.token,
    tokenSecret:  req.tokenSecret
  };

  telldusOauthRequest(options, function(err, data){
    if(err) {
      callback(err);
    }
    else {
      callback(null, data);
    }
  });
};
