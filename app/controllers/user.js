//var User = require('../models/user');
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
  console.log("getUser is called");
  //Check for legit header...

  requiredHeaders(req, function(error, reqInfo){

    //Since we really just use requiredHeaders to make sure the use of them, we can then dissmiss the "reqInfo" from that function...
    var reqInfo = getReqInfoParams(req); //makes use of Telldus requirments...

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

  console.log("getDevices is called");
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

exports.postDevice = function(req, res) {
  //Data from Quarts
  //access_token and brand

  var reqInfo = { token: req.body.access_token, brand: req.body.brand };

  res.send(req.body);
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
