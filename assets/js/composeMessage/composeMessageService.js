angular.module('social').service('composeMessageService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

	// Send email
  this.sendMessage = function(composeMessage) {
    var sessionId = FS.Cookie.getCookie('fssessionid');
    return $http({
      "url":'/fst/mailbox/u2ms/api/v1/threads',
      "method": 'POST',
      "data": composeMessage,
      "headers": {'Authorization': 'Bearer' + sessionId}
    });
  };
  
  // Get mailbox count
  this.getMailboxCount = function() {
    return $http.get('/fst/fs-messages/users/'+FS.social.profile.id+'/counters');
  }

}]);