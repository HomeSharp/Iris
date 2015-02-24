

//req skulle innehålla alla keys.
exports.getDevices = function (req, callback) {
    
    var TelldusAPI = require('telldus-live');
    var secrets = require('secrets');
    
    //Nycklar hårdkodat in här
    var publicKey = secrets.publicKey?secrets.publicKey:'FEHUVEW84RAFR5SP22RABURUPHAFRUNU'
  , privateKey = secrets.privateKey?secrets.privateKey:'ZUXEVEGA9USTAZEWRETHAQUBUR69U6EF'
  , token = secrets.token?secrets.token:'cc2fde2d62d296cfefc1d3973323b595052331799'
  , tokenSecret = secrets.tokenSecret?secrets.tokenSecret:'b4321b334657dc8fbaf892d909806796'
  , cloud
    ;
    
    
    
    
    
    
    
    
    
    
    
    

  callback(null, "not yet implemented");
};

exports.getUser = function(req, callback){

    callback(null, "not yet implemented");

};