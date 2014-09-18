// Module dependencies
var mongoose = require ("mongoose")
  , env = require('envs');

// Mongo Schemas
var friendSchema = new mongoose.Schema({ user_id: String, friends: [{display_name: String, user_id: String}]});
var Friend = mongoose.model('friends', friendSchema);
var inviteSchema = new mongoose.Schema({ user_id: String, display_name: String, friend_email: String});
var Invite = mongoose.model('invites', inviteSchema);


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
        res.send(err, 400);
      }
    });

  });

  // Invite a friend
  app.post('/api/friends/invite', function(req, res, next) {
    // Save transaction
    var invitObj = { user_id: req.user.profile.id, display_name: req.user.profile.displayName, friend_email: req.body.email };
    var invite = new Invite(invitObj);
    invite.save(function (err, rsp) {
      if (err) {
        res.send(err, 400);
      } else {
        console.log(rsp._id);
        // email potential friend
        var sendgrid = require('sendgrid')(env('SENDGRID_USERNAME'), env('SENDGRID_PASSWORD'));
        var payload = {
          to: req.body.email,
          from: req.user.profile.email,
          subject: 'FamilySearch Friend Request from '+req.user.profile.displayName,
          text: 'To accept '+req.user.profile.displayName+' as your friend click <a href="https://familysearch.org/social/api/friends/accept?id='+rsp._id+'">here<a/>'
        }
        sendgrid.send(payload, function(err, json) {
          if (err) { console.error(err); }
          console.log(json);
        });

        res.send(rsp, 200);
      }
    });
  });

  // Add a friend
  app.get('/api/friends/accept', function(req, res, next) {
    var userId = req.user.profile.id.split(".")[2];
    Invite.find({'_id': req.query.id}).lean().exec(function (err, rsp) {
      if (err) {
        res.send(err, 400);
      } else {
        // Get current list of freinds (to add this friend to)
        var friendObj = { display_name: rsp[0].display_name, user_id: rsp[0].user_id };
        Friend.findOne({'user_id': userId}, function (err, doc) {
          console.log(doc);
          doc.friends.push(friendObj);
          doc.save();
          res.send(doc, 200);

          // Delete invite request
          Invite.find({'_id': req.query.id}).remove().exec();
        });
      }
    });
  });


};
