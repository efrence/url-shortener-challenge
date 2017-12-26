'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const genHash = require('./app/url/generateHash');
require('dotenv').config()
const app = require('./app');
const db = require('./server/mongodb');

// Avoid messing around with other dbs
if(db.name !== process.env.MONGO_DB_NAME_TEST){
  process.exit(1);
}
/*
/   Unit Tests
*/
describe('generateHash', function(){
  it('should generate 6 character long strings', function(){
    expect(genHash.generateHash()).to.be.satisfy(is6CharacterLongString);

    function is6CharacterLongString(string){
      return (string.length === 6 && typeof string === 'string');
    }
  });

  it('should generate hash based on inital hash', function(){
    let spy = sinon.spy(genHash, 'convertHashToNumberArr');
    let initialHash = 'G1sSnV';
    genHash.generateHash();
    spy.restore();
    sinon.assert.calledOnce(spy);
    expect(spy.calledWith(initialHash)).to.be.true;
  });

  it('should generate hash based on current timestamp', function(){
    // this is expected behaviour, invoking generateHash twice
    // during one second should return the same hash
    expect(genHash.generateHash()).to.be.equal(genHash.generateHash());
  }); 

  it('should generate hash based on initial hash, initial timestamp and current timestamp', function(){ 
    let refHash = sinon.stub(genHash, 'getRefHash').callsFake(() => 'aaaaaa');
    let refTime = sinon.stub(genHash, 'getRefTime').callsFake(() => 1511111111);
    let timenow = sinon.stub(Date, 'now').callsFake(() => 1511111112);
    expect(genHash.generateHash()).to.be.equal('baaaaa');

    // the max value for any particular position can restart to initial value ('0')
    //  once it reaches its last value ('Z')
    refHash.restore();
    sinon.stub(genHash, 'getRefHash').callsFake(() => 'Zaaaaa');
    expect(genHash.generateHash()).to.be.equal('0aaaaa');
    refHash.restore();
    refTime.restore();
    timenow.restore();
  });

});

/*
/  Integration Tests
*/

describe('Post /', function(){
  beforeEach(function(){
    db.collections.urls.remove();  
  });  
  it('respond with json', function(done){
    request(app)
      .post('/')
      .send({url: 'http://test.com'})
      .set('Accept', 'json')
      .then((res) => {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });

  it('respond with json the first time then with error',  function(done){
    request(app)
      .post('/')
      .send({url: 'http://test.com'})
      .set('Accept', 'json')
      .then((res) => {
        expect(res.statusCode).to.be.equal(200);
        request(app) 
         .post('/')
         .send({url: 'http://test.com'})
         .set('Accept', 'json')
         .then((res2) => {
            expect(res2.statusCode).to.be.equal(500);
            done();
          });
      });
    
  });
});


describe('Get /:hash', function(){
  before(function(){
    db.collections.urls.remove();  
  });  
  var urlhash = null;
  it('create basic url', function(done){ 
    let url = 'http://test.com';
    request(app)
      .post('/')
      .send({url: url})
      .set('Accept', 'json')
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        urlhash = res.body.hash;
        done();
      });
  });

  it('response with json when header Accept json is set', function(done){
    this.timeout(3000);
    setTimeout(function(){
    request(app)
      .get(`/${urlhash}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body.hash).to.be.equal(urlhash)
        done();
      });
    }, 1000);
  });
});

