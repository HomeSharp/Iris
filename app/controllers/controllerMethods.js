
exports.respondError = function(err, res){
  console.log("Error: " + err.message);
  res.statusCode = err.status;
  res.send({ Error: err.message });
};

exports.requiredHeaders = function(req, next){
  if(req.headers.access_token === undefined) {
    next(new HTTPError(400, "No access token present in header"));
  } else if(req.headers.brand === undefined) {
    next(new HTTPError(400, 'No brand present in header'));
  } else {
    next(null, getReqInfoParams(req));
  }
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
