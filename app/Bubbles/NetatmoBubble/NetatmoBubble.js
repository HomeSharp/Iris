var http = require('http');
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
      callback(null, str);
    });

  }).on("error", function(e){
    console.log("Got error: " + e.message);
    callback(new Error("Got error: " + e.message));
  });
};
