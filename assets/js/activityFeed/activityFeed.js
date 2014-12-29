angular.module('social').directive('activityFeed', ['activityFeedService', function(activityFeedService) {
  var styles = FS.File.loadCSS('activityFeed.css');

  return {
    restrict: 'A',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      // Get tree userId
      // TODO: Add the tree userId to the req.user object
      activityFeedService.getCurrentUser().success(function(data) {
        var userId = data.users[0].treeUserId;
        
        // Get activity feed for tree userId
        activityFeedService.getFeed(userId).success(function(data) {
          // Message the data
          var feed = [];
          for (var i=0; i<data.list.length; i++) {
            // Data is formated such that I don't know what the names of the objects in the list are
            for (var key in data.list[i]) {
              if (data.list[i].hasOwnProperty(key)) {
                var actionName = toTitleCase(data.list[i][key].changeAction.replace(/_/g,' '));
                var targetId = data.list[i][key].changeTargetId;
                var timeStamp = data.list[i][key].timeStamp;
                timeStamp = new Date(timeStamp).toJSON().substring(0,10);
                feed.push({action: actionName, targetId: targetId, timeStamp: timeStamp});
              }
            }
          }
          scope.activityFeed = feed;
        });
      });

      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    }
  };
}]);