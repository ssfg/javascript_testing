// "use strict";

/* Array of bytes to base64 string decoding */

// from Mozilla

   var b64ToUint6 = function (nChr) {

    return nChr > 64 && nChr < 91 ?
        nChr - 65
      : nChr > 96 && nChr < 123 ?
        nChr - 71
      : nChr > 47 && nChr < 58 ?
        nChr + 4
      : nChr === 43 ?
        62
      : nChr === 47 ?
        63
      :
        0;
  }

  var base64DecToArr = function (sBase64, nBlocksSize) {

    var
      sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
      nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

    for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
      nMod4 = nInIdx & 3;
      nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
      if (nMod4 === 3 || nInLen - nInIdx === 1) {
        for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
          taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
        }
        nUint24 = 0;

      }
    }

    return taBytes;
  }

  convertData = function (callback) {

      // Load the fs (filesystem) module.
      var fs = require('fs');
      // Read the contents of the file into memory.

      // Read the string data.
      fs.readFile('colah_data.txt', function (err, logData) {
      // If an error occurred, throwing it will
      // display the exception and kill our app.
      if (err) throw err;
      // logData is a Buffer, convert to string.
      var input_buffer = logData;
      var input_string = logData.toString();
      var input_len = input_string.length

      // now return the data
      var data = new Float32Array( base64DecToArr(input_string).buffer );

      // var mnist_ys = new Float32Array( base64DecToArr().buffer );

      callback(data);
      });

  }

module.exports = {
  b64ToUint6: b64ToUint6,
  base64DecToArr: base64DecToArr,
  convertData: convertData
};

