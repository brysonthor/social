angular.module('social').service('composeMessageService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

	// Get friend list
  this.getFriends = function(userId, cb) {
    // return $http.get('/artifactmanager/patrons/'+userId+'/taggedPersons?maxRecords=999');
  };

	// Send email
  this.sendMessage = function(composeMessage) {
    return $http.post('api/share', composeMessage);
  };
  
  // Get mailbox count
  this.getMailboxCount = function() {
    return $http.get('/u2ms/api/v1/mailbox/counters');
  }

}]);