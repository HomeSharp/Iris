var Bubbles = require('../Bubbles/bubbles');
var HTTPError = require('node-http-error');

//This is not so DRY... Rather have this code somewhere that both device.js and user.js can get it...
function requiredHeaders(req, next){
  if(req.headers.access_token === undefined) {
    next(new HTTPError(400, "No access token present in header"));
  } else if(req.headers.brand === undefined) {
    next(new HTTPError(400, 'No brand present in header'));
  } else {
    next(null, { reqInfo: { token: req.headers.access_token, brand: req.headers.brand, query: req.query } });
  }
};
//This is not so DRY... Rather have this code somewhere that both device.js and user.js can get it...
function respondError(err, res){
  console.log("Error: " + err.message);
  res.statusCode = err.status;
  res.send({ Error: err.message });
};


exports.getModule = function(req, res) {

  requiredHeaders(req, function(error, reqInfo){

    if(error !== null){
      respondError(error, res)
    }else{
      Bubbles.getModule(reqInfo, function(err, device) {
        if (err !== null) {
          respondError(err, res);
        }
        res.send(device);
      });
    }
  });

};

exports.getIndoorModule = function(req, res){

  requiredHeaders(req, function(error, reqInfo){
    if(error !== null){
      respondError(error, res);
    }else{
      Bubbles.getIndoorModule(reqInfo, function(error, IndoorModule){
        if(error !== null){
          respondError(error, res);
        }else{
          res.send(IndoorModule);
        }
      });
    }
  });

};

exports.getRainGauge = function(req, res) {

  requiredHeaders(req, function(error, reqInfo) {

    if (error !== null) {
      respondError(error, res)
    } else {
      Bubbles.getRainGauge(reqInfo, function (err, device) {
        if (err !== null) {
          respondError(err, res);
        }else{
          res.send(device);
        }

      });
    }
  });
};

exports.getThermostate = function(req, res) {

  requiredHeaders(req, function(err, reqInfo){
    if(err){
      respondError(err, res)
    } else{
      Bubbles.getThermostate(reqInfo, function(err, device) {
        if (err) {
          respondError(err, res);
        }
        res.send(device);
      });
    }
  });
};


exports.getWeatherStation = function(req, res) {

  requiredHeaders(req, function(error, reqInfo) {
    if(error) {
      respondError(error, res);
    } else {
      Bubbles.getWeatherStation(reqInfo ,function(error, device) {
        if(error) {
          respondError(error, res);
        }else{
          res.send(device);
        }
      });
    }
  });
};

getReqInfoParams = function(req){
  var reqInfo = {
    reqInfo: {
      token: req.headers.access_token,
      brand: req.headers.brand,
      tokenSecret: req.headers.tokensecret,
      publicKey: req.headers.publickey,
      privateKey: req.headers.privatekey
    }
  }
  return reqInfo
}
