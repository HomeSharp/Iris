//var User = require('../models/user');
var Bubbles = require('../Bubbles/bubbles');

function requiredHeaders(req, next){
  if(req.headers.access_token === undefined) {
    console.log("no ACCESS_token");
    next(new Error("No access token present in header"));
  } else if(req.headers.brand === undefined) {
    console.log("no BRAND");
    var e = new Error("No brand present in header");
    e.status = 401;
    next(e);
  } else {
    next(null, { reqInfo: { token: req.headers.access_token, brand: req.headers.brand } });
  }
};

exports.getUser = function(req, res) {

};

exports.getDevices = function(req, res) {
  requiredHeaders(req, function(err, reqInfo) {
    if(err) {
      console.log(err.status);
      res.statusCode = err.staus;
      res.send({ Error: err.message });
    } else {
      Bubbles.getDevices(reqInfo ,function(err, devices) {
        if(err) {
          res.send({ Error: err });
        }
        res.send(devices);
      });
    }
  });
};

exports.postDevice = function(req, res) {
  res.send(req.body);
};
