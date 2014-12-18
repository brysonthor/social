angular.module('social').service('composeMessageService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

	// Send email
  this.sendMessage = function(composeMessage) {
    return $http.post('/u2ms/api/v1/messages', composeMessage);
  };
  
  // Get mailbox count
  this.getMailboxCount = function() {
    return $http.get('/u2ms/api/v1/mailbox/counters');
  }

}]);