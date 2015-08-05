// tools.js
// ========

var foo = function () {
  console.log("foo: hello");
}

var bar = function () {
  foo();
}

module.exports = {
  foo: foo,
  bar: bar
};

var zemba = function () {
  console.log("zemba: again")
}
