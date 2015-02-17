//var User = require('../models/user');
var Bubbles = require('../Bubbles/bubbles');
var HTTPError = require('node-http-error');

function requiredHeaders(req, next){
  if(req.headers.access_token === undefined) {
      //Bara ett av problemen (om flera) kommer att visas, alltså första. <- kanske inte ett problem
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
    console.log(req);
  requiredHeaders(req, function(err, reqInfo) {
    if(err) {
      respondError(err, res);
    } else {
      Bubbles.getDevices(reqInfo ,function(err, devices) {
        if(err) {
            respondError(err, res);
        }else{
            res.send(devices);
        }

      });
    }
  });
};

exports.postDevice = function(req, res) {
  //Data kommer in från Quarts (om jag förstår det rätt, kom in från Postman)
  //access_token och brand

  var reqInfo = { token: req.body.access_token, brand: req.body.brand };

  res.send(req.body);
};
