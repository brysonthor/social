angular.module('social').service('friendService', ['$http', function($http) {
  this.getFriends = function() {
    return $http.get('api/get', {headers: {'Authorization': 'bearer '+FS.social.sessionId}});
  };
}]);