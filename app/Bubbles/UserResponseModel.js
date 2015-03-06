exports.UserResponseModel = function(){
  this.status = 200;
  this.body = {
    user_id : userId,
    brand : brand,

  };
  this.time_exec= time_exec;     //
  this.time_server= time_server; //

  this.makeJSON = function(){
    return JSON.stringify(this)

  }

}