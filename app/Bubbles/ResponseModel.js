var ResponseModel = function(deviceId, mainDevice, deviceType, moduleName, messuresArr, time_exec, time_server){
  this.status = 200;
  this.body = {
    devices : [
      {
        deviceId: deviceId,
        mainDevice: mainDevice,
        deviceType: deviceType,
        moduleName: moduleName,

        meassures: messuresArr  //An array (always array..) with MeasureModel objects.
      }
    ]
  };
  this.time_exec= time_exec;     //
  this.time_server= time_server; //

  this.makeJSON = function(){
    return JSON.stringify(this)

  }

};

module.exports = ResponseModel;