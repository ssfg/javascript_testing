// .js
// ======

var fs = require('fs');

// where the base64 -> Float32Array conversion is done
var tools = require('./typed_array_tools');

// function for logging the data
function log(data) {
  console.log(data);
}

// function for saving the data
function saveVector(data) {
  
  var fs = require('fs');
  var log = fs.createWriteStream('mnist_xs.csv', {'flags': 'a'});
  // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file

  var len = data.length;

  for (var i=0; i < (len); i++) {
    try{
      j = i.toString();
      log.write(data[i] + ",");
    }
    catch(err) {
        return console.log(err);
    }
  }

}

// function for saving the data if MNIST digits (784)
function saveMatrix(data) {
  
  var fs = require('fs');
  var log = fs.createWriteStream('mnist_coords.csv', {'flags': 'a'});
  // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file

  var len = data.length;
  var count = 0;
  var last_output = 0;
  var matrix_dim = 784;

  for (var i=0; i < (len); i++) {
    if (count == matrix_dim) {
      log.write("\n");

      change = i - last_output;
      // console.log("itteration: " + i + ", last dim:" + change + "count:" + count);
      last_output = i;
      count = 0;
    }
    try{
      j = i.toString();
      log.write(data[i] + ",");
    }
    catch(err) {
        return console.log(err);
    }
    count++;
  }

}

function saveCoords(data) {

  var fs = require('fs');
  var log = fs.createWriteStream('recreated.csv', {'flags': 'a'});
  // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file

  var len = data.length;
  var count = 0;
  var last_output = 0;
  var matrix_dim = 2;

  for (var i=0; i < (len); i++) {
    if (count == matrix_dim) {
      log.write("\n");
      change = i - last_output;
      console.log("itteration: " + i + ", last dim:" + change + "count:" + count);
      last_output = i;
      count = 0;
    }
    try{
      j = i.toString();
      log.write(data[i] + ",");
    }
    catch(err) {
        return console.log(err);
    }
    count++;
  }

  console.log(len)

}


// var read_from = "./base64_data/mnist_ys.txt";
var read_from = "./save_b64.txt"

// callback function that returns the data using the function in typed_array_tools
var data = tools.convertData(read_from, saveCoords);

// var array = tools.convertBinarytoArray(read_from, log);

// tools.bar();
// tools.zemba();