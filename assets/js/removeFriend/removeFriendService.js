angular.module('social').service('removeFriendService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

  this.remove = function(userId) {
  	return $http.delete('api/remove/'+userId).success(function(rsp){
  	});
  };
}]);