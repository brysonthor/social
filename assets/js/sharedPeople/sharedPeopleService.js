angular.module('social').service('sharedPeopleService', ['$http', function($http) {
	$http.defaults.headers.common.Authorization = 'bearer '+FS.social.sessionId;

	// Get list of memory people to share
  this.getPeople = function(userId, cb) {
    // return $http.get('/artifactmanager/patrons/'+userId+'/taggedPersons?maxRecords=999');

    $http.get('/artifactmanager/patrons/'+userId+'/taggedPersons?includeSoi=false&maxRecords=999').success(function(data) {
      // Get shared people list
      $http.get('api/share').success(function(rsp) {

        // Create sharedPeople array if doesn't exist
        if (typeof rsp.sharedPeople == "undefined") rsp.sharedPeople = [];
        
        // Iterate over shared people
        for (var i=0; i<rsp.sharedPeople.length; i++) {
          // Iterate people list
          for (var j=0; j<data.taggedPerson.length; j++) {
            // Mark those in people list who have been shared
            if (data.taggedPerson[j].id == rsp.sharedPeople[i].id) {
              data.taggedPerson[j].selected = true;
            }
          }
        }
        // return data.taggedPerson;
        cb(data.taggedPerson);
      });
    });
  };

	// Save shared memory people
  this.savePeople = function(sharedPeople) {
  	// Get & save selected people
  	var peopleList = [];
  	for (var i=0; i<sharedPeople.length; i++) {
  		if (sharedPeople[i].selected) peopleList.push({
        id: sharedPeople[i].id,
        name: sharedPeople[i].name,
        portrait: sharedPeople[i].thumbIconUrl
      });
  	}
    return $http.post('api/share', {people: peopleList});
  };

}]);