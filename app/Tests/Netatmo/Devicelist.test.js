"use strict";

var superagent = require('superagent');
var expect = require('expect.js');

describe('Iris netatmo GET devicelist', function(){
  // Change this access token to a valid one before running the tests
  var access = '52d40bac1877595a67f62431|33c5b44b904dfde7c18022bb1b5c9341';
  var brand = "Netatmo";

    it('no access to devicelist with NO TOKEN', function(done){
    superagent.get('http://localhost:3000/api/User/Devices')
      .set('brand', brand)
      .end(function(e, res){
        expect(e).to.not.be.ok();
        expect(res.status).to.equal(400);
        done()
      })
  })

  it('no access to devicelist with BAD TOKEN', function(done){
    superagent.get('http://localhost:3000/api/User/Devices')
      .set('access_token', "123")
      .set('brand', brand)
      .end(function(e, res){
        expect(e).to.not.be.ok();
        expect(res.status).to.equal(401);
        done()
      })
  })

  it('no access to devicelist NO BRAND', function(done){
    superagent.get('http://localhost:3000/api/User/Devices')
      .set('access_token', access)
      .end(function(e, res){
        expect(e).to.not.be.ok();
        expect(res.status).to.equal(400);
        done()
      })
  })

  it('no access to devicelist with BAD BRAND', function(done){
    superagent.get('http://localhost:3000/api/User/Devices')
      .set('access_token', access)
      .set('brand', 'brand')
      .end(function(e, res){
        expect(e).to.not.be.ok()
        expect(res.status).to.equal(400)
        done()
      })
  })

  it('retrieves devicelist with CORRECT HEADERS', function(done){
    superagent.get('http://localhost:3000/api/User/Devices')
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
