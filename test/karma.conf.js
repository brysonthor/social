var path = require('path'),
    projectPath = path.resolve(__dirname, '../'),
    masterConf = require(path.join(projectPath, 'node_modules/frontier-build-tools/test/fskarma10-config'));


module.exports = function(config) {
  masterConf(config, {
    browsers: ["PhantomJS"],
    browserNoActivityTimeout: 20000,
    logLevel: config.LOG_INFO,
    projectPath: projectPath,
    testFiles: [
      'assets/js/angular.min.js',
      'assets/js/angular-mocks.js',
      'assets/js/angular-sanitize.js',
      // 'node_modules/theme-engage/vendor/jquery-2.1.1/js/jquery-2.1.1.js',
      // 'vendor/bootstrap/js/bootstrap.js',
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
      
      {pattern: 'assets/js/**/test/*Test.js', watched: true, included: true, served: true}
    ]
  });
};