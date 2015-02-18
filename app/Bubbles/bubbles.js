var NetatmoBubble = require('./NetatmoBubble/NetatmoBubble');
var TelldusBubble = require('./TelldusBubble/TelldusBubble');

var HTTPError = require('node-http-error');

function getBrandBubble(req, callback){ //Utbrytning av "getBrandBubble"
    // 1 choose proper bubble
    var callBubble = chooseBubble(req.reqInfo.brand);
    if(callBubble === undefined) {
        // Bubble not found
        callback(new HTTPError(400, "Brand not found"));
    }
    return callBubble;
}

exports.getDevices = function(req, callback) {
  var callBubble;
  // 1 choose proper bubble
  //var callBubble = chooseBubble(req.reqInfo.brand);
  if(callBubble = getBrandBubble(req, callback)) {
/*    // Bubble not found
    callback(new HTTPError(400, "Brand not found"));
  } else {*/
    // 2 call that bubble
    callBubble.getDevices(req.reqInfo , function(err, devices) {
      if(err){
        // a Bubble plugin error occured
        callback(err);
      }
      else if(devices === undefined) {
        callback(new HTTPError(404, "Devices not found"));
      } else {
        callback(null, devices);
      }
    });
  }
};

exports.getUser = function(req, callback){
    var callBubble = chooseBubble(req.reqInfo.brand);
    if(callBubble === undefined){
        //invalid/none-existent brand
        callback(new Http);


    }
};

function chooseBubble(brand) {
  var bubble;
  switch(brand)
  {
  case "Netatmo":
    bubble = NetatmoBubble;
    break;
  case "Telldus":
    bubble = TelldusBubble;
    break;
  }
  return bubble;
};
