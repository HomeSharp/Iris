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
  res.statusCode = err.status;
  res.send({ Error: err.message });
};


exports.getModule = function(req, res) {
  // ger info till Bubbles om:
  // 1) access_token 2) brand

  // förväntar sig att få tillbaka en modul

  //var reqInfo = { reqInfo: { token: req.headers.access_token, brand: req.headers.brand } };
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
  console.log("getIndoorModule is called");

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
  console.log("getRainGauge is called");
  // ger info till Bubbles om:
  // 1) access_token 2) brand

  // förväntar sig att få tillbaka en RainGauge

  requiredHeaders(req, function(error, reqInfo) {

    if (error !== null) {
      respondError(error, res)
    } else {
      Bubbles.getRainGauge(reqInfo, function (err, device) {
        if (err !== null) {
          respondError(err, res);
        }

      });
    }
  });
};

//Vet inte viklken funkton som skulle bort (när jag konfliktlöste) så jag avkommenterade den jag kände minst igen..
/*exports.getThermostate = function(req, res) {
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
};*/

exports.getThermostate = function(req, res) {
  console.log("getThermostate is called");
  // ger info till Bubbles om:
  // 1) access_token 2) brand

  // förväntar sig att få tillbaka en Thermostate
  requiredHeaders(req, function(error, reqInfo){

    if(error !== null){
      respondError(error, res)
    }else{
      Bubbles.getThermostate(reqInfo, function(err, device) {
        if (err !== null) {
          console.log(err);
          respondError(err, res);
        }
        res.send(device);
      });
    }
  });
}

//TODO: this is the old getThermostate function. I saved it because i'm unsure...
/*
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
 };*/
