// Load the fs (filesystem) module.
var fs = require('fs');

var pathToFile = 'colah_data.txt';

var bufferString

// reads the file
function counter(callback) {
  fs.readFile(pathToFile, function (err, data) {
    bufferString = data.toString();
    callback();
  });
}

function print_input() {
  console.log(bufferString);
}

// gets around the callback issue
counter(print_input);