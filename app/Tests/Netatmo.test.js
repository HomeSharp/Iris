var superagent = require('superagent')
var expect = require('expect.js')

describe('Iris netatmo funktionality', function(){
  var access = '54dc81f3207759349fe610c5|96cd67255b3f7b4134987e000c0769ba';
  var brand = "Netatmo";

  it('no access to devicelist without token', function(done){
    superagent.get('http://localhost:3000/api/User/Devices')
      .set('brand', brand)
      .end(function(e, res){
        expect(e).to.not.be.ok()
        expect(res.status).to.equal(400)
        done()
      })
  })

  it('no access to devicelist with invalid token', function(done){
    superagent.get('http://localhost:3000/api/User/Devices')
      .set('access_token', "123")
      .set('brand', brand)
      .end(function(e, res){
        expect(e).to.not.be.ok()
        expect(res.status).to.equal(401)
        done()
      })
  })

  it('no access to devicelist without brand', function(done){
    superagent.get('http://localhost:3000/api/User/Devices')
      .set('access_token', access)
      .end(function(e, res){
        expect(e).to.not.be.ok()
        expect(res.status).to.equal(400)
        done()
      })
  })

  it('no access to devicelist with invalid brand', function(done){
    superagent.get('http://localhost:3000/api/User/Devices')
      .set('access_token', access)
      .set('brand', 'brand')
      .end(function(e, res){
        expect(e).to.not.be.ok()
        expect(res.status).to.equal(400)
        done()
      })
  })

  it('retrieves devicelist', function(done){
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
