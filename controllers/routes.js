// Module dependencies
var mongoose = require ("mongoose");
var serviceAccount = require('fs-service-account');
var FirebaseTokenGenerator = require("firebase-token-generator");

// Mongo Schemas
var friendSchema = new mongoose.Schema({ user_id: String, name: String, person_id: String, tree_user_id: String, friends: [{display_name: String, user_id: String, portrait: String, email: String, person_id: String, tree_user_id: String }]});
var Friend = mongoose.model('friends', friendSchema);
var inviteSchema = new mongoose.Schema({ user_id: String, display_name: String, friend_email: String, inviter_email: String, portrait: String, person_id: String, tree_user_id: String });
var Invite = mongoose.model('invites', inviteSchema);
var shareSchema = new mongoose.Schema({ user_id: String, people: [{id: Number, name: String, portrait: String }]});
var Share = mongoose.model('share', shareSchema);

var baseUrl = process.env.BASE_URL;

// Connect to DB
mongoose.connect(process.env.MONGOLAB_URI, function (err, res) {
  if (err) { console.error ('DB ERROR: '+err); }
  else { console.log ('DB connected: '+process.env.MONGOLAB_URI); }
});

module.exports = function(app) {

  app.get('/:id?', app.restrict(), function(req, res, next) {
    var userId = (req.user.helper) ? req.user.helper.id : req.user.profile.id;
    var helping = (req.user.helper) ? true : false;
    var displayName = (helping) ? req.user.helper.contactName : req.user.profile.displayName;

    // Generate firechat auth token
    var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);
    var token = tokenGenerator.createToken({uid: userId.split('.')[2], name: displayName}, {admin: false, debug: false});

    friendUserId = (req.params.id) ? "cis.user."+req.params.id : userId;
    res.render('index', {
      user: req.user,
      userId: userId,
      friendUserId: friendUserId,
      displayName: displayName,
      newFriendName: req.query.newFriendName,
      firechatToken: token
    });
  });

  // -------
  //   API
  // -------

  // Get friend list
  app.get('/api/get/:id?', function(req, res, next) {
    var userId = (req.params.id) ? req.params.id.split(".")[2] : req.user.profile.id.split(".")[2];
    var friends = mongoose.model('friends', friendSchema);
    friends.find({'user_id': userId}).lean().exec(function (err, rsp) {
      if (rsp.length > 0) {
        res.send({ friendList: rsp[0]}, 200);
      } else {
        res.send({ friendList: []}, 200);
      }
    });
  });

  // Invite a friend: Save invite info. Send email to invitee with the ID of the invite
  app.post('/api/invite', function(req, res, next) {
    // Get personId and treeUserId of current logged in user (inviter)
    req.superagent
      .get(baseUrl+'/platform/users/current?access_token='+req.user.sessionId)
      .set('Accept', 'application/json')
      .end(function(err, response) {
        if (err) return next(err);
        var personId = response.body.users[0].personId;
        var treeUserId = response.body.users[0].treeUserId;

        // Get portrait url of current logged in user
        req.superagent
          .get(baseUrl+'/platform/tree/persons/'+personId+"/portraits")
          .set('Authorization', 'Bearer '+req.user.sessionId)
          .end(function(err, response) {
            if (err) return next(err);
            var portraitUrl = (response.body.sourceDescriptions.length > 0) ? response.body.sourceDescriptions[0].links['image-thumbnail'].href : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

            // Save invite to DB
            var invitObj = {
              user_id: req.user.profile.id,
              display_name: req.user.profile.displayName,
              friend_email: req.body.email,
              inviter_email: req.user.profile.email,
              portrait: portraitUrl,
              person_id: personId,
              tree_user_id: treeUserId
            };
            var invite = new Invite(invitObj);
            invite.save(function (err, rsp) {
              if (err) {
                res.send(err, 400);
              } else {
                // Get a service account sessionId, and post to UMS
                serviceAccount.appLogin(function(err, sessionId) {
                  console.log(sessionId);
                  if (err) {
                    console.log("SERVICE ACCOUNT LOGIN FAILED",err)
                    return res.send(err, sessionId);
                  }
                  var acceptUrl = baseUrl+"/friends/api/accept?id="+rsp._id;
                  var snippet = {
                    type: "friend_invite",
                    version: "1",
                    recipientLocale: "EN",
                    recipientName: " ",
                    recipientEmail: req.body.email,
                    properties: '{ "senderName" : "'+req.user.profile.displayName+'", "acceptUrl" : "'+acceptUrl+'" }'
                  };
                  req.superagent
                    .post(baseUrl+"/fst/user-messaging/api/snippets")
                    .set('Authorization', 'Bearer '+sessionId)
                    .send(snippet)
                    .end(function(err, response) {
                      if (err) console.log(err)
                      else console.log(response.body);
                    });
                });

                res.send(rsp, 200);
              }
            });
          });
      });
  });

  // Accept a friend request
  app.get('/api/accept', app.restrict(), function(req, res, next) {
    // Return error if no id query param
    if (typeof req.query.id == "undefined") return res.send({"error": "Missing id query parameter"}, 300);

    var userId = req.user.profile.id.split(".")[2];

    Invite.find({'_id': req.query.id}).lean().exec(function (err, rsp) {
      if (err) {
        return res.send(err, 400);
      } else {
        if (rsp.length != 1) return res.send({error: "Invalid id"}, 300);
        // Get Tree ID of current logged in user
        req.superagent
          .get(baseUrl+'/platform/users/current?access_token='+req.user.sessionId)
          // .set('Authorization', 'Bearer '+req.user.sessionId)
          .end(function(err, response) {
            if (err) return next(err);
            var personId = response.body.users[0].personId;
            var treeUserId = response.body.users[0].treeUserId;

            // Get portrait url of current logged in user
            req.superagent
              .get(baseUrl+'/platform/tree/persons/'+personId+"/portraits")
              .set('Authorization', 'Bearer '+req.user.sessionId)
              .end(function(err, response) {
                if (err) return next(err);
                var portraitUrl = (response.body.sourceDescriptions.length > 0) ? response.body.sourceDescriptions[0].links['image-thumbnail'].href : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

                // Add friend: Get current list of freinds (to add this friend to)
                var friendObj = { display_name: rsp[0].display_name, user_id: rsp[0].user_id, portrait: rsp[0].portrait, email: rsp[0].inviter_email, person_id: rsp[0].person_id, tree_user_id: rsp[0].tree_user_id };
                Friend.findOne({'user_id': userId}, function (err, doc) {
                  // If first time user create new friend list, else add invitee to existing friendlist
                  if (doc == null) {
                    friends = { user_id: userId, name: req.user.profile.displayName, person_id: personId, tree_user_id: treeUserId, friends: []};
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
                  var friendObj2 = { display_name: req.user.profile.displayName, user_id: req.user.profile.id, portrait: portraitUrl, email: req.user.profile.email, person_id: personId, tree_user_id: treeUserId };
                  Friend.findOne({'user_id': rsp[0].user_id.split(".")[2]}, function (err, doc) {
                    // If first time user create new friend list, else add invitee to existing friendlist
                    if (doc == null) {
                      friends = { user_id: rsp[0].user_id.split(".")[2], name: rsp[0].display_name, person_id: rsp[0].person_id, tree_user_id: rsp[0].tree_user_id, friends: []};
                      friends.friends.push(friendObj2);
                      var friends = new Friend(friends);
                      friends.save(function(err, rsp) {
                        if (err) res.send(err, 400);
                      });
                    } else {
                      doc.friends.push(friendObj2);
                      doc.save();
                    }
                  });

                  // Delete invite request
                  Invite.find({'_id': req.query.id}).remove().exec();

                  // Take user to new friend's page
                  return res.redirect(req.resolvePath('/'+rsp[0].user_id.split(".")[2]+'?newFriendName='+rsp[0].display_name));
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

  // Get pending invites
  app.get('/api/invite', function(req, res, next) {
    var invites = mongoose.model('invites', inviteSchema);
    invites.find({'user_id': req.user.profile.id}).lean().exec(function (err, rsp) {
      if (rsp.length > 0) {
        res.send({ invites: rsp}, 200);
      } else {
        res.send({ invites: []}, 200);
      }
    });
  });

  // Get shared people
  app.get('/api/share/:id?', function(req, res, next) {
    var userId = (req.params.id) ? req.params.id.split(".")[2] : req.user.profile.id.split(".")[2];
    var share = mongoose.model('share', shareSchema);
    share.find({'user_id': userId}).lean().exec(function (err, rsp) {
      if (rsp.length > 0) {
        res.send({ sharedPeople: rsp[0].people}, 200);
      } else {
        res.send({ sharedPeople: []}, 200);
      }
    });
  });

  // Save shared People
  app.post('/api/share', function(req, res, next) {
    var userId = req.user.profile.id.split(".")[2];
    var share = mongoose.model('share', shareSchema);
    share.findOne({'user_id': userId}, function (err, rsp) {
      if (rsp == null) {
        var shareObj = { user_id: userId, people: req.body.people };
        var share = new Share(shareObj);
        share.save(function(err, rsp) {
          if (err) res.send(err, 400);
          if (!err) res.send(rsp, 200);
        });
      } else {
        rsp.people = req.body.people;
        rsp.save();
        res.send(200);
      }
    });
  });

  // Get user activity feed
  app.get('/api/activity/:id?', function(req, res, next) {
    var userId = req.params.id;
    
    // Get a service account sessionId, and post to UMS
    serviceAccount.appLogin(function(err, sessionId) {
      if (err) {
        console.log("SERVICE ACCOUNT LOGIN FAILED",err)
        return res.send(err, sessionId);
      }
      var url = baseUrl+'/ct/admin/changes/contributor/'+userId;
      console.log(url,sessionId);
      req.superagent
        .get(url)
        .set('Authorization', 'Bearer '+sessionId)
        .end(function(err, rsp) {
          if (rsp.statusCode != 200) {
            console.log(rsp.body);
            console.log(rsp.error);
            res.send(err, rsp.statusCode);
          } else {
            res.send(rsp.body, rsp.statusCode);
          }
        });
    });
  });

  app.use(errorHandler);

};

//*****************************************************************
// Private helper functions
function errorHandler(err, req, res, next) {
  if (res.statusCode > 499) {
    res.json({status:res.statusCode, err: err});
  }
  else {
    next(err);
  }
}
