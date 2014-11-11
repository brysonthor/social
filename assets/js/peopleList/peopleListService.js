angular.module('social').service('peopleListService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

	// Get list of memory people to share
  this.getSharedPeople = function(userId) {
    return $http.get('api/share/'+userId);
  };

}]);