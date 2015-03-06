var http = require('http');
var HTTPError = require('node-http-error');
var oauth = require('oauth')
var response = require("../ResponseModel");
var userResponse = require("../UserResponseModel");

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

      console.log("2. data");
      console.log(data);

      if(err){
        error = JSON.parse(data).error
        console.log(data)

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

  console.log(req.publicKey)
  console.log(req.privateKey)
  console.log(req.token)
  console.log(req.tokenSecret)

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


      console.log(options);
      if (!!err){
        console.log(err);
        console.log('login error: ' + err.data)
        callback(new HTTPError(401, "Got error: " + (err.data))); //Dunno if the statuscode is right...;
        return
      }

      console.log(user);
      answer = user;

      userRe = new userResponse.UserResponseModel("Telldus", answer.email, null, null);


      callback(null, userRe.makeJSON());

    }).on('error', function (err) {
      console.log('background error: ' + err.message);
    });


};

// OLD getDevices, That we dont use (?)
//req should contain all the keys.
/*
exports.getDevices = function (req, callback) {

  var TelldusAPI = require('telldus-live');
  var secrets = require('secrets');

  //keys are hardcoded here
  var publicKey = secrets.publicKey?secrets.publicKey: 'xxx'
    , privateKey = secrets.privateKey?secrets.privateKey:'xxx'
    , token = secrets.token?secrets.token:'xxx'
    , tokenSecret = secrets.tokenSecret?secrets.tokenSecret:'xxx'
    , cloud
    ;

  //Logging, fixing and trixing
  cloud = new TelldusAPI.TelldusAPI({
    publicKey  : publicKey,
    privateKey : privateKey
  }).login(token, tokenSecret, function (err, user) {
      if (!!err) return console.log('login error: ' + err.message);

      //The user
      console.log('user: '); console.log(user);

    }).on('error', function (err) {
      console.log('background error: ' + err.message);
    });

  //All devices are collected into an array
  cloud.getDevices(function (err, devices) {

    //Loggs the array
    console.log(devices);

  }).on('error', function (err) {
    console.log('background error: ' + err.message);
  });

  callback(null, "not yet implemented");
*/
