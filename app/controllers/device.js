var Bubbles = require('../Bubbles/bubbles');

exports.getModule = function(req, res) {
  // ger info till Bubbles om:
  // 1) access_token 2) brand

  // förväntar sig att få tillbaka en modul

  var reqInfo = { reqInfo: { token: req.headers.access_token, brand: req.headers.brand } };

  Bubbles.getModule(reqInfo ,function(err, device) {
    if(err) {
      console.log(err);
      res.send({ Error: "There was a problem getting the module"});
    }
    res.send(device);
  });
};

exports.getRainGauge = function(req, res) {
  // ger info till Bubbles om:
  // 1) access_token 2) brand

  // förväntar sig att få tillbaka en RainGauge

  var reqInfo = { reqInfo: { token: req.headers.access_token, brand: req.headers.brand } };

  Bubbles.getRainGauge(reqInfo ,function(err, device) {
    if(err) {
      console.log(err);
      res.send({ Error: "There was a problem getting the rainGauge"});
    }
    res.send(device);
  });
};

exports.getThermostate = function(req, res) {
  // ger info till Bubbles om:
  // 1) access_token 2) brand

  // förväntar sig att få tillbaka en Thermostate

  var reqInfo = { reqInfo: { token: req.headers.access_token, brand: req.headers.brand } };

  Bubbles.getThermostate(reqInfo ,function(err, device) {
    if(err) {
      console.log(err);
      res.send({ Error: "There was a problem getting the thermostate"});
    }
    res.send(device);
  });
};