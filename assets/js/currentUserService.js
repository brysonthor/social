angular.module('social').service('currentUserService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

  this.getCurrentUser = function() {
  	// Get currently logged in person info
    return $http.get('/platform/tree/current-person?access_token='+FS.social.sessionId);
  };
}]);