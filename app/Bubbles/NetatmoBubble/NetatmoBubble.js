var http = require('http');
var HTTPError = require('node-http-error');
var response = require("../ResponseModel");
var userResponse = require("../UserResponseModel");
var unit = {
 "Temperature"  : "Celsius",
 "CO2"          : "Parts per million",
 "Humidity"     : "Percent",
 "Rain"         :  "Millimeter",
 "Noise"        :  "Decibel",
 "Pressure"     :  "Millibar"
};


function netatmoRequest(options, callback) {
  console.log("netatmoRequest is called");
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

// should this be done in "getNormalize?"
function temp() {
  //Status
  var status = netResponse.status; //Status

  //Får ut en module
  for (i = 0; i < netResponse.body.modules.length; ++i) {

      //En module
      var tempJson = netResponse.body.modules[i];

      var deviceId = Json._id;
      var mainDevice = Json.main_device;
      var deviceType = Json.

      //alert(json["satus"]);
      console.log(netResponse.body.modules[i]);
      console.log("Debugger Stop");
  }
}


//this function is dead and unused
function getNormalize(str) {
    var responseObj = {};
    var modules = [];

    responseObj.modules = modules;

    //Här ska data hämtas från response från Netatmo json
    var status = "200";
    var deviceId = "03:00:00:00:6a:72";

    //Våran mall
    var module = {
        "status": status,
        "body": {
            "devices": [
                {
                    "deviceId": deviceId,
                    "mainDevice": "70:ee:50:01:ed:f0",
                    "deviceType": "weatherModule",
                    "moduleName": "Sovrum",
                    "meassures": [
                        {
                            "type": "Temperature",
                            "value" : 20.8,
                            "unit" : unit.Temperature
                        },
                        {
                            "type": "Humidity",
                            "value" : 35,
                            "unit": "some unit"
                        },
                        {
                            "type": "CO2",
                            "value" : 528,
                            "unit": "some unit"
                        }
                    ]
                }
            ]
        },
        "time_exec": 0.033046960830688,
        "time_server": 1424263797
    };

    responseObj.modules.push(module);

};


exports.getRainGauge = function(req, callback){
  //TODO: If user has more than one RainGauge then this function need to get support for more than one RainGauge...
  //Private_getDeviceFromDevices(req, "NAModule3", callback);

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

      // if response from Netatmo is valid - make it general <-- old comment(?)
      /*getNormalize(answer, function(err, generalAnswer){

        if(err)
        {
          callback(err);
        }
        else {*/

          //Loggs for testing...
          console.log(">Response from netatmo (info): "+answer);
          info = JSON.parse(answer);
          module = info;
          console.log(">Values from netatmo (Rain): "+module.body[0].value[0]);


          var reModel = new response.ResponseModel(
            req.query.deviceId,
            req.query.moduleId,
            "Module",
            "Nothing that returns can be used",
            [
              new response.MeasureModel("Rain",  module.body[0].value[0][0], unit.Rain)
            ],
            info.time_exec,
            info.time_server
          );

          callback(null, reModel.makeJSON());
        /*}*/
      /*})*/
    }
  });
};

exports.getThermostate = function(req, callback){

  var deviceId = req.query.deviceId;
  var moduleId = req.query.moduleId;

  console.log(deviceId);
  console.log(moduleId);

  var options = {
    host: 'api.netatmo.net',
    path: '/api/getthermstate?access_token=' + req.token + "&device_id=" + deviceId + "&module_id=" + moduleId

  };

  netatmoRequest(options, function(err, info){
    if(err) {
      callback(err);
    }
    else {

      //OBS this function is not yet tested on a real device.
      // Measured (typ some seconds eller thermostate) : It contains the last measurements of the Thermostat
      //Loggs for testing...
      console.log(">Response from netatmo (info): "+info);
      info = JSON.parse(info);
      module = info;
      console.log(">Values from netatmo (Rain): "+module.body[0].value[0]);


      var reModel = new response.ResponseModel(
        req.query.deviceId,
        req.query.moduleId,
        "Thermostate",
        "Nothing of what's returned can be used",
        [
          new response.MeasureModel("Temperature",  module.body.measured.temperature, unit.Temperature), //temprature of last measurement
          new response.MeasureModel("Time",  module.body.measured.time, "seconds")      //Time of the measurement
        ],
        info.time_exec,
        info.time_server
      );

      callback(null, reModel.makeJSON());

    }
  });
};

function Private_getDeviceFromDevices(req, moduleToLookFor, callback){
  var Arr = [];

  Private_getDevices(req, function(error, devices){

    if(error) {

      callback(error);
    }
    else {
      devices = JSON.parse(devices);
      for(var i = 0; i < devices.body.modules.length; i++){
        if(devices.body.modules[i].type === moduleToLookFor){ //Figure out if Module is moduleToLookFor
          Arr.push(devices.body.modules[i]);
        }
      }

      if(Arr.length === 0){
        callback(new HTTPError(404, "No "+ moduleToLookFor +" found"));
      }else{
        callback(null, JSON.stringify(Arr));
      }
    }
  });
}

