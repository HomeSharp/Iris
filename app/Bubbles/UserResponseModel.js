exports.UserResponseModel = function(brand,email,time_exec,time_server){
  this.status = 200;
  this.body = {
    brand   : brand,
    email   : email

  };
  this.time_exec= time_exec;
  this.time_server= time_server;

  this.makeJSON = function(){
    return JSON.stringify(this)
  }
}