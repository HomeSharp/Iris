var http = require('http');
var HTTPError = require('node-http-error');
var response = require("../ResponseModel");

var unit = {
 "Temperature"  : "Celsius",
 "CO2"          : "Parts per million",
 "Humidity"     : "Percent",
 "Rain"         : "Millimeter",
 "Noise"        : "Decibel",
 "Pressure"     : "Millibar",
 "Time"         : "Seconds"
};
var deviceType = {
  "NAMain"    : "WeatherStation",
  "NAModule1" : "OutdoorModule",
  "NAModule4" : "IndoorModule",
  "NAModule3" : "RainGauge",
  "NAPlug"    : "ThermoPlug",
  "NATherm1"  : "Thermostate"
};

function netatmoRequest(options, callback) {

  http.get(options, function(resp){
    var str = "";
    resp.on('data', function(chunk){
      str += chunk;
    });

    resp.on('end', function () {

      var netResponse = JSON.parse(str);

      // if netatmo returns error in JSON response
      if(netResponse.error){
        if(netResponse.error.code === 2)
        {
          // invalid access token
          callback(new HTTPError(401, netResponse.error.message));
        } else {
          // default error
          callback(new HTTPError(404, netResponse.error.message));
        }
      } else {
        callback(null, str);
      }
    });

  }).on("error", function(e){
    // request error
    callback(new HTTTPError(401, "Got error: " + e.message));
  });
};

exports.getRainGauge = function(req, callback){

  var type = "Rain";
  var scale = "max";
  var dateEnd = "last";

  var options = {
    host: 'api.netatmo.net',//+ req.deviceId
    path: '/api/getmeasure?access_token=' + req.token + "&device_id=" + req.query.deviceId +"&module_id=" + req.query.moduleId  + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
  };

  // make request to Netatmo with options
  netatmoRequest(options, function(err, answer){

    if(err) {
      callback(err);
    }
    else {

      info = JSON.parse(answer);
      module = info;

      //Loggs for testing...
      // console.log(">Response from netatmo (info): "+answer);
      // console.log(">Values from netatmo (Rain): "+module.body[0].value[0]);

      var reModel = new response.ResponseModel(
        req.query.deviceId,
        req.query.moduleId,
        "RainGauge",
        null,
        [
          new response.MeasureModel("Rain",  module.body[0].value[0][0], unit.Rain)
        ],
        info.time_exec,
        info.time_server
      );

      callback(null, reModel.makeJSON());
    }
  });
};

exports.getThermostate = function(req, callback){

  var deviceId = req.query.deviceId;
  var moduleId = req.query.moduleId;

  var options = {
    host: 'api.netatmo.net',
    path: '/api/getthermstate?access_token=' + req.token + "&device_id=" + deviceId + "&module_id=" + moduleId

  };

  netatmoRequest(options, function(err, info){
    if(err) {
      callback(err);
    }
    else {

      // OBS this function is not yet tested on a real device.
      // Measured (typ some seconds eller thermostate) : It contains the last measurements of the Thermostat

      info = JSON.parse(info);
      module = info;

      //Loggs for testing...
      // console.log(">Response from netatmo (info): "+info);
      // console.log(">Values from netatmo (Rain): "+module.body[0].value[0]);

      var reModel = new response.ResponseModel(
        req.query.deviceId,
        req.query.moduleId,
        "Thermostate",
        "Nothing of what's returned can be used",
        [
          new response.MeasureModel("Temperature",  module.body.measured.temperature, unit.Temperature), //temprature of last measurement
          new response.MeasureModel("Time",  module.body.measured.time, unit.Time)      //Time of the measurement
        ],
        info.time_exec,
        info.time_server
      );

      callback(null, reModel.makeJSON());

    }
  });
};



