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

function getReqInfoParams(req){
  var reqInfo = {
    reqInfo: {
      token: req.headers.access_token,
      brand: req.headers.brand,
      tokenSecret: req.headers.tokensecret,
      publicKey: req.headers.publickey,
      privateKey: req.headers.privatekey,
      query: req.query
    }
  }
  return reqInfo
}


exports.turnOn = function(req, res) {
  requiredHeaders(req, function(error, reqInfo){
    if(error !== null){
      respondError(error, res)
    }else{
      var reqInfo = getReqInfoParams(req);
      Bubbles.turnOn(reqInfo, function(err, device) {
        if (err !== null) {
          respondError(err);
        }
        res.send(device);
      });
    }
  });
};

exports.turnOff = function(req, res) {
  requiredHeaders(req, function(error, reqInfo){
    if(error !== null){
      respondError(error, res)
    }else{
      Bubbles.turnOff(reqInfo, function(err, device) {
        if (err !== null) {
          respondError(err);
        }
        res.send(device);
      });
    }
  });
};
