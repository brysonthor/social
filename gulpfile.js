var gulp = require('gulp');

// your gulp tasks here






// create a shared registry between the master gulpfile and your gulpfile
var configure = require('./node_modules/frontier-build-tools/plugins/configure-registry.js');
gulp.registry(configure({

}));

// register the master gulpfile with gulp. This MUST be declared after all your gulp tasks
// to be able to run multiple gulp tasks of the same name
var HubRegistry = require('gulp-hub');
var hub = new HubRegistry(['./node_modules/frontier-build-tools/gulpfile.js']);
gulp.registry(hub);
