'use strict';

function range(first, last) {
    let a = first.charCodeAt(0)
    let b = last.charCodeAt(0) + 1
    return Array.apply(null, {length: Math.abs(b - a)})
      .map(function (x,i) { return String.fromCharCode(Math.min(a, b) + i) });
}

module.exports = {
  range,
}
