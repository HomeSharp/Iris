var http = require('http');
var HTTPError = require('node-http-error');

function netatmoRequest(options, callback) {
  console.log("netatmoRequest is called");
  http.get(options, function(resp){
    var str = "";
    resp.on('data', function(chunk){
      str += chunk;
    });

    resp.on('end', function () {

            var netResponse = JSON.parse(str);
            
            

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

function GetNormalize(str) {
    
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
                            "unit" : "celcius"
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

  netatmoRequest(options, function(err, answer){

    if(err) {
      callback(err);
    }
    else {
      callback(null, answer);
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
      callback(null, info);
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
      callback(null, answer);
    }
  });
}


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
      callback(null, answer);
    }
  });

};


exports.getModule = function(req, callback) {

  var scale = "max";
  var dateEnd = "last";
  var type = "Temperature,CO2,Humidity,Pressure,Noise,Rain"; // INTE MELLANRUM HÄR!!!

  var options = {
    host: 'api.netatmo.net',//+ req.deviceId
    path: '/api/getmeasure?access_token=' + req.token + "&device_id=70:ee:50:01:ed:f0" + "&module_id=03:00:00:00:6a:72" + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
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
      callback(null, info);
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
            callback(null, answer);
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