exports.getDevices = function(req, callback) {

  var options = {
    host: 'api.netatmo.net',
    path: '/api/devicelist?access_token=' + req.token
  };

  netatmoRequest(options, function(err, answer){
    if(err) {
      callback(err);
    }
    else {

      //Loggs for testing...
      //console.log(">Response from netatmo (info): "+answer);

      info = JSON.parse(answer);
      module = info;

      var modules = private_DeviceListStripper(module.body.modules);
      var devices = private_DeviceListStripper(module.body.devices);

      var usersDeviceList = private_DeviceListFixerUpper(modules, devices);
      
      callback(null, usersDeviceList);
    }
  });
};

exports.getUser = function(req, callback){
  var options = {
    host: "api.netatmo.net",
    path: "/api/getuser?access_token=" + req.token
  };

  netatmoRequest(options, function(error, answer){
    if(error !== null){
      callback(error);
    }else{
      answer = JSON.parse(answer);
      userRe = new response.UserResponseModel("Netatmo", answer.body.mail ,answer.body.time_exec, answer.body.time_server);

      callback(null, userRe.makeJSON());
    }
  });

};


exports.getOutdoorModule = function(req, callback) {

  var scale = "max";
  var dateEnd = "last";
  var type = "Temperature,Humidity";

  var options = {
    host: 'api.netatmo.net',
    path: '/api/getmeasure?access_token=' + req.token + "&device_id=" + req.query.deviceId  + "&module_id=" + req.query.moduleId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
  };

  netatmoRequest(options, function(err, info){
    if(err) {
      callback(err);
    }
    else {

      info = JSON.parse(info);
      module = info;

      //Loggs for testing...
      // console.log(">Response from netatmo (info): "+info);
      // console.log(">Values from netatmo (Temperature,CO2,Humidity,Pressure,Noise,Rain): "+module.body[0].value[0]);

      var reModel = new response.ResponseModel(
        req.query.deviceId,
        req.query.moduleId,
        "OutdoorModule",
        null,
        [
          new response.MeasureModel("Temperature",  module.body[0].value[0][0], unit.Temperature),
          new response.MeasureModel("Humidity",     module.body[0].value[0][1], unit.Humidity)
        ],
        info.time_exec,
        info.time_server
      );

      callback(null, reModel.makeJSON());
    }
  })
};

exports.getIndoorModule = function(req, callback) {
  var scale = "max";
  var dateEnd = "last";
  var type = "Temperature,CO2,Humidity";

  var options = {
    host: 'api.netatmo.net',
    path: '/api/getmeasure?access_token=' + req.token + "&device_id=" + req.query.deviceId + "&module_id=" + req.query.moduleId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
  };

  netatmoRequest(options, function(err, info){
    if(err) {
      callback(err);
    }
    else {

      //What is this?
      //The response from Netatmo is made and we take the important data and make a ResponseModel of it.
      //For each "Measure" (ex Measure of Temprature, C02 or Humidity) a MeasureModel is created and pushed into
      //the array withing the ResponseModel.
      //Note: Measure is the same as the types we send into the request to netatmo, in this case:  "var type = "Temperature,CO2,Humidity";"

      info = JSON.parse(info);
      module = info;

      //Loggs for testing...
      // console.log(">Response from netatmo (info): "+info);
      // console.log(">Values from netatmo (Temperature,CO2,Humidity): "+module.body[0].value[0]);

      var reModel = new response.ResponseModel(
        req.query.deviceId,
        req.query.moduleId,
        "IndoorModule",
        null,
          [
            new response.MeasureModel("C02", module.body[0].value[0][1], unit.CO2),
            new response.MeasureModel("Temperature", module.body[0].value[0][0], unit.Temperature),
            new response.MeasureModel("Humidity", module.body[0].value[0][2], unit.Humidity)
          ],
        info.time_exec,
        info.time_server
      );

      callback(null, reModel.makeJSON());
    }
  })
};

