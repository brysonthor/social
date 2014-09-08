// console.log('main-test.js in file');
var tests = Object.keys(window.__karma__.files).filter(function (file) {
  var result = (/\-test\.js$/).test(file);
  //console.log("Testing file", file, result);
  return result;
});

require({
  // Karma serves files from '/base'
  baseUrl: '/base',
  paths: {
    require: '../lib/require',
    text: '../lib/text'
  },
  // ask requirejs to load these files (all our tests)
  deps: tests,
  // start test run, once requirejs is done
  callback: window.__karma__.start
});

testDefine = define;
