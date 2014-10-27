angular.module('social').service('inviteFriendService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

	// Invite a friend
  this.inviteUser = function(inviteObj) {
    return $http.post('api/invite', inviteObj);
  };

  // Get pending invites
  this.pendingInvitations = function() {
    return $http.get('api/invite');
  };
}]);