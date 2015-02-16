//var User = require('../models/user');
var Bubbles = require('../Bubbles/bubbles');

exports.getUser = function(req, res) {

};

exports.getDevices = function(req, res) {
  // ger info till Bubbles om:
  // 1) access_token 2) brand

  // förväntar sig tillbaka en lista med devices

  var reqInfo = { reqInfo: { token: req.headers.access_token, brand: req.headers.brand } };

  Bubbles.getDevices(reqInfo ,function(err, devices) {
    if(err) {
      console.log(err);
      res.send({ Error: "There was a problem getting the devices"});
    }
    res.send(devices);
  });
};

exports.postDevice = function(req, res) {
  //Data kommer in från Quarts (om jag förstår det rätt, kom in från Postman)
  //access_token och brand

  var reqInfo = { token: req.body.access_token, brand: req.body.brand };

  res.send(req.body);
};
