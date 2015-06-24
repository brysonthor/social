angular.module('social').service('composeMessageService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

	// Send email
  this.sendMessage = function(composeMessage) {
    // return $http.post('/u2ms/api/v1/messages', composeMessage);
    return $http.post('/fst/mailbox/u2ms/api/v1/threads', composeMessage);
  };
  
  // Get mailbox count
  this.getMailboxCount = function() {
    // return $http.get('/u2ms/api/v1/mailbox/counters');
    return $http.get('/fst/mailbox/u2ms/api/v1/users/'+FS.social.profile.id+'/counters');
  }

}]);