angular.module('social').service('inviteFriendService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

  this.inviteUser = function(inviteObj) {
  	console.log(inviteObj);
    return $http.post('api/invite', inviteObj);
  };
}]);