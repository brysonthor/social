var path = require('path'),
    projectPath = path.resolve(__dirname, '../'),
    masterConf = require(path.join(projectPath, 'node_modules/frontier-build-tools/test/fskarma10-config'));


module.exports = function(config) {
  masterConf(config, {
    browsers: ["PhantomJS"],
    projectPath: projectPath,
    testFiles: [
      'node_modules/theme-engage/vendor/underscore-1.3.3/js/modules/underscore.js',
      'node_modules/theme-engage/vendor/angularjs/js/angular-1.2.16/angular.js',
      'node_modules/theme-engage/vendor/angularjs/js/angular-1.2.16/angular-mocks.js',
      'node_modules/theme-engage/vendor/angularjs/js/angular-1.2.16/angular-sanitize.js',
      'node_modules/theme-engage/vendor/bootstrap/js/bootstrap.js',
      'node_modules/expect.js/expect.js',
      'node_modules/sinon/lib/sinon.js',
      'node_modules/sinon/lib/sinon/spy.js',
      'node_modules/sinon/lib/sinon/stub.js',
      'node_modules/sinon/lib/sinon/mock.js',
      'node_modules/sinon/lib/sinon/collection.js',
      'node_modules/sinon/lib/sinon/assert.js',
      'node_modules/sinon/lib/sinon/sandbox.js',
      'node_modules/sinon/lib/sinon/test.js',
      'node_modules/sinon/lib/sinon/test_case.js',
      'node_modules/sinon/lib/sinon/assert.js',
      'node_modules/sinon/lib/sinon/test_case.js',
      'node_modules/sinon/lib/sinon/match.js',
      'assets/js/modules/*.js',
      'assets/js/modules/**/assembly.json',

      'assets/js/modules/**/test/*Test.js',
      'assets/js/angular/**/test/*Test.js',
      'client/*test.js'
    ]
  });
};