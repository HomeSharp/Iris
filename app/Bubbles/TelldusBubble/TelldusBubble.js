var http = require('http');
var HTTPError = require('node-http-error');
var oauth = require('oauth')

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
      console.log("3. res");
      console.log(res);
    }
  )
};


exports.getDevices = function (req, callback) {
  var options = {
    host: 'http://api.telldus.com/json',
    path: '/devices/list?',
    queryMethods: 1,
    publicKey: req.publicKey,
    privateKey: req.privateKey,
    token: req.token,
    tokenSecret: req.tokenSecret
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

    callback(null, "not yet implemented");

};
