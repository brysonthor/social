angular.module('social').service('userPortraitService', ['$http', function($http) {
  this.getUserPortrait = function(userId) {
    return $http.get('/platform/tree/current-person?access_token='+FS.social.sessionId, {headers: {'Authorization': 'bearer '+FS.social.sessionId}});
  };
}]);