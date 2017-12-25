'use strict';

const utils = require("./utils"),
      // numbersRange is the following array ["0", "1", "2", "3" ... "9"]
      numbersRange = Array.from(Array(10).keys()).map(c => String(c)),
      lowercaseRange = utils.range('a','z'),
      uppercaseRange = utils.range('A', 'Z'),
      chars = [].concat.apply([], [numbersRange, lowercaseRange, uppercaseRange]),
      refTimestamp = 1514143962,
      refHash = "G1sSnV";

const obj = {
  getRefTime: () => refTimestamp,
  getRefHash: () => refHash,
/**
 * Generate an unique hash-ish- for an URL.
 * @param none
 * @returns {string} hash
 */
  generateHash: function() {
    // timenow is the number of seconds since January 1, 1970 at 00:00:00 GMT 
    const timenow = parseInt(String(Date.now()).slice(0,10),10);
    const diff = timenow - this.getRefTime();
    let numbersArray = this.convertHashToNumberArr(this.getRefHash());
    let carry = 0;
    for(let i=0; i < diff; i++){
      let index = i % 6;
      if( (numbersArray[index] + 1 + carry) >= 62){
        numbersArray[index] = 0;
        carry = 1;
      } else {
        numbersArray[index] += (1 + carry);
        carry = 0;
      }
    } 
    return this.convertNumberArrToHash(numbersArray);
  },
  convertHashToNumberArr: function(hash){
    let numbersArray = [];
    hash.split("").forEach(function(c){
      numbersArray.push(chars.findIndex(el => c === el))
    });
    return numbersArray;
  },
  convertNumberArrToHash: function(arr){
    let hash = [];
    arr.forEach(function(n){
      hash.push(chars[n]);
    });
    return hash.join("");
  }
};


module.exports = obj;
