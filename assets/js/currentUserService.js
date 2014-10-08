angular.module('social').service('currentUserService', ['$http', function($http) {
  this.getCurrentUser = function(userId) {
  	// Get currently logged in person info

    return $http.get('/platform/tree/current-person?access_token='+FS.social.sessionId);
  };
}]);