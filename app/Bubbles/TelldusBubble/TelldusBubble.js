var http = require('http');
var HTTPError = require('node-http-error');
var oauth = require('oauth')
var response = require("../ResponseModel");

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
    path: '/devices/list?',
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
      callback(null, answer);
    }
  });
};



exports.getUser = function(req, callback){
  var options = {
    publicKey:    req.publicKey,
    privateKey:   req.privateKey,
    token:        req.token,
    tokenSecret:  req.tokenSecret
  };

  var TelldusAPI = require('telldus-live');
  //var secrets = require('secrets');

  cloud = new TelldusAPI.TelldusAPI({
    publicKey  : options.publicKey,
    privateKey : options.privateKey
  }).login(options.token, options.tokenSecret, function (err, user) {

      if (!!err){

        callback(new HTTPError(401, "Got error: " + (err.data))); //Dunno if the statuscode is right...;
        return
      }

      console.log(user);
      answer = user;

      userRe = new response.UserResponseModel("Telldus", answer.email, null, null);


      callback(null, userRe.makeJSON());

    }).on('error', function (err) {
      console.log('background error: ' + err.message);
    });


};
