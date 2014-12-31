angular.module('social').directive('activityFeed', ['activityFeedService', 'friendService', function(activityFeedService, friendService) {
  var styles = FS.File.loadCSS('activityFeed.css');

  return {
    restrict: 'A',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      // Get tree userId
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
                var portrait = 'https://beta.familysearch.org/platform/tree/persons/'+targetId+'/portrait?default=http://www.clker.com/cliparts/5/f/9/1/11971249021105469155FunDraw_dot_com_Abraham_Lincoln.svg';
                timeStamp = new Date(timeStamp).toJSON().substring(0,10);
                feed.push({action: actionName, targetId: targetId, timeStamp: timeStamp, portrait: portrait});
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