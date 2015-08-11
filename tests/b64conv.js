
"use strict";

/*\
|*|
|*|  Base64 / binary data / UTF-8 strings utilities
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
|*|
\*/

/* Array of bytes to base64 string decoding */

function b64ToUint6 (nChr) {

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

function base64DecToArr (sBase64, nBlocksSize) {

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

/* Base64 string to array encoding */

function uint6ToB64 (nUint6) {

  return nUint6 < 26 ?
      nUint6 + 65
    : nUint6 < 52 ?
      nUint6 + 71
    : nUint6 < 62 ?
      nUint6 - 4
    : nUint6 === 62 ?
      43
    : nUint6 === 63 ?
      47
    :
      65;

}

function base64EncArr (aBytes) {

  var nMod3 = 2, sB64Enc = "";

  for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
    nMod3 = nIdx % 3;
    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
      sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
      nUint24 = 0;
    }
  }

  return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');

}

/* UTF-8 array to DOMString and vice versa */

function UTF8ArrToStr (aBytes) {

  var sView = "";

  for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx];
    sView += String.fromCharCode(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
        /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
        (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
        (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
        (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
        (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
        (nPart - 192 << 6) + aBytes[++nIdx] - 128
      : /* nPart < 127 ? */ /* one byte */
        nPart
    );
  }

  return sView;

}

function strToUTF8Arr (sDOMStr) {

  var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;

  /* mapping... */

  for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
    nChr = sDOMStr.charCodeAt(nMapIdx);
    nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
  }

  aBytes = new Uint8Array(nArrLen);

  /* transcription... */

  for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
    nChr = sDOMStr.charCodeAt(nChrIdx);
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr;
    } else if (nChr < 0x800) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x10000) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x200000) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x4000000) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else /* if (nChr <= 0x7fffffff) */ {
      /* six bytes */
      aBytes[nIdx++] = 252 + (nChr >>> 30);
      aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    }
  }

  return aBytes;

}


var fs = require('fs');
// Read the contents of the file into memory.

// Read the string data.
fs.readFile("./base64_data/mnist_ys.txt", function (err, logData) {
// If an error occurred, throwing it will
// display the exception and kill our app.
if (err) throw err;
// logData is a Buffer, convert to string.

// this is the one that actually returns something sensible (original data even)
// var data = new Float32Array( base64DecToArr(input_string).buffer );


var input_string = logData.toString();
// var input_len = input_string.length
console.log("string length: " + input_string.length);

var t1 = base64DecToArr(input_string);
console.log("t1: " + t1[3]);
console.log("after bToAr: " + t1.length);

var F1 = new Float32Array (t1.buffer);
console.log("F1: " + F1[4]);
console.log("after F32: " + F1.length);

/*

// Mozilla Example

var sMyInput = "Base 64 \u2014 Mozilla Developer Network";

var aMyUTF8Input = strToUTF8Arr(sMyInput);
console.log(aMyUTF8Input[3]);

var sMyBase64 = base64EncArr(aMyUTF8Input);
console.log(sMyBase64);

var aMyUTF8Output = base64DecToArr(sMyBase64);
console.log(aMyUTF8Output[3]);

var sMyOutput = UTF8ArrToStr(aMyUTF8Output);
console.log(sMyOutput);

// Testing / Messing

var Output = base64DecToArr(input_string);
console.log(Output[3]);
console.log("length Out:");

var Input = base64EncArr(Output);
console.log(Input);

var meta_input = strToUTF8Arr(Input);
console.log(meta_input);
console.log("what the fuck!");

var string = UTF8ArrToStr(Output);
console.log(string);

*/

});

