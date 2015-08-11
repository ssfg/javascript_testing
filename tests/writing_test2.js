var fs = require('fs');
var log = fs.createWriteStream('log.txt', {'flags': 'a'});
// use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file

for (var i=0; i < 10; i++) {
  try{
    j = i.toString();
    log.write(j + ",");
  }
  catch(err) {
      return console.log(err);
  }
}