angular.module('social').service('activityFeedService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

  // Get the current tree userId
  this.getCurrentUser = function() {
    return $http.get('/platform/users/current?access_token='+FS.social.sessionId);
  };

	// Get list of memory people to share
  this.getFeed = function(userId) {
    return $http.get('api/activity/'+userId);
  };

}]);