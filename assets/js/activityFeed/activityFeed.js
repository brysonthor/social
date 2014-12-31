angular.module('social').directive('activityFeed', ['activityFeedService', 'friendService', function(activityFeedService, friendService) {
  var styles = FS.File.loadCSS('activityFeed.css');

  return {
    restrict: 'A',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      // Get activity feed from localstorage
      var cachedFeed = localStorage.getItem('social-activity-feed');
      if (cachedFeed) scope.activityFeed = JSON.parse(cachedFeed);
        
      // Get tree userId from friendlist object
      friendService.getFriends(attrs.activityFeed).success(function(data) {
        var treeUserId = data.friendList.tree_user_id;
        
        // Get activity feed for tree userId
        activityFeedService.getFeed(treeUserId).success(function(data) {
          // Message the data
          var feed = [];
          for (var i=0; i<data.list.length; i++) {
            // Data is formated such that I don't know what the names of the objects in the list are
            for (var key in data.list[i]) {
              if (data.list[i].hasOwnProperty(key)) {
                var actionName = toTitleCase(data.list[i][key].changeAction.replace(/_/g,' '));
                var targetId = data.list[i][key].changeTargetId;
                var timeStamp = data.list[i][key].timeStamp;
                var portrait = 'https://beta.familysearch.org/platform/tree/persons/'+targetId+'/portrait?default=https://cdn.mediacru.sh/j/jVaj3U2BwJqn.svg';
                timeStamp = new Date(timeStamp).toJSON().substring(0,10);
                feed.push({action: actionName, targetId: targetId, timeStamp: timeStamp, portrait: portrait});
              }
            }
          }
          scope.activityFeed = feed;
          localStorage.setItem('social-activity-feed', JSON.stringify(feed));
        });
      });

      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    }
  };
}]);