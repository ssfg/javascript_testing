/* Tests */

var sMyInput = "Base 64 \u2014 Mozilla Developer Network";

var aMyUTF8Input = strToUTF8Arr(sMyInput);

var sMyBase64 = base64EncArr(aMyUTF8Input);

alert(sMyBase64);

var aMyUTF8Output = base64DecToArr(sMyBase64);

var sMyOutput = UTF8ArrToStr(aMyUTF8Output);

alert(sMyOutput);