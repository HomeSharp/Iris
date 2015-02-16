var http = require('http');
var HTTPError = require('node-http-error');

exports.getDevices = function(req, callback) {

  // make request to netatmo API with token
  var options = {
    host: 'api.netatmo.net',
    path: '/api/devicelist?access_token=' + req.token
  };

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

exports.getModule = function(req, callback) {

  var scale = "max";
  var dateEnd = "last";
  var type = "Temperature, CO2, Humidity, Pressure, Noise"
  var params = req.token + "&device_id=" + req.deviceId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd;

  netatmoDevice(params, function(err, info){
    if(err) {
      callback(err);
    }
    else {
      callback(null, info);
    }
  });

};

exports.getRainGauge = function(req, callback) {

  var scale = "max";
  var dateEnd = "last";
  var type = "Rain"
  var params = req.token + "&device_id=" + req.deviceId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd;

  netatmoDevice(params, function(err, info){
    if(err) {
      callback(err);
    }
    else {
      callback(null, info);
    }
  });

};

exports.getThermostate = function(req, callback) {

  var scale = "max";
  var dateEnd = "last";
  var type = "Temperature, Sp_Temperature"
  var params = req.token + "&device_id=" + req.deviceId + "&type=" + type + "&scale=" + scale + "&date_end=" + dateEnd;

  netatmoDevice(params, function(err, info){
    if(err) {
      callback(err);
    }
    else {
      callback(null, info);
    }
  });

};

function netatmoDevice(pathParams, next) {

  var options = {
    host: 'api.netatmo.net',
    path: '/api/getmeasure?access_token=' + pathParams
  };

  http.get(options, function(resp){
    var str = "";
    resp.on('data', function(chunk){
      str += chunk;
    });

    resp.on('end', function () {
      next(null, str);
    });

  }).on("error", function(e){
    console.log("Got error: " + e.message);
    next(new Error("Got error: " + e.message));
  });
};
