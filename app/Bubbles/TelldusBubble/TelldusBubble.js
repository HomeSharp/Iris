

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
    
    //Loggar in och fixar och trixar
    cloud = new TelldusAPI.TelldusAPI({
        publicKey  : publicKey, 
        privateKey : privateKey
    }).login(token, tokenSecret, function (err, user) {
        if (!!err) return console.log('login error: ' + err.message);
        
        
        //Användaren
        console.log('user: '); console.log(user);


    }).on('error', function (err) {
        console.log('background error: ' + err.message);
    });
    
    
    
    
    //HÄR hämtas alla devices - i en array
    cloud.getDevices(function (err, devices) {
        
        //Skriver ut arrayrn i konsolen
        console.log(devices);
      
  

    }).on('error', function (err) {
        console.log('background error: ' + err.message);
    });
    
    
    
    
    
    
    
    

  callback(null, "not yet implemented");
};

exports.getUser = function(req, callback){

    callback(null, "not yet implemented");

};