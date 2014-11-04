angular.module('social').service('sharedPeopleService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

	// Get list of memory people to share
  this.getPeople = function(userId) {
    return $http.get('/artifactmanager/patrons/'+userId+'/taggedPersons?maxRecords=999');
  };

	// Save shared memory people
  this.savePeople = function(sharedPeople) {
  	// Get & save selected people
  	var peopleList = [];
  	for (var i=0; i<sharedPeople.length; i++) {
  		if (sharedPeople[i].selected) peopleList.push(sharedPeople[i].id);
  	}
    return $http.post('/api/share', {people: peopleList});
  };

}]);