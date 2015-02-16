//var User = require('../models/user');
var Bubbles = require('../Bubbles/bubbles');
var HTTPError = require('node-http-error');

function requiredHeaders(req, next){
  if(req.headers.access_token === undefined) {
    next(new HTTPError(400, "No access token present in header"));
  } else if(req.headers.brand === undefined) {
    next(new HTTPError(400, 'No brand present in header'));
  } else {
    next(null, { reqInfo: { token: req.headers.access_token, brand: req.headers.brand } });
  }
};

function respondError(err, res){
  res.statusCode = err.status;
  res.send({ Error: err.message });
};

exports.getUser = function(req, res) {

};

exports.getDevices = function(req, res) {
  requiredHeaders(req, function(err, reqInfo) {
    if(err) {
      respondError(err, res);
    } else {
      Bubbles.getDevices(reqInfo ,function(err, devices) {
        if(err) {
          respondError(err, res);
        }
        res.send(devices);
      });
    }
  });
};

exports.postDevice = function(req, res) {
  res.send(req.body);
};
