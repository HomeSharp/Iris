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

      var arrOfDevices = JSON.parse(answer);
      //arrOfDevices = arrOfDevices.devices;
      var arrOfDeviceResponses = [];
      var obj = {
        status : 200,
        devices: null
      }

      console.log(arrOfDevices)

      for(var i = 0; i < arrOfDevices.length; i++){
        var res = response.ResponseModel(arrOfDevices[i].id, arrOfDevices[i].client,null, arrOfDevices[i].name,[],null, null);
        //Fråga, ska idt från Telldus vara id eller ClientDeviceId ?
        //Fråga ska mainDevice vara samma som client?  eller är det kanske clientdeviceId?
        //Vad kan vi ha på deviceType på telldus? det finns ingen indikation på vilken typ devicen är av... Kanske clientDeviceID?
        //Här kan vi inte direkt skicka med något i Arrayen med meassures då vi itne får ut några meassures av Telldus...
        arrOfDeviceResponses.push(res.body);
      }

      obj.devices = arrOfDeviceResponses;

      callback(null, JSON.stringify(obj));
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
