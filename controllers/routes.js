// Module dependencies
var mongoose = require ("mongoose")
  , env = require('envs');

// Mongo Schemas
var friendSchema = new mongoose.Schema({ user_id: String, friends: [{display_name: String, user_id: String, portrait: String }]});
var Friend = mongoose.model('friends', friendSchema);
var inviteSchema = new mongoose.Schema({ user_id: String, display_name: String, friend_email: String, portrait: String });
var Invite = mongoose.model('invites', inviteSchema);

var baseUrl = env("BASE_URL");

// Connect to DB
mongoose.connect(env("MONGOLAB_URI"), function (err, res) {
  if (err) { console.error ('DB ERROR: '+err); }
  else { console.log ('DB connected: '+env("MONGOLAB_URI")); }
});

module.exports = function(app) {
  app.get('/', app.restrict(), function(req, res, next) {
    res.render('index', {user: req.user});
  });

  // -------
  //   API
  // -------

  // Get friend list
  app.get('/api/friends', function(req, res, next) {
    var userId = req.user.profile.id.split(".")[2];
    var friends = mongoose.model('friends', friendSchema);
    friends.find({'user_id': userId}).lean().exec(function (err, rsp) {
      if (rsp.length > 0) {
        res.send({ friends: rsp[0].friends}, 200);
      } else {
        res.send({ friends: []}, 200);
      }
    });

  });

  // Invite a friend: Save invite info. Send email to invitee with the ID of the invite
  app.post('/api/friends/invite', function(req, res, next) {
    // Get tree id of current logged in user
    req.superagent
      .get(baseUrl+'/platform/tree/current-person?access_token='+req.user.sessionId)
      .end(function(err, response) {
        if (err) return next(err);
        var personObj = JSON.parse(response.text);

        // Get portrait url of current logged in user
        req.superagent
          .get(baseUrl+'/platform/tree/persons/'+personObj.persons[0].id+"/portraits")
          .set('Authorization', 'Bearer '+req.user.sessionId)
          .end(function(err, response) {
            if (err) return next(err);
            var portraitObj = JSON.parse(response.text);
            var portraitUrl = (portraitObj.sourceDescriptions.length > 0) ? portraitObj.sourceDescriptions[0].links['image-thumbnail'].href : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

            var invitObj = {
              user_id: req.user.profile.id,
              display_name: req.user.profile.displayName,
              friend_email: req.body.email,
              portrait: portraitUrl
            };
            var invite = new Invite(invitObj);
            invite.save(function (err, rsp) {
              if (err) {
                res.send(err, 400);
              } else {
                // email potential friend
                var sendgrid = require('sendgrid')(env('SENDGRID_USERNAME'), env('SENDGRID_PASSWORD'));
                var payload = {
                  to: req.body.email,
                  from: req.user.profile.email,
                  subject: 'FamilySearch Friend Request from '+req.user.profile.displayName,
                  text: 'To accept '+req.user.profile.displayName+' as your friend click <a href="https://familysearch.org/friends/api/friends/accept?id='+rsp._id+'">here<a/>'
                }
                sendgrid.send(payload, function(err, json) {
                  if (err) { console.error(err); }
                });

                res.send(rsp, 200);
              }
            });
          });
      });
  });

  // Add a friend
  app.get('/api/friends/accept', app.restrict(), function(req, res, next) {
    var userId = req.user.profile.id.split(".")[2];
    Invite.find({'_id': req.query.id}).lean().exec(function (err, rsp) {
      if (err) {
        return res.send(err, 400);
      } else {
        // Get portrait URL of current logged in user
        req.superagent
          .get(baseUrl+'/platform/tree/current-person?access_token='+req.user.sessionId)
          // .set('Authorization', 'Bearer '+req.user.sessionId)
          .end(function(err, response) {
            if (err) return next(err);
            var personObj = JSON.parse(response.text);

            // Get portrait url of current logged in user
            req.superagent
              .get(baseUrl+'/platform/tree/persons/'+personObj.persons[0].id+"/portraits")
              .set('Authorization', 'Bearer '+req.user.sessionId)
              .end(function(err, response) {
                if (err) return next(err);
                var portraitObj = JSON.parse(response.text);
                var portraitUrl = (portraitObj.sourceDescriptions.length > 0) ? portraitObj.sourceDescriptions[0].links['image-thumbnail'].href : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

                // Get current list of freinds (to add this friend to)
                var friendObj = { display_name: rsp[0].display_name, user_id: rsp[0].user_id, portrait: rsp[0].portrait };
                Friend.findOne({'user_id': userId}, function (err, doc) {
                  // If first time user create new friend list, else add invitee to existing friendlist
                  if (doc == null) {
                    friends = { user_id: userId, friends: []};
                    friends.friends.push(friendObj);
                    var friends = new Friend(friends);
                    friends.save(function(err, rsp) {
                      if (err) res.send(err, 400);
                    });
                  } else {
                    doc.friends.push(friendObj);
                    doc.save();
                  }

                  // Add friend to the inviter friend list
                  var friendObj2 = { display_name: req.user.profile.displayName, user_id: req.user.profile.id, portrait: portraitUrl };
                  Friend.findOne({'user_id': rsp[0].user_id.split(".")[2]}, function (err, doc) {
                    doc.friends.push(friendObj2);
                    doc.save();
                  });

                  // Delete invite request
                  Invite.find({'_id': req.query.id}).remove().exec();

                  return res.redirect(req.resolvePath('/'));
                });
              });
          });
      }
    });
  });


  // Remove a friend
  app.get('/api/friends/remove', app.restrict(), function(req, res, next) {
    var user1 = req.user.profile.id.split(".")[2];
    var user2 = req.query.id;

  });


};