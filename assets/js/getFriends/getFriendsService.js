angular.module('social').service('getFriendsService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

  this.getFriendList = function(userId) {
  	return $http.get('api/get/'+userId).success(function(rsp){
  		console.log(rsp);
  	});
  };
}]);