MeasureModel = function(type, value, unit){
  this.type  = type;      //Could be(example): Temperature, Humidity, C02 or other
  this.value = value;     //Should be in number form (not string)
  this.unit  = unit; //Unit = celcius or other?
};

module.exports = MeasureModel;