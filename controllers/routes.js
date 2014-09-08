module.exports = function(app) {
  app.get('/', function(req, res) { res.render('index') });

  // Get friend list
  app.get('/api/friends', function(req, res) {
    res.send({ friends: ['a','b','c']}, 200);
  });

  // Add a friend
  app.post('/api/friends/invite', function(req, res) {

    res.send({id: 'zyx'}, 200);
  });

  // Add a friend
  app.post('/api/friends/accept', function(req, res) {

    res.send({id: 'zyx'}, 200);
  });

};