function Private_getDevices(req, callback){
  var options = {
    host: 'api.netatmo.net',
    path: '/api/devicelist?access_token=' + req.token
  };
  //console.log(req.token);

  netatmoRequest(options, function(err, answer){
    if(err) {
      callback(err);
    }
    else {

      //Loggs for testing...
      console.log(">Response from netatmo (info): "+answer);
      info = JSON.parse(answer);
      module = info;


      var modules = private_DeviceListStripper(module.body.modules);
      var devices = private_DeviceListStripper(module.body.devices);

      var usersDeviceList = private_DeviceListFixerUpper(modules, devices);

      callback(null,usersDeviceList);
    }
  });
}
private_DeviceListFixerUpper = function(modules, devices){
  var usersDeviceList = {modules : null, devices : null};
  var moduleList = [];
  var deviceList = [];
  for(var i = 0; i < modules.length; i++){
    moduleList.push(modules[i].body)
  }
  for(var i = 0; i < devices.length; i++){
    deviceList.push(devices[i].body)
  }

  usersDeviceList.modules = moduleList;
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

    var reModel = new response.ResponseModel(
      answer[i]._id,
      answer[i].main_device !== undefined ? answer[i].main_device : null,  // if Main_device doesnt exist, then use null
      answer[i].type,       //TODO: känns denna rätt? Vi får rätt konstiga typer från devicelist om denna används... (typ NAModule4 etc..)
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


exports.getDevices = function(req, callback) {

  Private_getDevices(req, callback);

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
      userRe = new userResponse.UserResponseModel("Netatmo", answer.body.mail ,answer.body.time_exec, answer.body.time_server);


      callback(null, userRe.makeJSON());
    }
  });

};


exports.getModule = function(req, callback) {

  var scale = "max";
  var dateEnd = "last";
  var type = "Temperature,CO2,Humidity,Pressure,Noise,Rain";

  var options = {
    host: 'api.netatmo.net',
    path: '/api/getmeasure?access_token=' + req.token + "&device_id=" + req.query.deviceId  + "&module_id=" + req.query.moduleId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
  };

  netatmoRequest(options, function(err, info){
    if(err) {
      callback(err);
    }
    else {
      //Loggs for testing...
      console.log(">Response from netatmo (info): "+info);
      info = JSON.parse(info);
      module = info;
      console.log(">Values from netatmo (Temperature,CO2,Humidity,Pressure,Noise,Rain): "+module.body[0].value[0]);


      var reModel = new response.ResponseModel(
        req.query.deviceId,
        req.query.moduleId,
        "Module",
        "Nothing that is returned can be used here",
        [
          new response.MeasureModel("Temperature",  module.body[0].value[0][0], unit.Temperature),
          new response.MeasureModel("CO2",          module.body[0].value[0][1], unit.CO2),
          new response.MeasureModel("Humidity",     module.body[0].value[0][2], unit.Humidity),
          new response.MeasureModel("Pressure",     module.body[0].value[0][3], unit.Pressure),
          new response.MeasureModel("Noise",        module.body[0].value[0][4], unit.Noise),
          new response.MeasureModel("Rain",         module.body[0].value[0][5], unit.Rain)
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
  console.log(req);

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

      //Loggs for testing...
      console.log(">Response from netatmo (info): "+info);
      info = JSON.parse(info);
      module = info;
      console.log(">Values from netatmo (Temperature,CO2,Humidity): "+module.body[0].value[0]);

      var reModel = new response.ResponseModel(
        req.query.deviceId,
        req.query.moduleId,
        "IndoorModule",
        "Nothing that returns can be used",
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
          //Loggs for testing...
          console.log(">Response from netatmo (info): "+answer);
          info = JSON.parse(answer);
          module = info;
          console.log(">Values from netatmo (Temperature,CO2,Humidity,Pressure,Noise): "+module.body[0].value[0]);


          var reModel = new response.ResponseModel(
            req.query.deviceId,
            req.query.moduleId,
            "WeatherStation",
            "Nothing that returns can be used",
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
//TODO:This function is, as of the moment, replaced. We need to check which is the better solution, this or the other.
/*exports.getRainGauge = function(req, callback) {

  var scale = "max";
  var dateEnd = "last";
  var type = "Temperature,CO2,Humidity";
  console.log(req);

  var options = {
    host: 'api.netatmo.net',
    path: '/api/getmeasure?access_token=' + req.token + "&device_id=" + req.query.deviceId + "&module_id=" + req.query.moduleId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
  };

  netatmoRequest(options, function(err, info){
    if(err) {
      callback(err);
    }
    else {
      callback(null, info);
    }
  })
};


//TODO:This function is, as of the moment, replaced. We need to check which is the better solution, this or the other.
/*exports.getRainGauge = function(req, callback) {

 var scale = "max";
 var dateEnd = "last";
 var type = "Rain";

 var options = {
 host: 'api.netatmo.net',
 path: '/api/getmeasure?access_token=' + req.token + "&device_id=" + req.deviceId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
 };

 netatmoRequest(options, function(err, info){
 if(err) {
 callback(err);
 }
 else {
 callback(null, info);
 }
 });

 };*/

//TODO:This function is, as of the moment, replaced. We need to check which is the better solution, this or the other.
/*exports.getThermostate = function(req, callback) {

 var scale = "max";
 var dateEnd = "last";
 var type = "Temperature, Sp_Temperature";

 var options = {
 host: 'api.netatmo.net',
 path: '/api/getmeasure?access_token=' + req.token + "&device_id=" + req.deviceId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
 };

 netatmoRequest(options, function(err, info){
 if(err) {
 callback(err);
 }
 else {
 callback(null, info);
 }
 });

 };*/
