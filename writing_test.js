// var fs = require('fs');
// fs.writeFile("./test.txt", "Hey there!", function(err) {
//     if(err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// });
// function save(data) {
    fs = require('fs')
    fs.writeFile('testing', 'abc', function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });
// }
