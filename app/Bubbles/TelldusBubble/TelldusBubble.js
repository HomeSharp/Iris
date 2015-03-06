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

    callback(null, "not yet implemented");

};
