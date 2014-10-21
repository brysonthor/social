// Module dependencies
var mongoose = require ("mongoose")
  , env = require('envs');

// Mongo Schemas
var friendSchema = new mongoose.Schema({ user_id: String, friends: [{display_name: String, user_id: String, portrait: String, email: String }]});
var Friend = mongoose.model('friends', friendSchema);
var inviteSchema = new mongoose.Schema({ user_id: String, display_name: String, friend_email: String, inviter_email: String, portrait: String });
var Invite = mongoose.model('invites', inviteSchema);

var baseUrl = env("BASE_URL");

// Connect to DB
mongoose.connect(env("MONGOLAB_URI"), function (err, res) {
  if (err) { console.error ('DB ERROR: '+err); }
  else { console.log ('DB connected: '+env("MONGOLAB_URI")); }
});

module.exports = function(app) {
  app.get('/', app.restrict(), function(req, res, next) {
    // console.log(req.user.profile);
    res.render('index', {user: req.user});
  });

  // -------
  //   API
  // -------

  // Get friend list
  app.get('/api/get', function(req, res, next) {
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
  app.post('/api/invite', function(req, res, next) {
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
              inviter_email: req.user.profile.email,
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
                  text: 'To accept '+req.user.profile.displayName+' as your friend go to the following link https://familysearch.org/friends/api/accept?id='+rsp._id
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

  // Add/Accept a friend
  app.get('/api/accept', app.restrict(), function(req, res, next) {
    // Return error if now id query param
    if (typeof req.query.id == "undefined") return res.send({"error": "Missing id query parameter"}, 300);

    var userId = req.user.profile.id.split(".")[2];

    Invite.find({'_id': req.query.id}).lean().exec(function (err, rsp) {
      if (err) {
        return res.send(err, 400);
      } else {
        if (rsp.length != 1) return res.send({error: "Invalid id"}, 300);
        // Get Tree ID of current logged in user
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
                var friendObj = { display_name: rsp[0].display_name, user_id: rsp[0].user_id, portrait: rsp[0].portrait, email: rsp[0].inviter_email };
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
                  var friendObj2 = { display_name: req.user.profile.displayName, user_id: req.user.profile.id, portrait: portraitUrl, email: req.user.profile.email };
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
  app.delete('/api/remove/:id', app.restrict(), function(req, res, next) {
    var user1 = req.user.profile.id.split(".")[2];
    var user2 = req.params.id.split(".")[2];

    // Remove from initiator's friend list
    Friend.findOne({'user_id': user1}, function (err, doc) {
      if (err) return res.send({ error: err}, 300);
      for (var i=0; i<=doc.friends.length; i++) {
        if (typeof doc.friends[i] != "undefined") {
          if (doc.friends[i].user_id == "cis.user."+user2) doc.friends.splice(i,1);
        }
      }
      doc.save();
    });

    // Remove from friend of initiators friend list
    Friend.findOne({'user_id': user2}, function (err, doc) {
      if (err) return res.send({ error: err}, 300);
      for (var i=0; i<=doc.friends.length; i++) {
        if (typeof doc.friends[i] != "undefined") {
          if (doc.friends[i].user_id == "cis.user."+user1) doc.friends.splice(i,1);
        }
      }
      doc.save();
    });
    return res.send(204);
  });


};