var Bubbles = require('../Bubbles/bubbles');
var HTTPError = require('node-http-error');

function requiredHeaders(req, next){
  if(req.headers.access_token === undefined) {
    next(new HTTPError(400, "No access token present in header"));
  } else if(req.headers.brand === undefined) {
    next(new HTTPError(400, 'No brand present in header'));
  } else {
    next(null, { reqInfo: { token: req.headers.access_token, brand: req.headers.brand, query : req.query} });
  }
};

function respondError(err, res){
  console.log("Error: " + err.message);
  res.statusCode = err.status;
  res.send({ Error: err.message });
};

exports.getUser = function(req, res) {
  //Check for legit header...
  requiredHeaders(req, function(error, reqInfo){

    //makes use of Telldus requirments...
    var reqInfo = getReqInfoParams(req);

    if(error !== null){
      respondError(error, res);
    }else{
      Bubbles.getUser(reqInfo, function(error, user){
        if(error !== null){
          respondError(error, res);
        }else{
          res.send(user);
        }
      });
    }
  });
};



exports.getDevices = function(req, res) {

  requiredHeaders(req, function(err, reqInfo) {
    if(err) {
      respondError(err, res);
    } else {
      var reqInfo = getReqInfoParams(req);

      Bubbles.getDevices(reqInfo, function(err, devices) {
        if(err) {
          respondError(err, res);
        } else {
          res.send(devices);
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
