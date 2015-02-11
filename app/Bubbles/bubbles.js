var NetatmoBubble = require('./NetatmoBubble/NetatmoBubble');
var TelldusBubble = require('./TelldusBubble/TelldusBubble');

exports.getDevices = function(req, callback) {

  // 1 choose proper bubble
  var callBubble = chooseBubble(req.reqInfo.brand);
  if(callBubble === undefined) {
    callback(new Error("Brand not found"));
  } else {
    // 2 call that bubble
    callBubble.getDevices(req.reqInfo , function(err, devices) {
      if(devices === undefined) {
        callback(new Error("Devices not found"));
      } else {
        callback(null, devices);
      }
    });
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
