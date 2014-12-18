angular.module('social').directive('activityFeed', ['activityFeedService', function(activityFeedService) {
  var styles = FS.File.loadCSS('activityFeed.css');

  return {
    restrict: 'A',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      // activityFeedService.getFeed(attrs.activityFeed).success(function(data) {
      //   scope.activityFeed = data;
      //   console.log(data);
      // });
    }
  };
}]);