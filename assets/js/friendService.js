angular.module('social').service('friendService', ['$http', function($http) {
  this.getFriends = function(userId) {
    return $http.get('api/get/'+userId, {headers: {'Authorization': 'bearer '+FS.social.sessionId}});
  };
}]);