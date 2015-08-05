// tools.js
// ========
module.exports = {
  foo: function () {
    console.log("foo: hello")
  },
  bar: function () {
    foo();
  }
};

var zemba = function () {
  console.log("zemba: again")
}
