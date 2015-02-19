var http = require('http');
var HTTPError = require('node-http-error');

function netatmoRequest(options, callback) {

  http.get(options, function(resp){
    var str = "";
    resp.on('data', function(chunk){
      str += chunk;
    });

    resp.on('end', function () {
        console.log("HEJ");
        console.log(str);
      var netResponse = JSON.parse(str);
        console.log("FUNKA");
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
    //TODO: If user has more than one RainGauge then this function need to get support for more than one RainGauge...
    //Private_getDeviceFromDevices(req, "NAModule3", callback);

    var type = "Rain";
    var scale = "max";
    var dateEnd = "last";



    var options = {
        host: 'api.netatmo.net',//+ req.deviceId
        path: '/api/getmeasure?access_token=' + req.token + "&device_id=05:00:00:00:5e:e8"  + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd
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

    //Private_getDeviceFromDevices(req, "NATherm1", callback);

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
  });

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
