angular.module('social').service('friendService', ['$http', function($http) {
  this.getFriends = function() {
  	var sessionId = this.getFriends.arguments[0].sessionId;
    return $http.get('/api/friends', {headers: {'Authorization': 'bearer '+sessionId}});
  };
}]);