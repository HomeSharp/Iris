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

  this.toJSON = function(){
    return
      "{" +
      "status:" + this.status + "," +
      "body:" + this.body.toJSON() + "," +
      "time_exec:" + time_exec + "," +
      "time_server:" + time_server + "," +
      "}";
  }

};

var MesureModel = function(type, value, unit){
  this.type  = type;      //Could be(example): Temperature, Humidity, C02 or other
  this.value = value;     //Should be in number form (not string)
  this.unit  = unit; //Unit = celcius or other?
};