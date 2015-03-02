"use strict";

var superagent = require('superagent');
var expect = require('expect.js');

describe('Iris netatmo GET User', function(){
  // Change this access token to a valid one before running the tests
  var access = '54dc81f3207759349fe610c5|448ffb500aed41cbd299e36abebaf88d';
  var brand = "Netatmo";

    it('no access to user with NO TOKEN', function(done){
    superagent.get('http://localhost:3000/api/User')
      .set('brand', brand)
      .end(function(e, res){
        expect(e).to.not.be.ok();
        expect(res.status).to.equal(400);
        done()
      })
  })

  it('no access to user with BAD TOKEN', function(done){
    superagent.get('http://localhost:3000/api/User')
      .set('access_token', "123")
      .set('brand', brand)
      .end(function(e, res){
        expect(e).to.not.be.ok();
        expect(res.status).to.equal(401);
        done()
      })
  })

  it('no access to user NO BRAND', function(done){
    superagent.get('http://localhost:3000/api/User')
      .set('access_token', access)
      .end(function(e, res){
        expect(e).to.not.be.ok();
        expect(res.status).to.equal(400);
        done()
      })
  })

  it('no access to user with BAD BRAND', function(done){
    superagent.get('http://localhost:3000/api/User')
      .set('access_token', access)
      .set('brand', 'brand')
      .end(function(e, res){
        expect(e).to.not.be.ok()
        expect(res.status).to.equal(400)
        done()
      })
  })

  it('gets user with CORRECT HEADERS', function(done){
    superagent.get('http://localhost:3000/api/User')
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