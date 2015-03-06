

//req should contain all the keys.
exports.getDevices = function (req, callback) {
    
    var TelldusAPI = require('telldus-live');
    var secrets = require('secrets');
    
    //keys are hardcoded here
    var publicKey = secrets.publicKey?secrets.publicKey: 'xxx'
  , privateKey = secrets.privateKey?secrets.privateKey:'xxx'
  , token = secrets.token?secrets.token:'xxx'
  , tokenSecret = secrets.tokenSecret?secrets.tokenSecret:'xxx'
  , cloud
    ;
    
    //Logging, fixing and trixing
    cloud = new TelldusAPI.TelldusAPI({
        publicKey  : publicKey, 
        privateKey : privateKey
    }).login(token, tokenSecret, function (err, user) {
        if (!!err) return console.log('login error: ' + err.message);       
        
        //The user
        console.log('user: '); console.log(user);

    }).on('error', function (err) {
        console.log('background error: ' + err.message);
    });  
    
    //All devices are collected into an array
    cloud.getDevices(function (err, devices) {
        
        //Loggs the array
        console.log(devices);

    }).on('error', function (err) {
        console.log('background error: ' + err.message);
    });

  callback(null, "not yet implemented");
};



exports.getUser = function(req, callback){

    callback(null, "not yet implemented");

};