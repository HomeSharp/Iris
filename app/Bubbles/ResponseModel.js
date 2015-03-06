exports.ResponseModel = function(deviceId, mainDevice, deviceType, moduleName, messuresArr, time_exec, time_server){
  this.status = 200;
  this.body = {
    modules : [ // Should this be devices or modules?
      {
        deviceId: deviceId,
        mainDevice: mainDevice,
        deviceType: deviceType,
        moduleName: moduleName,
        //^the modulename isn't anything that gets returned,
        // (example) a getIndoorModule-request <- How do we solve this? Should the moduleName be sent as a parameter?

        meassures: messuresArr  //a array (always array..) with MeasureModel objects.
      }
    ]
  };
  this.time_exec= time_exec;     //
  this.time_server= time_server; //

  this.makeJSON = function(){
    return JSON.stringify(this)

  }

};

exports.MeasureModel = function(type, value, unit){
  this.type  = type;      //Could be(example): Temperature, Humidity, C02 or other
  this.value = value;     //Should be in number form (not string)
  this.unit  = unit;      //Unit = celcius or other?
};
