angular.module('social').service('inviteFriendService', ['$http', function($http) {
  this.inviteUser = function(inviteObj) {
  	console.log(inviteObj);
    return $http.post('/api/friends/invite', {headers: {'Authorization': 'bearer '+FS.social.sessionId}});
  };
}]);