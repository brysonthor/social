// Module dependencies
var woodruff = require("woodruff")
  , shared = require("theme-engage");

// Expose the app
var app = module.exports = woodruff(__dirname, shared, {proxyUser: true});

app.configure('development', function() {
  var proxy = require("simple-http-proxy");
  app.stack.unshift({ route: "/tree-data", handle: proxy("https://beta.familysearch.org/tree-data") });
  app.stack.unshift({ route: "/artifactmanager", handle: proxy("https://beta.familysearch.org/artifactmanager") });
});