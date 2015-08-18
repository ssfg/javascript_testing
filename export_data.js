
var fs = require('fs');

// where the base64 -> Float32Array conversion is done
var tools = require('./typed_array_tools');
var vars = require('./MNIST-reps');

var data = vars.getData();

var mnist_reps = data[0];
var mnist_reps_rep = data[1];

console.log(mnist_reps_rep[0]);

