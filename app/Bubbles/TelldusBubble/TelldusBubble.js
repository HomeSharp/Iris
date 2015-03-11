var http = require('http');
var HTTPError = require('node-http-error');
var oauth = require('oauth')
var response = require("../ResponseModel");

var telldusState = {
 1    : "On",
 2    : "Off",
 16   : "Dimmed"
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

  telldusOauthRequest(options, function(err, answer){
    if(err) {
      callback(err);
    }
    else {
      callback(null, answer);
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
