// Module dependencies
var woodruff = require("woodruff");
var env = require('envs');
var themeEngage = require("theme-engage");

// Expose the app
var app = module.exports = woodruff(__dirname, themeEngage, {
	proxyUser: true,
	session: process.env.SESSION_SECRET || 'ReallyIntricateSecretForLocalDevUseOnly1337'
});

// localhost proxies
app.configure('development', function() {
  var proxy = require("simple-http-proxy");
  var baseUrl = env("BASE_URL");
  app.stack.unshift({ route: "/artifactmanager", handle: proxy(baseUrl + "/artifactmanager") });
  app.stack.unshift({ route: "/platform", handle: proxy(baseUrl + "/platform")});
  app.stack.unshift({ route: "/tree-data", handle: proxy(baseUrl + "/tree-data")});
  app.stack.unshift({ route: "/ip", handle: proxy(baseUrl + "/ip/")});
  app.stack.unshift({ route: "/assignment-service", handle: proxy(baseUrl + "/assignment-service/")});

  app.get("/hj", function(req, res) {
    res.cookie("fssessionid", req.query.id);
    res.redirect("/");
  });

});