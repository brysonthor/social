angular.module('social').service('friendService', ['$http', function($http) {
  this.getFriends = function() {
    return $http.get('api/friends', {headers: {'Authorization': 'bearer '+FS.social.sessionId}});
  };
}]);