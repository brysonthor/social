// Module dependencies
var snow = require("snow");
var hf = require("hf");

// Expose the app
var app = module.exports = snow(__dirname, hf, {
	proxyUser: true,
	session: process.env.SESSION_SECRET || 'ReallyIntricateSecretForLocalDevUseOnly1337'
});

// localhost proxies
if (process.env.TARGET_ENV === 'local'){
  var proxy = require("simple-http-proxy");
  var baseUrl = process.env.BASE_URL;
  app.stack.front(function (){ app.use( "/artifactmanager", proxy(baseUrl + "/artifactmanager"))});
  app.stack.front(function (){ app.use( "/platform", proxy(baseUrl + "/platform"))});
  app.stack.front(function (){ app.use( "/tree-data", proxy(baseUrl + "/tree-data"))});
  app.stack.front(function (){ app.use( "/ip", proxy(baseUrl + "/ip/"))});
  app.stack.front(function (){ app.use( "/assignment-service", proxy(baseUrl + "/assignment-service/"))});
  app.stack.front(function (){ app.use( "/alertservice", proxy(baseUrl + "/alertservice/"))});
  app.stack.front(function (){ app.use( "/ident", proxy(baseUrl + "/ident"))});
  app.stack.front(function (){ app.use( "/cis-public-api", proxy(baseUrl + "/cis-public-api"))});
  app.stack.front(function (){ app.use( "/u2ms", proxy(baseUrl + "/u2ms"))});
  app.stack.front(function (){ app.use( "/ct", proxy(baseUrl + "/ct"))});
  app.stack.front(function (){ app.use( "/oss", proxy(baseUrl + "/oss"))});
  app.stack.front(function (){ app.use( "/indexing-service", proxy(baseUrl + "/indexing-service"))});
  app.stack.front(function (){ app.use( "/fst", proxy(baseUrl + "/fst"))});

  app.get("/hj", function(req, res) {
    res.cookie("fssessionid", req.query.id);
    res.redirect("/");
  });
};