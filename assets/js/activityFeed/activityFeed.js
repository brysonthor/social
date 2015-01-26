angular.module('social').directive('activityFeed', ['activityFeedService', 'friendService', function(activityFeedService, friendService) {
  var styles = FS.File.loadCSS('activityFeed.css');

  return {
    restrict: 'A',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      // Get cached activity feed from localstorage
      var cachedFeed = JSON.parse(localStorage.getItem('social-activity-feed'));
      if (FS.social.profile.id == attrs.activityFeed) {
        if (cachedFeed != null) {
          scope.activityFeed = cachedFeed.feed;
          $('.activity-count').text(cachedFeed.feed.length);
        }
      }
        
      // Get tree userId from friendlist object
      friendService.getFriends(attrs.activityFeed).success(function(data) {
        var treeUserId = data.friendList.tree_user_id;
        
        // Get activity feed for tree userId
        activityFeedService.getFeed(treeUserId).success(function(data) {
          $('.activity-count').text(data.list.length);
          // Message the data
          var feed = [];
          for (var i=0; i<data.list.length; i++) {
            // Data is formated such that I don't know what the names of the objects in the list are
            for (var key in data.list[i]) {
              if (data.list[i].hasOwnProperty(key)) {
                var actionName = toTitleCase(data.list[i][key].changeAction.replace(/_/g,' '));
                var targetId = data.list[i][key].changeTargetId;
                var timeStamp = data.list[i][key].timeStamp;
                var portrait = '/platform/tree/persons/'+targetId+'/portrait?default=https://cdn.mediacru.sh/j/jVaj3U2BwJqn.svg';
                timeStamp = new Date(timeStamp).toJSON().substring(0,10);
                feed.push({action: actionName, targetId: targetId, timeStamp: timeStamp, portrait: portrait});
              }
            }
          }
          scope.activityFeed = feed;
          // Only store logged in user's activity feed
          if (FS.social.profile.id == attrs.activityFeed) {
            cachedFeed = { userId: FS.social.profile.id, feed: feed };
            localStorage.setItem('social-activity-feed', JSON.stringify(cachedFeed));
          }
        });

        // Get Rerservation Count
        // TODO: Move this into its own service
        $.ajax({
          url: '/oss/list/'+treeUserId+'?start=0&count=200&disableNoCache=true',
          type: 'GET',
          headers: {"Authorization": 'Bearer '+FS.social.sessionId, "Accept": "application/json"},
          success: function(data, status, jqXHR) {
            $('.stats-ordinances').text(data.list.reservation.length);
          },
          error: function(jqXHR, data, error) {
            console.error("Ordinances: ",error);
          }
        });

        // Get recent blog articles
        // TODO: Move this into its own service
        $.ajax({
          url: 'https://familysearch.org/blog/en/feed/',
          type: 'GET',
          headers: {"Authorization": 'Bearer '+FS.social.sessionId, "Accept": "application/json"},
          success: function(data, status, jqXHR) {
            var elements = data.getElementsByTagName("title");
            for (var i=1; i<6; i++) {
              var link = data.getElementsByTagName("title")[i].nextSibling.nextSibling.innerHTML;
              $('.recent-blog').append('<li><a href="'+link+'">'+elements[i].innerHTML+'</a></li>');
            }
          },
          error: function(jqXHR, data, error) {
            console.error("blog: ",error);
          }
        });

        // Get Person Watch Count
        // TODO: Move this into its own service
        $.ajax({
          url: '/tree-data/watch/list',
          type: 'GET',
          headers: {"Authorization": 'Bearer '+FS.social.sessionId, "Accept": "application/json"},
          success: function(data, status, jqXHR) {
            $('.stats-watching').text(data.data.count);
          },
          error: function(jqXHR, data, error) {
            console.error("Watch: ",error);
          }
        });

        // Get Indexing Counts
        // TODO: Move this into its own service
        // Get UUID
        $.ajax({
          url: '/indexing-service/user/users/authenticated',
          type: 'GET',
          headers: {"Authorization": 'Bearer '+FS.social.sessionId, "Accept": "application/json"},
          success: function(data, status, jqXHR) {
            var uuid = data.uuid;
            // Get project stats
            $.ajax({
              url: '/indexing-service/statistic/facts/users/'+uuid+'/projects',
              type: 'GET',
              headers: {"Authorization": 'Bearer '+FS.social.sessionId, "Accept": "application/json"},
              contentType: 'text/plain',
              success: function(data, status, jqXHR) {
                var count = 0;
                if (typeof data != "undefined") {
                  console.log("Indexing Stats: ",data);
                  // TODO: Update the count
                }
                $('.stats-indexing').text(count);
              }, error: function(jqXHR, data, error) { console.error("Indexing Projects: ",error); }
            });
          }, error: function(jqXHR, data, error) { console.error("Indexing UUID: ",error); }
        });


      });

      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    }
  };
}]);