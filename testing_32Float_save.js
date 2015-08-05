var fs = require('fs');
var wstream = fs.createWriteStream('data.dat');

var data = new Float32Array([1.1,2.2,3.3,4.4,5.5]);

//prepare the length of the buffer to 4 bytes per float
var buffer = new Buffer(data.length*4);


for(var i = 0; i < data.length; i++){
    //write the float in Little-Endian and move the offset
    buffer.writeFloatLE(data[i], i*4);
}

wstream.write(buffer);
wstream.end();