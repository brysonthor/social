angular.module('social').service('activityFeedService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

	// Get list of memory people to share
  this.getFeed = function(userId) {
    return $http.get('api/activity/'+userId);
  };

}]);