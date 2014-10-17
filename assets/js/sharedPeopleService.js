angular.module('social').service('sharedPeopleService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

  this.getPeople = function(userId) {
    return $http.get('/artifactmanager/patrons/'+userId+'/taggedPersons?maxRecords=999');
  };
}]);