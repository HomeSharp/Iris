"use strict";

var superagent = require('superagent');
var expect = require('expect.js');

describe('Iris netatmo GET rainGauge - need valid deviceId and moduleId for all tests to be valid', function(){
  // Change this access token to a valid one before running the tests
  var access = '54d0b5084b5a8854134495fa|2bced79e736b978e651b788cce0c1d79';
  var brand = "Netatmo";
  var deviceId = "70:ee:50:01:ed:f0";
  var moduleId = "05:00:00:00:5e:e8";

  it('no access to rainGauge with NO TOKEN', function(done){
    superagent.get('http://localhost:3000/api/Device/RainGauge?deviceId=' + deviceId + '&moduleId=' + moduleId)
      .set('brand', brand)
      .end(function(e, res){
        expect(e).to.not.be.ok();
        expect(res.status).to.equal(400);
        done()
      })
  })

  // Need valid deviceId and moduleId to test this properly
  it('no access to rainGauge with BAD TOKEN', function(done){
    superagent.get('http://localhost:3000/api/Device/RainGauge?deviceId=' + deviceId + '&moduleId=' + moduleId)
      .set('access_token', "123")
      .set('brand', brand)
      .end(function(e, res){
        expect(e).to.not.be.ok();
        expect(res.status).to.equal(401);
        done()
      })
  })

  it('no access to rainGauge NO BRAND', function(done){
    superagent.get('http://localhost:3000/api/Device/RainGauge?deviceId=' + deviceId + '&moduleId=' + moduleId)
      .set('access_token', access)
      .end(function(e, res){
        expect(e).to.not.be.ok();
        expect(res.status).to.equal(400);
        done()
      })
  })

  it('no access to rainGauge with BAD BRAND', function(done){
    superagent.get('http://localhost:3000/api/Device/RainGauge?deviceId=' + deviceId + '&moduleId=' + moduleId)
      .set('access_token', access)
      .set('brand', 'brand')
      .end(function(e, res){
        expect(e).to.not.be.ok()
        expect(res.status).to.equal(400)
        done()
      })
  })

  // Need valid deviceId and moduleId to test this properly
  it('retrieves rainGauge with CORRECT HEADERS and QUERY PARAMS', function(done){
    superagent.get('http://localhost:3000/api/Device/RainGauge?deviceId=' + deviceId + '&moduleId=' + moduleId)
      .set('access_token', access)
      .set('brand', brand)
      .end(function(e, res){
        expect(e).to.eql(null)
        expect(res).to.exist
        expect(res.status).to.equal(200)
        done()
      })
  })
})