exports.getWeatherStation = function(req, callback){

    var scale = "max";
    var dateEnd = "last";
    var type = "Temperature,CO2,Humidity,Pressure,Noise";

    var options = {
        host: 'api.netatmo.net',
        path: '/api/getmeasure?access_token=' + req.token + "&device_id=" + req.query.deviceId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
    };
    netatmoRequest(options, function(err, answer){
        if(err) {
            callback(err);
        }
        else {

          info = JSON.parse(answer);
          module = info;

          //Loggs for testing...
          // console.log(">Response from netatmo (info): "+answer);
          // console.log(">Values from netatmo (Temperature,CO2,Humidity,Pressure,Noise): "+module.body[0].value[0]);

          var reModel = new response.ResponseModel(
            req.query.deviceId,
            req.query.moduleId,
            "WeatherStation",
            null,
            [
              new response.MeasureModel("Temperature",  module.body[0].value[0][0], unit.Temperature),
              new response.MeasureModel("CO2",          module.body[0].value[0][1], unit.CO2),
              new response.MeasureModel("Humidity",     module.body[0].value[0][2], unit.Humidity),
              new response.MeasureModel("Pressure",     module.body[0].value[0][3], unit.Pressure),
              new response.MeasureModel("Noise",        module.body[0].value[0][4], unit.Noise)
            ],
            info.time_exec,
            info.time_server
          );

          callback(null, reModel.makeJSON());
        }
    });
}

private_DeviceListFixerUpper = function(modules, devices){
  var usersDeviceList = {/*modules : null,*/ devices : null};
  //var moduleList = [];
  var deviceList = [];
  for(var i = 0; i < modules.length; i++){
    //moduleList.push(modules[i].body)
    deviceList.push(modules[i].body.devices[0])
  }
  for(var i = 0; i < devices.length; i++){
    var modules = devices[i].body.devices[0];
    deviceList.push({
      deviceId:modules.deviceId,
      mainDevice: null,
      deviceType: modules.deviceType,
      moduleName:modules.moduleName,
      meassures: modules.meassures
      /*,
      modulesIds: devices[i].body.modulesIds,
      cipher_id: devices[i].body.cipher_id}*/ })
  }

  //usersDeviceList.modules = moduleList;
  usersDeviceList.devices = deviceList;

  return usersDeviceList;
}

private_getTypeUnit = function(type){
  switch(type){
    case "Temperature" :
      return unit.Temperature;
      break;
    case "CO2" :
      return unit.CO2;
      break;
    case "Humidity" :
      return unit.Humidity;
      break;
    case "Rain" :
      return unit.Rain;
      break;
    case "Noise" :
      return unit.Noise;
      break;
    case "Pressure" :
      return unit.Pressure;
      break;
    default :
      return "Unit for " + type + " was not found...";
      break;
  }
}


private_DeviceListStripper = function(answer){
  var arrWithModels = [];

  for(var i = 0; i < answer.length; i++){

    var modulesTypes =  answer[i].data_type;
    var arrWithMeasureModels = [];
    for(var j = 0; j < modulesTypes.length; j++){

      var meModel = new response.MeasureModel(modulesTypes[j], answer[i].dashboard_data[modulesTypes[j]] , private_getTypeUnit(modulesTypes[j]));

      arrWithMeasureModels.push(meModel);
    }
    //console.log(answer[i])
    var reModel = new response.ResponseModel(
      answer[i]._id,
      answer[i].main_device !== undefined ? answer[i].main_device : null,  // if Main_device doesnt exist, then use null
      deviceType[answer[i].type],
      answer[i].module_name,
      arrWithMeasureModels,
      info.time_exec,
      info.time_server
    );

    if(answer[i].cipher_id !== undefined){ //If chiper_id exists then we know were looking at a "Device". This allows us to add specific details to the return for device
      reModel.body.modulesIds = answer[i].modules;
      reModel.body.cipher_id = answer[i].cipher_id;
    }

    arrWithModels.push(reModel);
  }
  return arrWithModels;
};
