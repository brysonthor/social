angular.module('social').service('currentPersonService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

  this.getCurrentPerson = function() {
  	// Get currently logged in person info
    return $http.get('/platform/tree/current-person?access_token='+FS.social.sessionId);
  };
}]);