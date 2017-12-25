'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const genHash = require('./app/url/generateHash');

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
    sinon.stub(genHash, 'getRefTime').callsFake(() => 1511111111);
    let timenow = sinon.stub(Date, 'now').callsFake(() => 1511111112);
    expect(genHash.generateHash()).to.be.equal('baaaaa');

    // the max value for any particular position can restart to initial value ('0')
    //  once it reaches its last value ('Z')
    refHash.restore();
    sinon.stub(genHash, 'getRefHash').callsFake(() => 'Zaaaaa');
    expect(genHash.generateHash()).to.be.equal('0aaaaa');
  });

});
